import { useQuery } from '@tanstack/react-query';
import AttendancesModel from '@/models/AttendancesModel';

export const useGetHistoryAttendanceByUser = () => {
  return useQuery({
    queryKey: ['history-attendance'],
    queryFn: async () => {
      const response = await AttendancesModel.getAttendances();
      return response.data;
    },
  });
};
