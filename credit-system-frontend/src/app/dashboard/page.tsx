import { PrincipalHeader } from "@/components/shared";
import { getSummaryDashboard } from "@/features/dashboard/api/dashboard.api";
import { DashboardGrid } from "@/features/dashboard/components/home";

export default async function DashboardPage() {
  return (
    <div>
      <PrincipalHeader title="Inicio" />
      <div>
        <DashboardGrid />
      </div>
    </div>
  );
}
