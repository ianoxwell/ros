import { IBaseDto } from './base.dto'

export class IUserProfile extends IBaseDto {
  familyName: string;
  givenNames: string;
  email: string;
}

export class IUserSummary extends IUserProfile {
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

export class IUserLogin {
  email: string;
  password: string;
}
