import { AdminGuard } from "@/components/AdminGuard";
import { StudioApp } from "@/components/StudioApp";

export default async function OverviewPage() {
  return (
    <AdminGuard>
      <StudioApp />
    </AdminGuard>
  );
}
