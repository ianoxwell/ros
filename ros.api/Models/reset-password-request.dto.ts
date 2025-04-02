export interface IUserBasicAuth {
  email: string;
  password: string;
}

export interface IResetPasswordRequest extends IUserBasicAuth {
  token: string;
}
