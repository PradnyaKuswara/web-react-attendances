import UserModel from '@/models/UserModel';
import { useQuery } from '@tanstack/react-query';

export const useGetAllRoles = () => {
  return useQuery({
    queryKey: ['admin-roles'],
    queryFn: async () => {
      const response = await UserModel.getRole();
      return response.data;
    },
  });
};
