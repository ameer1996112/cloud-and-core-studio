import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Request-scoped Supabase client bound to the user's auth cookies.
 * Respects Row Level Security as the signed-in user. Use this for all
 * normal reads/writes; only fall back to the service-role client for
 * privileged operations that must bypass RLS.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase public environment variables are missing.");
  }

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // setAll called from a Server Component without a mutable cookie store.
          // Session refresh is handled by middleware, so this is safe to ignore.
        }
      },
    },
  });
}
