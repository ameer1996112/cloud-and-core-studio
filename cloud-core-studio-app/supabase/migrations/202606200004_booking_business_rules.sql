-- Core booking business rules: credit tracking, cancellation, waitlist promotion,
-- attendance, admin credit adjustments, activity logging, and real plan seeds.
--
-- Activity log: the existing public.audit_logs table is the canonical activity log.
-- Cancellation deadline per class: resolved from the session's cancellation_policies
-- row (free_cancel_until_hours), falling back to app_settings.

-- ---------------------------------------------------------------------------
-- Schema additions
-- ---------------------------------------------------------------------------

-- Track whether a booking actually consumed a credit, so cancellation can refund
-- exactly once and only for credit-based plans.
alter table public.bookings
  add column if not exists credit_charged boolean not null default false;

-- Default operational settings (idempotent upsert).
insert into public.app_settings (key, value)
values
  ('studio_timezone', '"Asia/Jerusalem"'::jsonb),
  ('default_cancellation_deadline_minutes', '120'::jsonb),
  ('waitlist_auto_promote', 'true'::jsonb),
  ('booking_window_days', '14'::jsonb)
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- Activity log helper
-- ---------------------------------------------------------------------------
create or replace function public.log_activity(
  p_action text,
  p_entity_table text,
  p_entity_id uuid,
  p_after jsonb default '{}'::jsonb,
  p_before jsonb default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_logs(actor_profile_id, action, entity_table, entity_id, before_data, after_data)
  values (auth.uid(), p_action, p_entity_table, p_entity_id, p_before, p_after);
end;
$$;

-- ---------------------------------------------------------------------------
-- Resolve the cancellation deadline (in minutes) for a session.
-- Priority: session policy hours -> app_settings default -> hard fallback (120).
-- ---------------------------------------------------------------------------
create or replace function public.session_cancellation_minutes(p_session_id uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select cp.free_cancel_until_hours * 60
      from public.class_sessions cs
      join public.cancellation_policies cp on cp.id = cs.cancellation_policy_id
      where cs.id = p_session_id
    ),
    (select (value #>> '{}')::integer from public.app_settings where key = 'default_cancellation_deadline_minutes'),
    120
  );
$$;

-- ---------------------------------------------------------------------------
-- book_class: rebuilt to record credit_charged and log activity.
-- Returns jsonb { status, booking_id | waitlist_id, waitlist_position }.
-- ---------------------------------------------------------------------------
create or replace function public.book_class(p_session_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_member_id uuid;
  v_membership_id uuid;
  v_remaining_credits integer;
  v_is_credit_based boolean;
  v_capacity integer;
  v_starts_at timestamptz;
  v_status public.session_status;
  v_waitlist_enabled boolean;
  v_booked integer;
  v_booking_id uuid;
  v_waitlist_id uuid;
  v_position integer;
begin
  select id into v_member_id
  from public.members
  where profile_id = auth.uid()
    and deleted_at is null;

  if v_member_id is null then
    raise exception 'member_profile_required';
  end if;

  -- Lock the session row first to serialize concurrent bookings on the same class.
  select capacity, starts_at, status
    into v_capacity, v_starts_at, v_status
  from public.class_sessions
  where id = p_session_id
    and deleted_at is null
  for update;

  if v_capacity is null or v_status not in ('open', 'full', 'waitlist') or v_starts_at <= now() then
    raise exception 'class_not_bookable';
  end if;

  -- Pick the best active membership: prefer unlimited or one with credits remaining.
  select id, remaining_credits
    into v_membership_id, v_remaining_credits
  from public.memberships
  where member_id = v_member_id
    and status = 'active'
    and deleted_at is null
    and starts_at <= now()
    and (expires_at is null or expires_at > now())
    and (remaining_credits is null or remaining_credits > 0)
  order by
    case when remaining_credits is null then 0 else 1 end, -- unlimited first
    expires_at nulls last,
    created_at desc
  limit 1
  for update;

  if v_membership_id is null then
    raise exception 'membership_required';
  end if;

  v_is_credit_based := v_remaining_credits is not null;

  -- Prevent duplicate active booking or waitlist for the same class.
  if exists (
    select 1 from public.bookings
    where class_session_id = p_session_id
      and member_id = v_member_id
      and status in ('confirmed', 'completed')
      and deleted_at is null
  ) or exists (
    select 1 from public.waitlist_entries
    where class_session_id = p_session_id
      and member_id = v_member_id
      and status in ('waiting', 'offered')
      and deleted_at is null
  ) then
    raise exception 'already_booked';
  end if;

  select count(*) into v_booked
  from public.bookings
  where class_session_id = p_session_id
    and status = 'confirmed'
    and deleted_at is null;

  if v_booked < v_capacity then
    insert into public.bookings(class_session_id, member_id, membership_id, status, credit_charged)
    values (p_session_id, v_member_id, v_membership_id, 'confirmed', v_is_credit_based)
    returning id into v_booking_id;

    if v_is_credit_based then
      update public.memberships
      set remaining_credits = remaining_credits - 1
      where id = v_membership_id;
    end if;

    if v_booked + 1 >= v_capacity then
      update public.class_sessions set status = 'full'
      where id = p_session_id and status = 'open';
    end if;

    perform public.log_activity(
      'booking_created', 'bookings', v_booking_id,
      jsonb_build_object('session_id', p_session_id, 'credit_charged', v_is_credit_based)
    );

    return jsonb_build_object('status', 'booked', 'booking_id', v_booking_id);
  end if;

  -- Class is full: join waitlist if enabled (waitlist is enabled when the session
  -- is in a waitlist-capable state; capacity reached drives this here).
  select coalesce(max(position), 0) + 1 into v_position
  from public.waitlist_entries
  where class_session_id = p_session_id
    and status in ('waiting', 'offered')
    and deleted_at is null;

  insert into public.waitlist_entries(class_session_id, member_id, position, status)
  values (p_session_id, v_member_id, v_position, 'waiting')
  returning id into v_waitlist_id;

  update public.class_sessions set status = 'waitlist'
  where id = p_session_id and status in ('open', 'full');

  perform public.log_activity(
    'waitlist_joined', 'waitlist_entries', v_waitlist_id,
    jsonb_build_object('session_id', p_session_id, 'position', v_position)
  );

  return jsonb_build_object('status', 'waitlisted', 'waitlist_id', v_waitlist_id, 'waitlist_position', v_position);
end;
$$;

-- ---------------------------------------------------------------------------
-- promote_waitlist: promote the first eligible waiting entry into a confirmed
-- booking, deducting a credit when their plan is credit-based. Returns the new
-- booking id, or null if nobody could be promoted.
-- ---------------------------------------------------------------------------
create or replace function public.promote_waitlist(p_session_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_capacity integer;
  v_booked integer;
  v_entry record;
  v_membership_id uuid;
  v_remaining_credits integer;
  v_is_credit_based boolean;
  v_booking_id uuid;
  v_profile_id uuid;
begin
  select capacity into v_capacity
  from public.class_sessions
  where id = p_session_id and deleted_at is null
  for update;

  if v_capacity is null then
    return null;
  end if;

  select count(*) into v_booked
  from public.bookings
  where class_session_id = p_session_id and status = 'confirmed' and deleted_at is null;

  if v_booked >= v_capacity then
    return null; -- no free spot
  end if;

  -- Walk the waitlist in order; skip members without an eligible membership.
  for v_entry in
    select we.id, we.member_id, we.position
    from public.waitlist_entries we
    where we.class_session_id = p_session_id
      and we.status = 'waiting'
      and we.deleted_at is null
    order by we.position asc, we.created_at asc
  loop
    select id, remaining_credits
      into v_membership_id, v_remaining_credits
    from public.memberships
    where member_id = v_entry.member_id
      and status = 'active'
      and deleted_at is null
      and starts_at <= now()
      and (expires_at is null or expires_at > now())
      and (remaining_credits is null or remaining_credits > 0)
    order by case when remaining_credits is null then 0 else 1 end, expires_at nulls last, created_at desc
    limit 1
    for update;

    if v_membership_id is null then
      continue; -- not eligible, try next
    end if;

    v_is_credit_based := v_remaining_credits is not null;

    insert into public.bookings(class_session_id, member_id, membership_id, status, credit_charged)
    values (p_session_id, v_entry.member_id, v_membership_id, 'confirmed', v_is_credit_based)
    returning id into v_booking_id;

    if v_is_credit_based then
      update public.memberships set remaining_credits = remaining_credits - 1 where id = v_membership_id;
    end if;

    update public.waitlist_entries set status = 'confirmed', updated_at = now() where id = v_entry.id;

    -- Reorder remaining waiting entries to keep positions contiguous from 1.
    with ordered as (
      select id, row_number() over (order by position asc, created_at asc) as rn
      from public.waitlist_entries
      where class_session_id = p_session_id and status = 'waiting' and deleted_at is null
    )
    update public.waitlist_entries we
    set position = ordered.rn
    from ordered
    where we.id = ordered.id;

    -- Keep session marked full while it remains at capacity.
    update public.class_sessions set status = 'full'
    where id = p_session_id and status in ('open', 'waitlist');

    select profile_id into v_profile_id from public.members where id = v_entry.member_id;

    insert into public.notifications(profile_id, channel, type, title, body, payload)
    values (
      v_profile_id, 'push', 'waitlist_promoted',
      'You''re in!', 'A spot opened up and your waitlist booking is now confirmed.',
      jsonb_build_object('session_id', p_session_id, 'booking_id', v_booking_id)
    );

    perform public.log_activity(
      'waitlist_promoted', 'bookings', v_booking_id,
      jsonb_build_object('session_id', p_session_id, 'member_id', v_entry.member_id, 'credit_charged', v_is_credit_based)
    );

    return v_booking_id;
  end loop;

  return null; -- nobody eligible
end;
$$;

-- ---------------------------------------------------------------------------
-- cancel_booking: cancel a confirmed booking, applying the per-class deadline.
-- Early -> refund credit (if charged) + promote waitlist. Late -> no refund.
-- ---------------------------------------------------------------------------
create or replace function public.cancel_booking(p_booking_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking record;
  v_starts_at timestamptz;
  v_deadline_minutes integer;
  v_is_late boolean;
  v_caller_member_id uuid;
  v_is_admin boolean;
begin
  v_is_admin := public.is_admin();
  select id into v_caller_member_id from public.members where profile_id = auth.uid() and deleted_at is null;

  select b.*, cs.starts_at as session_starts_at
    into v_booking
  from public.bookings b
  join public.class_sessions cs on cs.id = b.class_session_id
  where b.id = p_booking_id and b.deleted_at is null
  for update;

  if v_booking.id is null then
    raise exception 'booking_not_found';
  end if;

  if not v_is_admin and v_booking.member_id is distinct from v_caller_member_id then
    raise exception 'not_authorized';
  end if;

  if v_booking.status not in ('confirmed') then
    raise exception 'booking_not_cancellable';
  end if;

  v_starts_at := v_booking.session_starts_at;
  v_deadline_minutes := public.session_cancellation_minutes(v_booking.class_session_id);
  v_is_late := now() > (v_starts_at - make_interval(mins => v_deadline_minutes));

  if v_is_late then
    update public.bookings
    set status = 'late_cancelled', cancelled_at = now(), cancellation_reason = 'late_cancel'
    where id = p_booking_id;

    perform public.log_activity(
      'booking_late_cancelled', 'bookings', p_booking_id,
      jsonb_build_object('session_id', v_booking.class_session_id, 'refunded', false)
    );

    return jsonb_build_object('status', 'late_cancelled', 'refunded', false);
  end if;

  -- Early cancellation.
  update public.bookings
  set status = 'cancelled', cancelled_at = now(), cancellation_reason = 'early_cancel'
  where id = p_booking_id;

  if v_booking.credit_charged and v_booking.membership_id is not null then
    update public.memberships
    set remaining_credits = coalesce(remaining_credits, 0) + 1
    where id = v_booking.membership_id and remaining_credits is not null;
  end if;

  -- Open the session back up, then attempt waitlist promotion into the freed spot.
  update public.class_sessions set status = 'open'
  where id = v_booking.class_session_id and status in ('full', 'waitlist');

  perform public.promote_waitlist(v_booking.class_session_id);

  perform public.log_activity(
    'booking_cancelled', 'bookings', p_booking_id,
    jsonb_build_object('session_id', v_booking.class_session_id, 'refunded', v_booking.credit_charged)
  );

  return jsonb_build_object('status', 'cancelled', 'refunded', v_booking.credit_charged);
end;
$$;

-- ---------------------------------------------------------------------------
-- mark_attendance: admin/instructor records attendance for a booking.
-- ---------------------------------------------------------------------------
create or replace function public.mark_attendance(p_booking_id uuid, p_status text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_session_id uuid;
  v_instructor_id uuid;
  v_record_id uuid;
begin
  if p_status not in ('present', 'absent', 'late', 'no_show') then
    raise exception 'invalid_attendance_status';
  end if;

  select class_session_id into v_session_id from public.bookings where id = p_booking_id and deleted_at is null;
  if v_session_id is null then
    raise exception 'booking_not_found';
  end if;

  if not (public.is_admin() or public.is_instructor_for_session(v_session_id)) then
    raise exception 'not_authorized';
  end if;

  select i.id into v_instructor_id
  from public.instructors i
  where i.profile_id = auth.uid()
  limit 1;

  -- One attendance record per booking: update in place if it exists.
  select id into v_record_id from public.attendance_records where booking_id = p_booking_id limit 1;
  if v_record_id is null then
    insert into public.attendance_records(booking_id, instructor_id, status)
    values (p_booking_id, v_instructor_id, p_status)
    returning id into v_record_id;
  else
    update public.attendance_records
    set status = p_status, instructor_id = coalesce(v_instructor_id, instructor_id), marked_at = now(), updated_at = now()
    where id = v_record_id;
  end if;

  -- Reflect terminal attendance on the booking for history views.
  if p_status = 'present' then
    update public.bookings set status = 'completed' where id = p_booking_id and status = 'confirmed';
  elsif p_status in ('absent', 'no_show') then
    update public.bookings set status = 'no_show' where id = p_booking_id and status = 'confirmed';
  end if;

  perform public.log_activity(
    'attendance_marked', 'attendance_records', v_record_id,
    jsonb_build_object('booking_id', p_booking_id, 'status', p_status)
  );

  return v_record_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- admin_adjust_credits: admin-only manual credit change with audit trail.
-- ---------------------------------------------------------------------------
create or replace function public.admin_adjust_credits(
  p_membership_id uuid,
  p_delta integer,
  p_note text default null
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old integer;
  v_new integer;
begin
  if not public.is_admin() then
    raise exception 'not_authorized';
  end if;

  select remaining_credits into v_old from public.memberships where id = p_membership_id for update;
  if v_old is null then
    raise exception 'membership_not_credit_based_or_missing';
  end if;

  v_new := greatest(0, v_old + p_delta);
  update public.memberships set remaining_credits = v_new where id = p_membership_id;

  perform public.log_activity(
    'credits_adjusted', 'memberships', p_membership_id,
    jsonb_build_object('delta', p_delta, 'new_balance', v_new, 'note', p_note),
    jsonb_build_object('old_balance', v_old)
  );

  return v_new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Grants for authenticated callers (RLS + in-function checks still apply).
-- ---------------------------------------------------------------------------
grant execute on function public.book_class(uuid) to authenticated;
grant execute on function public.cancel_booking(uuid) to authenticated;
grant execute on function public.mark_attendance(uuid, text) to authenticated;
grant execute on function public.admin_adjust_credits(uuid, integer, text) to authenticated;
-- promote_waitlist and log_activity are internal; callable by service role only.
revoke execute on function public.promote_waitlist(uuid) from authenticated, anon;
revoke execute on function public.log_activity(text, text, uuid, jsonb, jsonb) from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Real production plans (₪280 monthly unlimited, ₪350 10-pack, ₪2800 annual).
-- Prices stored in minor units (agorot). Stable IDs for idempotent seeding.
-- ---------------------------------------------------------------------------
insert into public.membership_plans (id, name_he, name_en, plan_type, credits, duration_days, price_minor, currency, is_active)
values
  ('00000000-0000-0000-0000-0000000006a1', 'מנוי חודשי ללא הגבלה', 'Monthly Unlimited', 'monthly', null, 30, 28000, 'ILS', true),
  ('00000000-0000-0000-0000-0000000006a2', 'כרטיסיית 10 שיעורים', '10-Class Pack', 'class_card', 10, 180, 35000, 'ILS', true),
  ('00000000-0000-0000-0000-0000000006a3', 'מנוי שנתי', 'Annual', 'subscription', null, 365, 280000, 'ILS', true)
on conflict (id) do update
set
  name_he = excluded.name_he,
  name_en = excluded.name_en,
  plan_type = excluded.plan_type,
  credits = excluded.credits,
  duration_days = excluded.duration_days,
  price_minor = excluded.price_minor,
  currency = excluded.currency,
  is_active = excluded.is_active,
  updated_at = now(),
  deleted_at = null;
