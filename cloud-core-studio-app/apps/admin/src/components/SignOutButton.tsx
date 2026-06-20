"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseBrowserClient";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    startTransition(async () => {
      await supabase.auth.signOut();
      router.replace("/login");
      router.refresh();
    });
  }

  return (
    <button type="button" className="admin-signout" onClick={handleSignOut} disabled={isPending}>
      {isPending ? "Signing out…" : "Sign out"}
    </button>
  );
}
