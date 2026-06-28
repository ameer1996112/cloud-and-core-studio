import { AdminGuard } from "@/components/AdminGuard";
import { StudioApp } from "@/components/StudioApp";

export default async function MembersPage() {
  return (
    <AdminGuard>
      <StudioApp initialScreen="clients" />
    </AdminGuard>
  );
}
