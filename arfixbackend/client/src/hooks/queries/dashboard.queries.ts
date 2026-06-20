import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "@/api/dashboardApi";

export const useDashboardSummaryQuery = () => {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: getDashboardSummary,
  });
};
