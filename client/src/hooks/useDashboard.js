import * as dashboardServices from "../services/dashboard.service";
import { useQuery } from "@tanstack/react-query";

export const useDashboard = () => {
  const getDashboardQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardServices.getDashboard,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
  });
  return { getDashboardQuery };
};
