import { useQuery } from '@tanstack/react-query';
import UserModel from '@/models/UserModel';

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await UserModel.getUsers();
      return response.data;
    },
  });
};
