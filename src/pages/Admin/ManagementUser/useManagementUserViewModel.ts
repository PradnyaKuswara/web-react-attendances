import { useMemo } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import UserModel from '@/models/UserModel';
import type { UserInput } from '@/@types/user';

const useManagementUserViewModel = () => {
  const schema = useMemo(() => {
    return UserModel.userSchema();
  }, []);

  const form = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
    defaultValues: UserModel.generateDefaultUserInput(),
  });

  const onSubmit = async (data: UserInput) => {
    try {
      const response = await UserModel.createUser(data);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  return {
    form,
    onSubmit,
  };
};

export default useManagementUserViewModel;
