"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabaseBrowserClient";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError("Invalid email or password.");
      return;
    }

    // Confirm the signed-in user actually has the admin role before entering.
    const { data: roleRows } = await supabase
      .from("roles")
      .select("role")
      .eq("profile_id", data.user.id);

    const isAdmin = (roleRows ?? []).some((r) => r.role === "admin");
    if (!isAdmin) {
      await supabase.auth.signOut();
      setError("This account does not have admin access.");
      return;
    }

    const redirectTo = searchParams.get("redirectTo") || "/";
    startTransition(() => {
      router.replace(redirectTo);
      router.refresh();
    });
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {error ? (
        <div className="auth-error" role="alert" aria-live="assertive">
          {error}
        </div>
      ) : null}

      <label className="auth-field">
        <span>Email</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email"
        />
      </label>

      <label className="auth-field">
        <span>Password</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="Password"
        />
      </label>

      <button type="submit" className="auth-submit" disabled={isPending}>
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
