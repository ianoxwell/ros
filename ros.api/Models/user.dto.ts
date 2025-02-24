import { IBaseDto } from './base.dto';

export interface IUserProfile extends IBaseDto {
  familyName: string;
  givenNames: string;
  email: string;
}

export interface IUserSummary extends IUserProfile {
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
