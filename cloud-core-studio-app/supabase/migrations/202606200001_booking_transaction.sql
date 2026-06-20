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
  v_capacity integer;
  v_starts_at timestamptz;
  v_status public.session_status;
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

  select id, remaining_credits
    into v_membership_id, v_remaining_credits
  from public.memberships
  where member_id = v_member_id
    and status = 'active'
    and deleted_at is null
    and starts_at <= now()
    and (expires_at is null or expires_at > now())
  order by
    case when remaining_credits is null or remaining_credits > 0 then 0 else 1 end,
    expires_at nulls last,
    created_at desc
  limit 1
  for update;

  if v_membership_id is null then
    raise exception 'membership_required';
  end if;

  if v_remaining_credits is not null and v_remaining_credits <= 0 then
    raise exception 'no_credits';
  end if;

  select capacity, starts_at, status
    into v_capacity, v_starts_at, v_status
  from public.class_sessions
  where id = p_session_id
    and deleted_at is null
  for update;

  if v_capacity is null or v_status not in ('open', 'full', 'waitlist') or v_starts_at <= now() then
    raise exception 'class_not_bookable';
  end if;

  if exists (
    select 1
    from public.bookings
    where class_session_id = p_session_id
      and member_id = v_member_id
      and status in ('confirmed', 'completed')
      and deleted_at is null
  ) or exists (
    select 1
    from public.waitlist_entries
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
    insert into public.bookings(class_session_id, member_id, membership_id, status)
    values (p_session_id, v_member_id, v_membership_id, 'confirmed')
    returning id into v_booking_id;

    if v_remaining_credits is not null then
      update public.memberships
      set remaining_credits = remaining_credits - 1
      where id = v_membership_id;
    end if;

    if v_booked + 1 >= v_capacity then
      update public.class_sessions
      set status = 'full'
      where id = p_session_id
        and status = 'open';
    end if;

    return jsonb_build_object(
      'status', 'booked',
      'booking_id', v_booking_id
    );
  end if;

  if v_status not in ('full', 'waitlist', 'open') then
    raise exception 'class_full';
  end if;

  select coalesce(max(position), 0) + 1 into v_position
  from public.waitlist_entries
  where class_session_id = p_session_id
    and status in ('waiting', 'offered')
    and deleted_at is null;

  insert into public.waitlist_entries(class_session_id, member_id, position, status)
  values (p_session_id, v_member_id, v_position, 'waiting')
  returning id into v_waitlist_id;

  update public.class_sessions
  set status = 'waitlist'
  where id = p_session_id
    and status in ('open', 'full');

  return jsonb_build_object(
    'status', 'waitlisted',
    'waitlist_id', v_waitlist_id,
    'waitlist_position', v_position
  );
end;
$$;
