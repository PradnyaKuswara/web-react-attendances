import type { Response } from './response';
import type { Role } from './role';

export type User = {
  id: number;
  uuid: string;
  role_id: number;
  email: string;
  password: string;
  full_name?: string;
  position?: string;
  phone?: string;
  avatar?: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
  role: Role;
};

export type UserResponseDetail = Response & {
  data: User;
};

export type UserResponseList = Response & {
  data: User[];
};

export type UserInput = {
  role_id: number;
  email: string;
  password: string;
  full_name?: string;
  position?: string;
  phone?: string;
  avatar?: string;
};

export type UserUpdateInput = Partial<UserInput>;
