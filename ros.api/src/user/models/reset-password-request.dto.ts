export class IUserBasicAuth {
  email: string;
  password: string;
}

export class IResetPasswordRequest extends IUserBasicAuth {
  token: string;
}
