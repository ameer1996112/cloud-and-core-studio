import { AdminGuard } from "@/components/AdminGuard";
import { StudioApp } from "@/components/StudioApp";

export default async function ReportsPage() {
  return (
    <AdminGuard>
      <StudioApp initialScreen="admin-payments" />
    </AdminGuard>
  );
}
