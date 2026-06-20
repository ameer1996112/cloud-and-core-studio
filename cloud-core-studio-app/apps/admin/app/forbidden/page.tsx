import Link from "next/link";

export const metadata = {
  title: "Access denied · Cloud & Core Studio",
};

export default function ForbiddenPage() {
  return (
    <main className="auth-stage">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-mark">C&amp;C</span>
          <h1>Access denied</h1>
          <p>Your account does not have admin permissions for this dashboard.</p>
        </div>
        <Link className="auth-submit auth-submit-link" href="/login">
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
