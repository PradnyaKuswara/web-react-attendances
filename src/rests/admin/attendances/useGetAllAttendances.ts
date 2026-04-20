import { useQuery } from '@tanstack/react-query';
import AttendancesModel from '@/models/AttendancesModel';

export const useGetAllAttendances = () => {
  return useQuery({
    queryKey: ['attendances-admin'],
    queryFn: async () => {
      const response = await AttendancesModel.getAttendancesByAdmin();
      return response;
    },
  });
};
