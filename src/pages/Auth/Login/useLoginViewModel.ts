import { useMemo } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import AuthModel from '../../../models/AuthModel';
import { KEY } from '../../../shared/constants/constantStorage';
import type { AuthUserResponse, LoginInput } from '../../../@types/auth';
import useCookies from '@/hooks/useCookies';

const useLoginViewModel = () => {
  const { setCookies } = useCookies();
  const schema = useMemo(() => {
    return AuthModel.loginSchema();
  }, []);

  const form = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
    defaultValues: AuthModel.generateDefaultLoginInput(),
  });

  const onLogin = async (
    payload: LoginInput,
  ): Promise<AuthUserResponse | Error> => {
    try {
      const res = await AuthModel.login(payload);
      setCookies(KEY.cookie.auth.name, res.data.access_token, { path: '/' });

      return res;
    } catch (error) {
      if (error instanceof Error) return error;
      return new Error('Unknown error occurred');
    }
  };

  return {
    form,
    onLogin,
  };
};

export default useLoginViewModel;
