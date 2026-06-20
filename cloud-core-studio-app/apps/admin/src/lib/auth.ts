import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabaseServerClient";

export interface AdminSession {
  userId: string;
  email: string | null;
  fullName: string | null;
  roles: string[];
}

/**
 * Returns the current session and roles, or null if signed out.
 * Reads roles via the RLS-protected `roles` table as the signed-in user.
 */
export async function getSession(): Promise<AdminSession | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: roleRows } = await supabase
    .from("roles")
    .select("role")
    .eq("profile_id", user.id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  return {
    userId: user.id,
    email: user.email ?? null,
    fullName: profile?.full_name ?? null,
    roles: (roleRows ?? []).map((r) => r.role as string),
  };
}

/**
 * Guard for admin-only pages and server actions. Redirects to /login when
 * signed out, or to /forbidden when the user lacks the admin role.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (!session.roles.includes("admin")) {
    redirect("/forbidden");
  }

  return session;
}
