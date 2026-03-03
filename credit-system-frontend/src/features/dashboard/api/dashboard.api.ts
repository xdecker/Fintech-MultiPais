import { apiClient } from "@/lib/api";
import { DashboardSummary } from "../types/dashboard";

export function getSummaryDashboard(page = 1, limit = 10) {
  return apiClient<DashboardSummary>("/dashboard", "GET");
}
