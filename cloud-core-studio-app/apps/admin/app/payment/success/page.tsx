import Link from "next/link";

export const metadata = {
  title: "Payment received · Cloud & Core Studio",
};

export default function PaymentSuccessPage() {
  return (
    <main className="auth-stage">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-mark" aria-hidden="true">
            ✓
          </span>
          <h1>Payment received</h1>
          <p>
            Thanks! Your membership is being activated. This can take a few seconds while we
            confirm the payment with Stripe. You can return to the app and refresh your plan.
          </p>
        </div>
        <Link className="auth-submit auth-submit-link" href="/login">
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
