import { DashboardSummary } from "@/types/dashboard";
import { api } from "./api";

export const dashboardApi = {
  summary: async () => {
    const { data } = await api.get<{ summary: DashboardSummary }>(
      "/dashboard/summary"
    );
    return data.summary;
  }
};
