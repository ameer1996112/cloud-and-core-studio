import { AdminGuard } from "@/components/AdminGuard";
import { StudioApp } from "@/components/StudioApp";

export default async function SettingsPage() {
  return (
    <AdminGuard>
      <StudioApp initialScreen="settings" />
    </AdminGuard>
  );
}
