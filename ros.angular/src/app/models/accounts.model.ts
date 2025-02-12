import { SocialUser } from 'angularx-social-login';

export interface INewUser {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  photoUrl?: string;
  loginProvider: string;
  loginProviderId?: string;
  verified?: Date;
}

export class NewUser implements INewUser {
  firstName: string;
  lastName: string;
  email: string;
  loginProvider: 'Local' | 'Social';
  constructor() {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.loginProvider = 'Local';
  }
}

export interface AccurateSocialUser extends SocialUser {
  providerId: string;
}
