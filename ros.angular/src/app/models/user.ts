/**
 * Provisioners CookBook Api
 * This is the API for the Provisioner's CookBook Project
 *
 */

import { BaseDbModel } from './common.model';

export interface IRole extends BaseDbModel {
  rank: number;
  title: string;
  summary: string;
  isAdmin: boolean;
  isUser: boolean;
  startDate: Date;
  endDate: Date;
}

export interface ISchool extends BaseDbModel {
  code: string;
  title: string;
  shortName: string;
  startDate: Date;
  endDate: Date;
  businessContactName: string;
  emailAddress: string;
  streetNumber: string;
  address: string;
  suburb: string;
  postcode: string;
  phoneNumber: string;
}
export interface IUserRole extends BaseDbModel {
  isCountryWide: boolean;
  roleId: number;
  schoolId: number;
  userId: number;
  role: IRole;
  school: ISchool;
}

export interface IUser extends BaseDbModel {
  email: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  isVerified?: boolean;
  isStudent?: boolean;
  isActive?: boolean;
  timesLoggedIn?: number;
  firstLogon?: Date;
  lastLogon?: number | Date;
  loginProvider: string;
  loginProviderId?: string;
  /** calculated / constructed field. */
  fullName?: string;
  /** Role taken by user - student, teacher, admin, assistant. */
  userRole?: IUserRole[];

  updated: Date;
}
