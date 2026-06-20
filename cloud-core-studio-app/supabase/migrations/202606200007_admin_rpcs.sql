-- Admin-callable RPC variants for server actions invoked through the service-role
-- client (no auth.uid() context). These take an explicit p_actor for audit
-- attribution and are restricted to the service_role.

-- ---------------------------------------------------------------------------
-- mark_attendance_as: like mark_attendance but with an explicit actor and no
-- auth.uid() dependency. Authorization is enforced by the caller (server action
-- runs requireAdmin()); execution is restricted to service_role.
-- ---------------------------------------------------------------------------
create or replace function public.mark_attendance_as(
  p_booking_id uuid,
  p_status text,
  p_actor uuid
)
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

  select class_session_id into v_session_id
  from public.bookings where id = p_booking_id and deleted_at is null;
  if v_session_id is null then
    raise exception 'booking_not_found';
  end if;

  select id into v_record_id from public.attendance_records where booking_id = p_booking_id limit 1;
  if v_record_id is null then
    insert into public.attendance_records(booking_id, status)
    values (p_booking_id, p_status)
    returning id into v_record_id;
  else
    update public.attendance_records
    set status = p_status, marked_at = now(), updated_at = now()
    where id = v_record_id;
  end if;

  if p_status = 'present' then
    update public.bookings set status = 'completed' where id = p_booking_id and status = 'confirmed';
  elsif p_status in ('absent', 'no_show') then
    update public.bookings set status = 'no_show' where id = p_booking_id and status = 'confirmed';
  end if;

  insert into public.audit_logs(actor_profile_id, action, entity_table, entity_id, after_data)
  values (p_actor, 'attendance_marked', 'attendance_records', v_record_id,
          jsonb_build_object('booking_id', p_booking_id, 'status', p_status));

  return v_record_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- mark_all_present: mark every confirmed booking in a session as present.
-- ---------------------------------------------------------------------------
create or replace function public.mark_all_present(
  p_session_id uuid,
  p_actor uuid
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer := 0;
  v_booking record;
begin
  for v_booking in
    select id from public.bookings
    where class_session_id = p_session_id and status = 'confirmed' and deleted_at is null
  loop
    perform public.mark_attendance_as(v_booking.id, 'present', p_actor);
    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;

-- ---------------------------------------------------------------------------
-- admin_cancel_class: soft-cancel a session (status='cancelled'). Never hard
-- deletes. Cancels confirmed bookings and refunds credits where charged.
-- ---------------------------------------------------------------------------
create or replace function public.admin_cancel_class(
  p_session_id uuid,
  p_actor uuid
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer := 0;
  v_booking record;
begin
  update public.class_sessions
  set status = 'cancelled', updated_at = now()
  where id = p_session_id and deleted_at is null;

  -- Refund + cancel all confirmed bookings for the class.
  for v_booking in
    select id, membership_id, credit_charged
    from public.bookings
    where class_session_id = p_session_id and status = 'confirmed' and deleted_at is null
  loop
    update public.bookings
    set status = 'cancelled', cancelled_at = now(), cancellation_reason = 'class_cancelled'
    where id = v_booking.id;

    if v_booking.credit_charged and v_booking.membership_id is not null then
      update public.memberships
      set remaining_credits = coalesce(remaining_credits, 0) + 1
      where id = v_booking.membership_id and remaining_credits is not null;
    end if;

    v_count := v_count + 1;
  end loop;

  -- Expire any outstanding waitlist entries.
  update public.waitlist_entries
  set status = 'cancelled', updated_at = now()
  where class_session_id = p_session_id and status in ('waiting', 'offered');

  insert into public.audit_logs(actor_profile_id, action, entity_table, entity_id, after_data)
  values (p_actor, 'class_cancelled', 'class_sessions', p_session_id,
          jsonb_build_object('refunded_bookings', v_count));

  return v_count;
end;
$$;

-- Restrict admin RPCs to service_role (server actions only).
revoke execute on function public.mark_attendance_as(uuid, text, uuid) from authenticated, anon;
revoke execute on function public.mark_all_present(uuid, uuid) from authenticated, anon;
revoke execute on function public.admin_cancel_class(uuid, uuid) from authenticated, anon;
grant execute on function public.mark_attendance_as(uuid, text, uuid) to service_role;
grant execute on function public.mark_all_present(uuid, uuid) to service_role;
grant execute on function public.admin_cancel_class(uuid, uuid) to service_role;
