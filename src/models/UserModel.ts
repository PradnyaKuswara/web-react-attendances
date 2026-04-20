import type { UserInput, UserResponseDetail } from '@/@types/user';
import { ApiClient } from '@/services/ApiClient';
import * as yup from 'yup';

class UserModel {
  private static instance: UserModel;
  private apiClient: ApiClient;

  private constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  public static getInstance(): UserModel {
    if (!UserModel.instance) {
      UserModel.instance = new UserModel();
    }
    return UserModel.instance;
  }

  public userSchema() {
    return yup.object({
      role_id: yup
        .number()
        .typeError('must be a number')
        .integer('must be an integer')
        .required('is required'),

      email: yup
        .string()
        .email('must be a valid email')
        .max(255, 'max 255 characters')
        .required('is required'),

      password: yup
        .string()
        .min(6, 'must be at least 6 characters')
        .max(255, 'max 255 characters')
        .required('is required'),

      full_name: yup.string().max(255, 'max 255 characters').optional(),

      position: yup.string().max(255, 'max 255 characters').optional(),

      phone: yup.string().max(30, 'max 30 characters').optional(),

      avatar: yup.string().optional(),

      is_active: yup.boolean().optional(),
    });
  }

  public generateDefaultUserInput() {
    return {
      role_id: 0,
      full_name: '',
      email: '',
      password: '',
      position: '',
      phone: '',
      avatar: '',
      is_active: true,
    };
  }

  public async createUser(data: UserInput): Promise<UserResponseDetail> {
    return this.apiClient.post('/admin/users', data, true);
  }

  public async updateUser(
    id: number,
    data: UserInput,
  ): Promise<UserResponseDetail> {
    return this.apiClient.put(`/admin/users/${id}`, data, true);
  }

  public async deleteUser(id: number): Promise<UserResponseDetail> {
    return this.apiClient.delete(`/admin/users/${id}`, {}, true);
  }

  public async getUser(id: number): Promise<UserResponseDetail> {
    return this.apiClient.get(`/admin/users/${id}`, true);
  }

  public async getUsers(): Promise<UserResponseDetail> {
    return this.apiClient.get('/admin/users', true);
  }
}

export default UserModel.getInstance();
