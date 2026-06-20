-- Stripe payment support: link plans/memberships/payments to Stripe identifiers
-- and provide an idempotent activation function the webhook calls after a
-- confirmed payment. Membership activation happens ONLY here (server-side),
-- never from the browser success page.

-- --- Stripe identifiers on plans (price/product set during Stripe setup) ---
alter table public.membership_plans
  add column if not exists stripe_product_id text,
  add column if not exists stripe_price_id text;

-- --- Stripe identifiers on memberships (for subscription lifecycle) ---
alter table public.memberships
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text;

-- --- Payments: store the Stripe checkout session / subscription for idempotency ---
alter table public.payments
  add column if not exists stripe_checkout_session_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists plan_id uuid references public.membership_plans(id),
  add column if not exists paid_at timestamptz;

-- One payment row per Stripe checkout session: the idempotency key for the webhook.
create unique index if not exists payments_checkout_session_unique
  on public.payments(stripe_checkout_session_id)
  where stripe_checkout_session_id is not null;

-- Idempotent index on provider_payment_id as a secondary guard.
create unique index if not exists payments_provider_payment_unique
  on public.payments(provider, provider_payment_id)
  where provider_payment_id is not null;

-- ---------------------------------------------------------------------------
-- activate_membership_for_payment: idempotently record a confirmed payment and
-- activate (or extend) the member's membership for the given plan.
--
-- Idempotency: keyed on stripe_checkout_session_id. A repeated event with the
-- same session id returns the existing membership without creating duplicates.
-- ---------------------------------------------------------------------------
create or replace function public.activate_membership_for_payment(
  p_member_id uuid,
  p_plan_id uuid,
  p_checkout_session_id text,
  p_amount_minor integer,
  p_stripe_customer_id text default null,
  p_stripe_subscription_id text default null,
  p_payment_intent_id text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_plan record;
  v_existing_payment record;
  v_membership_id uuid;
  v_payment_id uuid;
  v_expires_at timestamptz;
  v_credits integer;
begin
  -- Idempotency guard: if this checkout session was already processed, return it.
  select * into v_existing_payment
  from public.payments
  where stripe_checkout_session_id = p_checkout_session_id
  limit 1;

  if found and v_existing_payment.status = 'paid' and v_existing_payment.membership_id is not null then
    return jsonb_build_object(
      'status', 'already_processed',
      'payment_id', v_existing_payment.id,
      'membership_id', v_existing_payment.membership_id
    );
  end if;

  select * into v_plan from public.membership_plans where id = p_plan_id and deleted_at is null;
  if v_plan.id is null then
    raise exception 'plan_not_found';
  end if;

  -- Derive entitlement from the plan.
  v_credits := v_plan.credits; -- null => unlimited
  v_expires_at := case
    when v_plan.duration_days is not null then now() + make_interval(days => v_plan.duration_days)
    else null
  end;

  insert into public.memberships(
    member_id, plan_id, status, starts_at, expires_at, remaining_credits,
    stripe_customer_id, stripe_subscription_id, auto_renew
  )
  values (
    p_member_id, p_plan_id, 'active', now(), v_expires_at, v_credits,
    p_stripe_customer_id, p_stripe_subscription_id,
    p_stripe_subscription_id is not null
  )
  returning id into v_membership_id;

  -- Upsert the payment row keyed on the checkout session.
  if found and v_existing_payment.id is not null then
    update public.payments
    set status = 'paid',
        membership_id = v_membership_id,
        member_id = p_member_id,
        plan_id = p_plan_id,
        amount_minor = p_amount_minor,
        provider = 'stripe',
        provider_payment_id = coalesce(p_payment_intent_id, p_checkout_session_id),
        stripe_subscription_id = p_stripe_subscription_id,
        paid_at = now(),
        updated_at = now()
    where id = v_existing_payment.id
    returning id into v_payment_id;
  else
    insert into public.payments(
      member_id, plan_id, membership_id, provider, provider_payment_id,
      stripe_checkout_session_id, stripe_subscription_id,
      amount_minor, currency, status, paid_at
    )
    values (
      p_member_id, p_plan_id, v_membership_id, 'stripe',
      coalesce(p_payment_intent_id, p_checkout_session_id),
      p_checkout_session_id, p_stripe_subscription_id,
      p_amount_minor, coalesce(v_plan.currency, 'ILS'), 'paid', now()
    )
    returning id into v_payment_id;
  end if;

  insert into public.audit_logs(actor_profile_id, action, entity_table, entity_id, after_data)
  values (
    null, 'membership_activated', 'memberships', v_membership_id,
    jsonb_build_object('plan_id', p_plan_id, 'payment_id', v_payment_id, 'checkout_session', p_checkout_session_id)
  );

  return jsonb_build_object(
    'status', 'activated',
    'payment_id', v_payment_id,
    'membership_id', v_membership_id
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- record_failed_payment: log a failed charge without activating a membership.
-- ---------------------------------------------------------------------------
create or replace function public.record_failed_payment(
  p_member_id uuid,
  p_plan_id uuid,
  p_checkout_session_id text,
  p_amount_minor integer
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment_id uuid;
begin
  insert into public.payments(member_id, plan_id, provider, stripe_checkout_session_id, amount_minor, status)
  values (p_member_id, p_plan_id, 'stripe', p_checkout_session_id, p_amount_minor, 'failed')
  on conflict (stripe_checkout_session_id) where stripe_checkout_session_id is not null
  do update set status = 'failed', updated_at = now()
  returning id into v_payment_id;

  return v_payment_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- mark_subscription_cancelled: subscription deleted -> mark membership cancelled.
-- ---------------------------------------------------------------------------
create or replace function public.mark_subscription_cancelled(p_subscription_id text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  update public.memberships
  set status = 'cancelled', updated_at = now()
  where stripe_subscription_id = p_subscription_id
    and status in ('active', 'frozen');
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

-- These functions are privileged; only the service role (Edge Function) may call them.
revoke execute on function public.activate_membership_for_payment(uuid, uuid, text, integer, text, text, text) from authenticated, anon;
revoke execute on function public.record_failed_payment(uuid, uuid, text, integer) from authenticated, anon;
revoke execute on function public.mark_subscription_cancelled(text) from authenticated, anon;

-- Seed Stripe price ids as null; populated during Stripe setup (deploy checklist).
