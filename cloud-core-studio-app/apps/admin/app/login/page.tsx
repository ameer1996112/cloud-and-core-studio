import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Sign in · Cloud & Core Studio",
};

export default function LoginPage() {
  return (
    <main className="auth-stage">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-mark">C&amp;C</span>
          <h1>Cloud &amp; Core Studio</h1>
          <p>Admin &amp; studio management</p>
        </div>
        <Suspense fallback={<p className="auth-loading">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
