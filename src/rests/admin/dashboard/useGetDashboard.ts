import { useQuery } from '@tanstack/react-query';
import DashboardModel from '@/models/DashboardModel';
import type { DashboardResponse } from '@/@types/dashboard';

export const useGetDashboard = () => {
  return useQuery<DashboardResponse>({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const response = await DashboardModel.getDashboard();
      return response.data;
    },
    staleTime: 0,
    refetchOnMount: true,
  });
};
