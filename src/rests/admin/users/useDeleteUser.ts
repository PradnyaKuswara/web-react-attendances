// src/rests/admin/users/useDeleteUser.ts
import UserModel from '@/models/UserModel';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => UserModel.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error) => {
      throw error;
    },
  });
};
