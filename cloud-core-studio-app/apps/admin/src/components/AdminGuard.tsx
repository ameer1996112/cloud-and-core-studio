import { requireAdmin } from "@/lib/auth";
import { SignOutButton } from "@/components/SignOutButton";

/**
 * Server-side admin guard + top bar. Wrap each admin page body with this so
 * every route enforces authentication and the admin role before rendering.
 */
export async function AdminGuard({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  return (
    <>
      <header className="admin-topbar">
        <span className="admin-topbar-user">
          {session.fullName ?? session.email ?? "Admin"}
        </span>
        <SignOutButton />
      </header>
      {children}
    </>
  );
}
