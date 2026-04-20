import type { Response } from './response';

export type Role = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type RoleResponseList = Response & {
  data: Role[];
};
