import Link from "next/link";

export const metadata = {
  title: "Payment cancelled · Cloud & Core Studio",
};

export default function PaymentCancelledPage() {
  return (
    <main className="auth-stage">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-mark" aria-hidden="true">
            ✕
          </span>
          <h1>Payment cancelled</h1>
          <p>No charge was made. You can choose a plan again whenever you are ready.</p>
        </div>
        <Link className="auth-submit auth-submit-link" href="/login">
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
