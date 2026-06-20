-- Business-rule regression tests for the booking domain.
-- Run against a freshly reset local database:
--   supabase db reset
--   psql "$DB_URL" -v ON_ERROR_STOP=1 -f supabase/tests/booking_rules_test.sql
--
-- The whole script runs in one transaction and rolls back at the end, leaving the
-- database untouched. Any failed assertion raises and aborts with ON_ERROR_STOP.

begin;

create or replace function pg_temp.assert(p_cond boolean, p_msg text)
returns void language plpgsql as $$
begin
  if not p_cond then
    raise exception 'ASSERTION FAILED: %', p_msg;
  end if;
end;
$$;

-- --- Fixtures: member B + admin role, capacity-1 class (member A/701 is seeded). ---
insert into auth.users (instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at,confirmation_token,recovery_token,email_change_token_new,email_change,is_super_admin)
values ('00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000111','authenticated','authenticated','test.b@cloudcore.local',extensions.crypt('x',extensions.gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','','','',false)
on conflict (id) do nothing;
insert into public.profiles (id, full_name, email) values ('00000000-0000-0000-0000-000000000111','Test B','test.b@cloudcore.local') on conflict (id) do nothing;
insert into public.roles (profile_id, role) values ('00000000-0000-0000-0000-000000000111','member') on conflict do nothing;
insert into public.members (id, profile_id, member_number) values ('00000000-0000-0000-0000-000000000711','00000000-0000-0000-0000-000000000111','TEST-B') on conflict (id) do nothing;
insert into public.memberships (id, member_id, plan_id, status, starts_at, expires_at, remaining_credits)
values ('00000000-0000-0000-0000-000000000811','00000000-0000-0000-0000-000000000711','00000000-0000-0000-0000-0000000006a2','active',now()-interval '1h',now()+interval '30d',10)
on conflict (id) do nothing;
insert into public.roles(profile_id, role) values ('00000000-0000-0000-0000-000000000102','admin') on conflict do nothing;

update public.class_sessions
set capacity = 1, starts_at = now() + interval '2 days', ends_at = now() + interval '2 days 1 hour', status = 'open'
where id = '00000000-0000-0000-0000-000000000901';

-- All assertions run inside one plpgsql block so we can call SECURITY DEFINER
-- functions under different simulated users via set_config(..., is_local => true).
do $$
declare
  v_a uuid := '00000000-0000-0000-0000-000000000101'; -- member A profile
  v_b uuid := '00000000-0000-0000-0000-000000000111'; -- member B profile
  v_admin uuid := '00000000-0000-0000-0000-000000000102';
  v_session uuid := '00000000-0000-0000-0000-000000000901';
  v_session2 uuid := '00000000-0000-0000-0000-000000000902';
  v_res jsonb;
  v_credits integer;
  v_charged boolean;
  v_bid uuid;
  v_status text;
  v_err text;
begin
  -- Test 1: A books -> confirmed, credit 10 -> 9, credit_charged true.
  perform set_config('request.jwt.claims', json_build_object('sub', v_a)::text, true);
  v_res := public.book_class(v_session);
  perform pg_temp.assert(v_res->>'status' = 'booked', 'T1 A should be booked, got '||coalesce(v_res->>'status','null'));
  select remaining_credits into v_credits from public.memberships where id='00000000-0000-0000-0000-000000000801';
  perform pg_temp.assert(v_credits = 9, 'T1 A credits should be 9, got '||v_credits);

  -- Test 2: B books full class -> waitlisted, B credit stays 10.
  perform set_config('request.jwt.claims', json_build_object('sub', v_b)::text, true);
  v_res := public.book_class(v_session);
  perform pg_temp.assert(v_res->>'status' = 'waitlisted', 'T2 B should be waitlisted, got '||coalesce(v_res->>'status','null'));
  select remaining_credits into v_credits from public.memberships where id='00000000-0000-0000-0000-000000000811';
  perform pg_temp.assert(v_credits = 10, 'T2 B credits should still be 10, got '||v_credits);

  -- Test 3: B tries to book again -> already_booked.
  begin
    v_res := public.book_class(v_session);
    perform pg_temp.assert(false, 'T3 duplicate booking should have raised');
  exception when others then
    get stacked diagnostics v_err = message_text;
    perform pg_temp.assert(v_err = 'already_booked', 'T3 expected already_booked, got '||v_err);
  end;

  -- Test 4: A cancels early -> A refunded to 10, B promoted + charged to 9.
  perform set_config('request.jwt.claims', json_build_object('sub', v_a)::text, true);
  select id into v_bid from public.bookings where member_id='00000000-0000-0000-0000-000000000701' and status='confirmed';
  v_res := public.cancel_booking(v_bid);
  perform pg_temp.assert((v_res->>'refunded')::boolean is true, 'T4 early cancel should refund');
  select remaining_credits into v_credits from public.memberships where id='00000000-0000-0000-0000-000000000801';
  perform pg_temp.assert(v_credits = 10, 'T4 A credits should be back to 10, got '||v_credits);
  select status into v_status from public.bookings where member_id='00000000-0000-0000-0000-000000000711';
  perform pg_temp.assert(v_status = 'confirmed', 'T4 B should be promoted to confirmed, got '||v_status);
  select remaining_credits into v_credits from public.memberships where id='00000000-0000-0000-0000-000000000811';
  perform pg_temp.assert(v_credits = 9, 'T4 B credits should be 9 after promotion, got '||v_credits);

  -- Test 5: Late cancel -> no refund. Move class start inside the deadline window.
  update public.class_sessions set starts_at = now() + interval '30 min', ends_at = now() + interval '90 min' where id = v_session;
  perform set_config('request.jwt.claims', json_build_object('sub', v_b)::text, true);
  select id into v_bid from public.bookings where member_id='00000000-0000-0000-0000-000000000711' and status='confirmed';
  v_res := public.cancel_booking(v_bid);
  perform pg_temp.assert(v_res->>'status' = 'late_cancelled', 'T5 should be late_cancelled, got '||coalesce(v_res->>'status','null'));
  perform pg_temp.assert((v_res->>'refunded')::boolean is false, 'T5 late cancel should not refund');
  select remaining_credits into v_credits from public.memberships where id='00000000-0000-0000-0000-000000000811';
  perform pg_temp.assert(v_credits = 9, 'T5 B credits should stay 9 after late cancel, got '||v_credits);

  -- Test 6: Admin credit adjustment + non-admin rejection.
  perform set_config('request.jwt.claims', json_build_object('sub', v_admin)::text, true);
  v_credits := public.admin_adjust_credits('00000000-0000-0000-0000-000000000811', 5, 'test comp');
  perform pg_temp.assert(v_credits = 14, 'T6 admin adjust should yield 14, got '||v_credits);
  perform set_config('request.jwt.claims', json_build_object('sub', v_a)::text, true);
  begin
    perform public.admin_adjust_credits('00000000-0000-0000-0000-000000000811', 100, 'hack');
    perform pg_temp.assert(false, 'T6 non-admin adjust should have raised');
  exception when others then
    get stacked diagnostics v_err = message_text;
    perform pg_temp.assert(v_err = 'not_authorized', 'T6 expected not_authorized, got '||v_err);
  end;

  -- Test 7: Attendance present -> booking completed.
  perform set_config('request.jwt.claims', json_build_object('sub', v_a)::text, true);
  v_res := public.book_class(v_session2);
  select id into v_bid from public.bookings where class_session_id=v_session2 and member_id='00000000-0000-0000-0000-000000000701';
  perform set_config('request.jwt.claims', json_build_object('sub', v_admin)::text, true);
  perform public.mark_attendance(v_bid, 'present');
  select status into v_status from public.bookings where id=v_bid;
  perform pg_temp.assert(v_status = 'completed', 'T7 booking should be completed after present, got '||v_status);

  -- Test 8: Activity log captured the key actions.
  perform pg_temp.assert(
    (select count(distinct action) from public.audit_logs
     where action in ('booking_created','waitlist_joined','booking_cancelled','waitlist_promoted','booking_late_cancelled','credits_adjusted','attendance_marked')) = 7,
    'T8 expected all 7 activity actions logged'
  );

  raise notice 'ALL BOOKING RULE TESTS PASSED';
end $$;

rollback;
