import { test } from "node:test";
import assert from "node:assert/strict";
import { mapStripeEvent } from "./stripeEvents.ts";

test("checkout.session.completed (paid) -> activate with full args", () => {
  const action = mapStripeEvent({
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_1",
        payment_status: "paid",
        status: "complete",
        amount_total: 35000,
        customer: "cus_1",
        subscription: null,
        payment_intent: "pi_1",
        client_reference_id: "member-x",
        metadata: { member_id: "member-1", plan_id: "plan-1" },
      },
    },
  });
  assert.equal(action.kind, "activate");
  if (action.kind !== "activate") return;
  assert.equal(action.args.p_member_id, "member-1");
  assert.equal(action.args.p_plan_id, "plan-1");
  assert.equal(action.args.p_checkout_session_id, "cs_1");
  assert.equal(action.args.p_amount_minor, 35000);
  assert.equal(action.args.p_payment_intent_id, "pi_1");
});

test("checkout.session.completed falls back to client_reference_id for member", () => {
  const action = mapStripeEvent({
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_2",
        payment_status: "paid",
        amount_total: 28000,
        client_reference_id: "member-ref",
        metadata: { plan_id: "plan-2" },
      },
    },
  });
  assert.equal(action.kind, "activate");
  if (action.kind !== "activate") return;
  assert.equal(action.args.p_member_id, "member-ref");
});

test("checkout.session.completed not paid -> noop (no activation)", () => {
  const action = mapStripeEvent({
    type: "checkout.session.completed",
    data: { object: { id: "cs_3", payment_status: "unpaid", status: "open", metadata: {} } },
  });
  assert.equal(action.kind, "noop");
});

test("checkout.session.completed missing metadata -> error", () => {
  const action = mapStripeEvent({
    type: "checkout.session.completed",
    data: { object: { id: "cs_4", payment_status: "paid", metadata: {} } },
  });
  assert.equal(action.kind, "error");
  if (action.kind !== "error") return;
  assert.equal(action.status, 400);
});

test("invoice.payment_succeeded initial invoice -> noop (avoids double activation)", () => {
  const action = mapStripeEvent({
    type: "invoice.payment_succeeded",
    data: { object: { id: "in_1", subscription: "sub_1", billing_reason: "subscription_create" } },
  });
  assert.equal(action.kind, "noop");
});

test("invoice.payment_succeeded renewal -> activate using subscription metadata", () => {
  const action = mapStripeEvent(
    {
      type: "invoice.payment_succeeded",
      data: {
        object: { id: "in_2", subscription: "sub_1", billing_reason: "subscription_cycle", amount_paid: 28000 },
      },
    },
    { member_id: "member-1", plan_id: "plan-1" },
  );
  assert.equal(action.kind, "activate");
  if (action.kind !== "activate") return;
  assert.equal(action.args.p_checkout_session_id, "invoice_in_2");
  assert.equal(action.args.p_stripe_subscription_id, "sub_1");
});

test("invoice.payment_succeeded renewal without meta -> noop (safe)", () => {
  const action = mapStripeEvent({
    type: "invoice.payment_succeeded",
    data: { object: { id: "in_3", subscription: "sub_1", billing_reason: "subscription_cycle" } },
  });
  assert.equal(action.kind, "noop");
});

test("invoice.payment_failed -> freeze membership", () => {
  const action = mapStripeEvent({
    type: "invoice.payment_failed",
    data: { object: { id: "in_4", subscription: "sub_9" } },
  });
  assert.equal(action.kind, "freeze");
  if (action.kind !== "freeze") return;
  assert.equal(action.subscriptionId, "sub_9");
});

test("customer.subscription.deleted -> cancel membership", () => {
  const action = mapStripeEvent({
    type: "customer.subscription.deleted",
    data: { object: { id: "sub_9" } },
  });
  assert.equal(action.kind, "cancel");
  if (action.kind !== "cancel") return;
  assert.equal(action.args.p_subscription_id, "sub_9");
});

test("unhandled event type -> noop", () => {
  const action = mapStripeEvent({ type: "payment_intent.created", data: { object: {} } });
  assert.equal(action.kind, "noop");
});
