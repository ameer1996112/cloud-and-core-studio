insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  is_super_admin
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000101',
    'authenticated',
    'authenticated',
    'demo.customer@cloudcore.local',
    extensions.crypt('CloudCoreDemo123!', extensions.gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Demo Customer"}',
    now(),
    now(),
    '',
    '',
    '',
    '',
    false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000102',
    'authenticated',
    'authenticated',
    'demo.instructor@cloudcore.local',
    extensions.crypt('CloudCoreDemo123!', extensions.gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Maya Levi"}',
    now(),
    now(),
    '',
    '',
    '',
    '',
    false
  )
on conflict (id) do update
set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = now();

insert into auth.identities (
  id,
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
values
  (
    '00000000-0000-0000-0000-000000001101',
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000101',
    '{"sub": "00000000-0000-0000-0000-000000000101", "email": "demo.customer@cloudcore.local", "email_verified": true}',
    'email',
    now(),
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000001102',
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000102',
    '{"sub": "00000000-0000-0000-0000-000000000102", "email": "demo.instructor@cloudcore.local", "email_verified": true}',
    'email',
    now(),
    now(),
    now()
  )
on conflict (provider_id, provider) do update
set
  identity_data = excluded.identity_data,
  updated_at = now();

insert into public.profiles (id, full_name, email, phone, locale)
values
  (
    '00000000-0000-0000-0000-000000000101',
    'Demo Customer',
    'demo.customer@cloudcore.local',
    '+972500000101',
    'en'
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    'Maya Levi',
    'demo.instructor@cloudcore.local',
    '+972500000102',
    'en'
  )
on conflict (id) do update
set
  full_name = excluded.full_name,
  email = excluded.email,
  phone = excluded.phone,
  locale = excluded.locale,
  updated_at = now(),
  deleted_at = null;

insert into public.roles (profile_id, role)
values
  ('00000000-0000-0000-0000-000000000101', 'member'),
  ('00000000-0000-0000-0000-000000000102', 'instructor')
on conflict (profile_id, role) do nothing;

insert into public.locations (id, name, address, timezone)
values (
  '00000000-0000-0000-0000-000000000201',
  'Cloud & Core Studio',
  'Demo Studio, Tel Aviv',
  'Asia/Jerusalem'
)
on conflict (id) do update
set
  name = excluded.name,
  address = excluded.address,
  timezone = excluded.timezone,
  updated_at = now(),
  deleted_at = null;

insert into public.rooms (id, location_id, name, capacity)
values (
  '00000000-0000-0000-0000-000000000202',
  '00000000-0000-0000-0000-000000000201',
  'Core Room',
  8
)
on conflict (id) do update
set
  location_id = excluded.location_id,
  name = excluded.name,
  capacity = excluded.capacity,
  updated_at = now(),
  deleted_at = null;

insert into public.class_categories (id, name_he, name_en, color)
values (
  '00000000-0000-0000-0000-000000000301',
  'פילאטיס',
  'Pilates',
  '#1E6F68'
)
on conflict (id) do update
set
  name_he = excluded.name_he,
  name_en = excluded.name_en,
  color = excluded.color,
  updated_at = now(),
  deleted_at = null;

insert into public.cancellation_policies (id, name, free_cancel_until_hours, return_credit, late_cancel_penalty)
values (
  '00000000-0000-0000-0000-000000000401',
  'Demo 12 hour cancellation',
  12,
  true,
  'Credit is not returned after the free cancellation window.'
)
on conflict (id) do update
set
  name = excluded.name,
  free_cancel_until_hours = excluded.free_cancel_until_hours,
  return_credit = excluded.return_credit,
  late_cancel_penalty = excluded.late_cancel_penalty,
  updated_at = now(),
  deleted_at = null;

insert into public.instructors (id, profile_id, display_name, bio, is_active)
values (
  '00000000-0000-0000-0000-000000000501',
  '00000000-0000-0000-0000-000000000102',
  'Maya Levi',
  'Pilates and mobility instructor for the Cloud & Core demo flow.',
  true
)
on conflict (id) do update
set
  profile_id = excluded.profile_id,
  display_name = excluded.display_name,
  bio = excluded.bio,
  is_active = excluded.is_active,
  updated_at = now(),
  deleted_at = null;

insert into public.membership_plans (id, name_he, name_en, plan_type, credits, duration_days, price_minor, currency, is_active)
values (
  '00000000-0000-0000-0000-000000000601',
  'כרטיסיית דמו',
  'Demo 10 Class Pack',
  'class_card',
  10,
  30,
  45000,
  'ILS',
  true
)
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

insert into public.members (id, profile_id, member_number, notes)
values (
  '00000000-0000-0000-0000-000000000701',
  '00000000-0000-0000-0000-000000000101',
  'DEMO-001',
  'Demo member used for Supabase smoke testing.'
)
on conflict (id) do update
set
  profile_id = excluded.profile_id,
  member_number = excluded.member_number,
  notes = excluded.notes,
  updated_at = now(),
  deleted_at = null;

insert into public.memberships (id, member_id, plan_id, status, starts_at, expires_at, remaining_credits)
values (
  '00000000-0000-0000-0000-000000000801',
  '00000000-0000-0000-0000-000000000701',
  '00000000-0000-0000-0000-000000000601',
  'active',
  now() - interval '1 hour',
  now() + interval '30 days',
  10
)
on conflict (id) do update
set
  member_id = excluded.member_id,
  plan_id = excluded.plan_id,
  status = excluded.status,
  starts_at = excluded.starts_at,
  expires_at = excluded.expires_at,
  remaining_credits = greatest(public.memberships.remaining_credits, excluded.remaining_credits),
  updated_at = now(),
  deleted_at = null;

insert into public.class_sessions (
  id,
  category_id,
  instructor_id,
  room_id,
  title_he,
  title_en,
  description_he,
  description_en,
  level,
  starts_at,
  ends_at,
  capacity,
  status,
  booking_opens_at,
  booking_closes_at,
  cancellation_policy_id
)
values
  (
    '00000000-0000-0000-0000-000000000901',
    '00000000-0000-0000-0000-000000000301',
    '00000000-0000-0000-0000-000000000501',
    '00000000-0000-0000-0000-000000000202',
    'פילאטיס דמו',
    'Demo Core Pilates',
    'שיעור דמו לבדיקת הזמנה מקצה לקצה.',
    'Demo class for end-to-end booking verification.',
    'all_levels',
    date_trunc('hour', now()) + interval '1 day 9 hours',
    date_trunc('hour', now()) + interval '1 day 10 hours',
    8,
    'open',
    now() - interval '1 hour',
    date_trunc('hour', now()) + interval '1 day 8 hours',
    '00000000-0000-0000-0000-000000000401'
  ),
  (
    '00000000-0000-0000-0000-000000000902',
    '00000000-0000-0000-0000-000000000301',
    '00000000-0000-0000-0000-000000000501',
    '00000000-0000-0000-0000-000000000202',
    'זרימה ושיקום דמו',
    'Demo Flow Restore',
    'שיעור דמו נוסף לרשימת השיעורים.',
    'Second demo class for the live schedule list.',
    'beginner',
    date_trunc('hour', now()) + interval '2 days 17 hours',
    date_trunc('hour', now()) + interval '2 days 18 hours',
    6,
    'open',
    now() - interval '1 hour',
    date_trunc('hour', now()) + interval '2 days 16 hours',
    '00000000-0000-0000-0000-000000000401'
  )
on conflict (id) do update
set
  category_id = excluded.category_id,
  instructor_id = excluded.instructor_id,
  room_id = excluded.room_id,
  title_he = excluded.title_he,
  title_en = excluded.title_en,
  description_he = excluded.description_he,
  description_en = excluded.description_en,
  level = excluded.level,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  capacity = excluded.capacity,
  status = excluded.status,
  booking_opens_at = excluded.booking_opens_at,
  booking_closes_at = excluded.booking_closes_at,
  cancellation_policy_id = excluded.cancellation_policy_id,
  updated_at = now(),
  deleted_at = null;
