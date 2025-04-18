import { SocialUser } from "@abacritt/angularx-social-login";
import { INewUser } from "@DomainModels/user.dto";


export class NewUser implements INewUser {
  givenNames: string;
  familyName: string;
  email: string;
  loginProvider: 'Local' | 'Social';
  photoUrl: string[];
  constructor() {
    this.givenNames = '';
    this.familyName = '';
    this.email = '';
    this.loginProvider = 'Local';
    this.photoUrl = [];
  }
}

export interface AccurateSocialUser extends SocialUser {
  providerId: string;
}
