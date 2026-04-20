import type { AuthUserResponse, LoginInput } from '@/@types/auth';
import type { UserResponseDetail } from '@/@types/user';
import { ApiClient } from '@/services/ApiClient';
import * as yup from 'yup';

class AuthModel {
  private static instance: AuthModel;
  private apiClient: ApiClient;

  private constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  public static getInstance(): AuthModel {
    if (!AuthModel.instance) {
      AuthModel.instance = new AuthModel();
    }
    return AuthModel.instance;
  }

  public loginSchema() {
    return yup.object({
      email: yup.string().email().required('is required'),
      password: yup
        .string()
        .required('is required')
        .min(8, 'must be at least 8 characters')
        .matches(/[A-Z]/, 'must contain at least one uppercase letter')
        .matches(/[0-9]/, 'must contain at least one number'),
    });
  }

  public generateDefaultLoginInput() {
    return { email: '', password: '' };
  }

  public async login(data: LoginInput): Promise<AuthUserResponse> {
    return this.apiClient.post('/auth/login', data, false);
  }

  public async authInfo(): Promise<UserResponseDetail> {
    return this.apiClient.post('/auth/user-info', {}, true);
  }
}

export default AuthModel.getInstance();
