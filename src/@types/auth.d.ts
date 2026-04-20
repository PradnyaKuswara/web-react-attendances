export type AuthUser = {
  access_token: string;
};

export type AuthUserResponse = {
  statusCode: number;
  message: string;
  data: AuthUser;
};

export type LoginInput = {
  email: string;
  password: string;
};
