import type { UserInput } from '@/@types/user';
import UserModel from '@/models/UserModel';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useInsertUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserInput) => UserModel.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error) => {
      throw error;
    },
  });
};
