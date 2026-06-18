create extension if not exists "pgcrypto";

create type public.app_role as enum ('guest', 'member', 'instructor', 'admin');
create type public.session_status as enum ('draft', 'open', 'full', 'waitlist', 'closed', 'cancelled');
create type public.booking_status as enum ('confirmed', 'cancelled', 'late_cancelled', 'no_show', 'completed');
create type public.waitlist_status as enum ('waiting', 'offered', 'confirmed', 'declined', 'expired', 'cancelled');
create type public.membership_status as enum ('active', 'frozen', 'expired', 'cancelled');
create type public.payment_status as enum ('pending', 'paid', 'failed', 'refunded', 'partially_refunded');
create type public.notification_channel as enum ('push', 'email', 'sms', 'whatsapp');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text,
  phone text,
  locale text not null default 'he' check (locale in ('he', 'en')),
  medical_notes text,
  emergency_contact jsonb,
  notification_preferences jsonb not null default '{"push": true, "email": true, "sms": false, "whatsapp": false}',
  account_deletion_requested_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.roles (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  primary key (profile_id, role)
);

create table public.members (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  member_number text unique,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.instructors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  display_name text not null,
  bio text,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.staff_permissions (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  permission text not null,
  created_at timestamptz not null default now(),
  primary key (profile_id, permission)
);

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  timezone text not null default 'Asia/Jerusalem',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.locations(id),
  name text not null,
  capacity integer not null check (capacity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.class_categories (
  id uuid primary key default gen_random_uuid(),
  name_he text not null,
  name_en text not null,
  color text not null default '#0B1D3A',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.cancellation_policies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  free_cancel_until_hours integer not null default 12,
  return_credit boolean not null default true,
  late_cancel_penalty text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.class_templates (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.class_categories(id),
  instructor_id uuid references public.instructors(id),
  room_id uuid references public.rooms(id),
  title_he text not null,
  title_en text not null,
  description_he text not null default '',
  description_en text not null default '',
  level text not null default 'all_levels',
  duration_minutes integer not null default 60,
  capacity integer not null check (capacity > 0),
  equipment_he text[] not null default '{}',
  equipment_en text[] not null default '{}',
  cancellation_policy_id uuid references public.cancellation_policies(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.class_sessions (
  id uuid primary key default gen_random_uuid(),
  template_id uuid references public.class_templates(id),
  category_id uuid not null references public.class_categories(id),
  instructor_id uuid references public.instructors(id),
  room_id uuid references public.rooms(id),
  title_he text not null,
  title_en text not null,
  description_he text not null default '',
  description_en text not null default '',
  level text not null default 'all_levels',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  capacity integer not null check (capacity > 0),
  price_minor integer,
  status public.session_status not null default 'draft',
  booking_opens_at timestamptz,
  booking_closes_at timestamptz,
  cancellation_policy_id uuid references public.cancellation_policies(id),
  waitlist_confirm_minutes integer not null default 30,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  check (ends_at > starts_at)
);

create table public.membership_plans (
  id uuid primary key default gen_random_uuid(),
  name_he text not null,
  name_en text not null,
  plan_type text not null check (plan_type in ('single', 'trial', 'class_card', 'monthly', 'subscription')),
  credits integer,
  duration_days integer,
  price_minor integer not null,
  currency text not null default 'ILS',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  plan_id uuid not null references public.membership_plans(id),
  status public.membership_status not null default 'active',
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  frozen_at timestamptz,
  remaining_credits integer,
  auto_renew boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.class_passes (
  id uuid primary key default gen_random_uuid(),
  membership_id uuid not null references public.memberships(id) on delete cascade,
  credits_initial integer not null,
  credits_remaining integer not null,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  class_session_id uuid not null references public.class_sessions(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  membership_id uuid references public.memberships(id),
  status public.booking_status not null default 'confirmed',
  booked_at timestamptz not null default now(),
  cancelled_at timestamptz,
  cancellation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (class_session_id, member_id)
);

create table public.waitlist_entries (
  id uuid primary key default gen_random_uuid(),
  class_session_id uuid not null references public.class_sessions(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  position integer not null,
  status public.waitlist_status not null default 'waiting',
  offered_at timestamptz,
  offer_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (class_session_id, member_id)
);

create table public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  instructor_id uuid references public.instructors(id),
  status text not null check (status in ('present', 'absent', 'late', 'no_show')),
  internal_notes text,
  marked_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references public.members(id),
  membership_id uuid references public.memberships(id),
  provider text not null,
  provider_payment_id text,
  amount_minor integer not null,
  currency text not null default 'ILS',
  status public.payment_status not null default 'pending',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.payment_events (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid references public.payments(id),
  provider text not null,
  provider_event_id text,
  event_type text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_percent numeric,
  discount_amount_minor integer,
  starts_at timestamptz,
  expires_at timestamptz,
  max_redemptions integer,
  redeemed_count integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  channel public.notification_channel not null,
  type text not null,
  title text not null,
  body text not null,
  payload jsonb not null default '{}',
  sent_at timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title_he text not null,
  title_en text not null,
  body_he text not null,
  body_en text not null,
  audience text not null default 'all',
  publish_at timestamptz,
  expires_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.legal_documents (
  id uuid primary key default gen_random_uuid(),
  document_type text not null check (document_type in ('privacy', 'terms', 'cancellation', 'waiver')),
  locale text not null check (locale in ('he', 'en')),
  title text not null,
  body text not null,
  version text not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (document_type, locale, version)
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid references public.profiles(id),
  action text not null,
  entity_table text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index profiles_phone_idx on public.profiles(phone) where deleted_at is null;
create index roles_role_idx on public.roles(role);
create index class_sessions_starts_at_idx on public.class_sessions(starts_at) where deleted_at is null;
create index class_sessions_status_idx on public.class_sessions(status);
create index bookings_member_idx on public.bookings(member_id, status) where deleted_at is null;
create index bookings_session_idx on public.bookings(class_session_id, status) where deleted_at is null;
create index waitlist_session_position_idx on public.waitlist_entries(class_session_id, position) where deleted_at is null;
create index memberships_member_idx on public.memberships(member_id, status) where deleted_at is null;
create index payments_member_idx on public.payments(member_id, status) where deleted_at is null;
create index notifications_profile_idx on public.notifications(profile_id, created_at desc);

create trigger profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
create trigger members_updated before update on public.members for each row execute function public.set_updated_at();
create trigger instructors_updated before update on public.instructors for each row execute function public.set_updated_at();
create trigger class_sessions_updated before update on public.class_sessions for each row execute function public.set_updated_at();
create trigger bookings_updated before update on public.bookings for each row execute function public.set_updated_at();
create trigger waitlist_updated before update on public.waitlist_entries for each row execute function public.set_updated_at();
create trigger memberships_updated before update on public.memberships for each row execute function public.set_updated_at();

create or replace function public.has_role(target_role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.roles
    where profile_id = auth.uid()
    and role = target_role
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select public.has_role('admin');
$$;

create or replace function public.is_instructor_for_session(session_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.class_sessions cs
    join public.instructors i on i.id = cs.instructor_id
    where cs.id = session_id
    and i.profile_id = auth.uid()
  );
$$;

alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.members enable row level security;
alter table public.instructors enable row level security;
alter table public.staff_permissions enable row level security;
alter table public.locations enable row level security;
alter table public.rooms enable row level security;
alter table public.class_categories enable row level security;
alter table public.cancellation_policies enable row level security;
alter table public.class_templates enable row level security;
alter table public.class_sessions enable row level security;
alter table public.membership_plans enable row level security;
alter table public.memberships enable row level security;
alter table public.class_passes enable row level security;
alter table public.bookings enable row level security;
alter table public.waitlist_entries enable row level security;
alter table public.attendance_records enable row level security;
alter table public.payments enable row level security;
alter table public.payment_events enable row level security;
alter table public.coupons enable row level security;
alter table public.notifications enable row level security;
alter table public.announcements enable row level security;
alter table public.app_settings enable row level security;
alter table public.legal_documents enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles_self_select" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles_self_insert" on public.profiles for insert with check (id = auth.uid());
create policy "profiles_self_update" on public.profiles for update using (id = auth.uid() or public.is_admin());

create policy "roles_admin_all" on public.roles for all using (public.is_admin()) with check (public.is_admin());
create policy "roles_self_select" on public.roles for select using (profile_id = auth.uid());

create policy "public_reference_select_locations" on public.locations for select using (deleted_at is null);
create policy "public_reference_select_rooms" on public.rooms for select using (deleted_at is null);
create policy "public_reference_select_categories" on public.class_categories for select using (deleted_at is null);
create policy "public_reference_select_instructors" on public.instructors for select using (is_active and deleted_at is null);
create policy "public_reference_select_plans" on public.membership_plans for select using (is_active and deleted_at is null);
create policy "public_reference_select_policies" on public.cancellation_policies for select using (deleted_at is null);
create policy "public_legal_select" on public.legal_documents for select using (is_published);

create policy "admin_locations_all" on public.locations for all using (public.is_admin()) with check (public.is_admin());
create policy "admin_rooms_all" on public.rooms for all using (public.is_admin()) with check (public.is_admin());
create policy "admin_categories_all" on public.class_categories for all using (public.is_admin()) with check (public.is_admin());
create policy "admin_templates_all" on public.class_templates for all using (public.is_admin()) with check (public.is_admin());
create policy "admin_sessions_all" on public.class_sessions for all using (public.is_admin()) with check (public.is_admin());
create policy "admin_members_all" on public.members for all using (public.is_admin()) with check (public.is_admin());
create policy "admin_memberships_all" on public.memberships for all using (public.is_admin()) with check (public.is_admin());
create policy "admin_payments_all" on public.payments for all using (public.is_admin()) with check (public.is_admin());
create policy "admin_settings_all" on public.app_settings for all using (public.is_admin()) with check (public.is_admin());
create policy "admin_audit_select" on public.audit_logs for select using (public.is_admin());

create policy "published_sessions_select" on public.class_sessions
  for select using (status in ('open', 'full', 'waitlist', 'closed') and deleted_at is null);

create policy "member_self_select" on public.members
  for select using (profile_id = auth.uid() or public.is_admin());

create policy "member_memberships_select" on public.memberships
  for select using (
    public.is_admin() or exists (
      select 1 from public.members m
      where m.id = memberships.member_id and m.profile_id = auth.uid()
    )
  );

create policy "member_bookings_select" on public.bookings
  for select using (
    public.is_admin()
    or public.is_instructor_for_session(class_session_id)
    or exists (
      select 1 from public.members m
      where m.id = bookings.member_id and m.profile_id = auth.uid()
    )
  );

create policy "member_waitlist_select" on public.waitlist_entries
  for select using (
    public.is_admin()
    or public.is_instructor_for_session(class_session_id)
    or exists (
      select 1 from public.members m
      where m.id = waitlist_entries.member_id and m.profile_id = auth.uid()
    )
  );

create policy "attendance_instructor_admin_select" on public.attendance_records
  for select using (
    public.is_admin() or exists (
      select 1 from public.bookings b
      where b.id = attendance_records.booking_id
      and public.is_instructor_for_session(b.class_session_id)
    )
  );

create policy "attendance_instructor_admin_write" on public.attendance_records
  for all using (
    public.is_admin() or exists (
      select 1 from public.bookings b
      where b.id = attendance_records.booking_id
      and public.is_instructor_for_session(b.class_session_id)
    )
  ) with check (
    public.is_admin() or exists (
      select 1 from public.bookings b
      where b.id = attendance_records.booking_id
      and public.is_instructor_for_session(b.class_session_id)
    )
  );

create policy "notifications_self_select" on public.notifications
  for select using (profile_id = auth.uid() or public.is_admin());

create policy "announcements_visible" on public.announcements
  for select using (deleted_at is null and (publish_at is null or publish_at <= now()) and (expires_at is null or expires_at > now()));

create policy "admin_misc_all_staff_permissions" on public.staff_permissions for all using (public.is_admin()) with check (public.is_admin());
create policy "admin_misc_all_class_passes" on public.class_passes for all using (public.is_admin()) with check (public.is_admin());
create policy "admin_misc_all_payment_events" on public.payment_events for all using (public.is_admin()) with check (public.is_admin());
create policy "admin_misc_all_coupons" on public.coupons for all using (public.is_admin()) with check (public.is_admin());
create policy "admin_misc_all_legal" on public.legal_documents for all using (public.is_admin()) with check (public.is_admin());

create or replace function public.book_class(p_session_id uuid, p_membership_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_member_id uuid;
  v_capacity integer;
  v_booked integer;
  v_booking_id uuid;
begin
  select id into v_member_id from public.members where profile_id = auth.uid() and deleted_at is null;
  if v_member_id is null then
    raise exception 'member_profile_required';
  end if;

  select capacity into v_capacity from public.class_sessions
  where id = p_session_id and status in ('open', 'waitlist') and deleted_at is null
  for update;

  if v_capacity is null then
    raise exception 'class_not_bookable';
  end if;

  select count(*) into v_booked from public.bookings
  where class_session_id = p_session_id and status = 'confirmed' and deleted_at is null;

  if v_booked >= v_capacity then
    raise exception 'class_full_join_waitlist';
  end if;

  insert into public.bookings(class_session_id, member_id, membership_id)
  values (p_session_id, v_member_id, p_membership_id)
  returning id into v_booking_id;

  return v_booking_id;
end;
$$;

create or replace function public.join_waitlist(p_session_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_member_id uuid;
  v_position integer;
  v_waitlist_id uuid;
begin
  select id into v_member_id from public.members where profile_id = auth.uid() and deleted_at is null;
  if v_member_id is null then
    raise exception 'member_profile_required';
  end if;

  select coalesce(max(position), 0) + 1 into v_position
  from public.waitlist_entries
  where class_session_id = p_session_id and status in ('waiting', 'offered');

  insert into public.waitlist_entries(class_session_id, member_id, position)
  values (p_session_id, v_member_id, v_position)
  returning id into v_waitlist_id;

  update public.class_sessions set status = 'waitlist'
  where id = p_session_id and status = 'full';

  return v_waitlist_id;
end;
$$;
