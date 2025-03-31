import { IBaseDto } from './base.dto';

export interface IUserProfile extends IBaseDto {
  familyName: string;
  givenNames: string;
  email: string;
}

export interface IUserJwtPayload {
  userId: number;
  username: string;
  name: string;
  isAdmin: boolean;
}

export interface INewUser {
  givenNames: string;
  familyName: string;
  email: string;
  password?: string;
  photoUrl: string[];
  loginProvider: string;
  loginProviderId?: string;
  verified?: Date;
}

export interface IUserSummary extends IUserProfile {
  fullName?: string;
  photoUrl: string[];
  isActive: boolean;
  phoneNumber?: string;
  loginProvider: string;
  loginProviderId?: string;
  verified?: Date;
  isAdmin: boolean;
  failedLoginAttempt: number;
  lastFailedLoginAttempt?: Date;
  timesLoggedIn: number;
  firstLogin?: Date;
  lastLogin?: Date;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserToken {
  token: string;
  user: IUserSummary;
}

export interface IVerifyUserEmail {
  token: string;
  email: string;
}
