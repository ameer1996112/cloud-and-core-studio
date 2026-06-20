"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client for client components (login form, sign-out).
 * Uses the public anon key and persists the session in cookies so the
 * server and middleware can read it.
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase public environment variables are missing.");
  }

  return createBrowserClient(url, anonKey);
}
