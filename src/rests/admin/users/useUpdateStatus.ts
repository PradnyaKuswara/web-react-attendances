// src/rests/admin/users/useUpdateUserStatus.ts
import UserModel from '@/models/UserModel';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) =>
      UserModel.updateStatus(id, { is_active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error) => {
      throw error;
    },
  });
};
