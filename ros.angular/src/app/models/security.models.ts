import { IDictionary } from './common.model';

export enum HttpStatusCode {
  Ok = 200,
  Created = 201,
  BadRequest = 400,
  AuthorizationRequired = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimedOut = 408,
  /** A concurrent request prevented the request.  ie another user deleted the item you are trying to save. */
  ConflictingRequest = 409,
  /** The item you requested has been deleted from the server.  eg. Item is deleted then user clicks on an old link to it. */
  Gone = 410,
  /** The server does not meet one of the preconditions that the requester put on the request. */
  PreconditionFailed = 412,
  /** The resource you are trying to access is locked. Used for pessimistic locking. */
  Locked = 423,
  /** A generic error message, given when an unexpected condition was encountered and no more specific message is suitable. */
  InternalServerError = 500,
  /**
   * The server was acting as a gateway or proxy and did not not receive a timely response from the upstream server. Basically
   * this will be the response when the Cookbook web server times out.
   */
  GatewayTimeout = 504
}

export enum AuthStatus {
  Ok,
  Warn,
  Expired
}

export interface AuthStateDetail {
  state: AuthStatus;
  nextStateSecs: number;
  expiryTime: Date;
}

export interface TokenState {
  isChanged: boolean;
  expirySecs: number;
  username: string;
  isShowingCurtain: boolean;
}

export interface RefreshState {
  isChanged: boolean;
  authFailed: boolean;
}

export enum SecurityPermission {
  AdministerUsers = 1,
  AdministerApplication,
  EditMET,
  ViewMET,
  DeletePatients,
  AddStateWide,
  IsCtc,
  EditCompletedMETForm,
  ViewAllHistory,
  None
}

/** Enumeration of the security roles supported by MET. */
export enum SecurityRole {
  Administrator = 'Administrator',
  FacilityAdministrator = 'Facility Administrator',
  Readonly = 'Readonly',
  User = 'User'
}
export interface IClaims {
  exp: any;
  sub: number; // UserId - RFC 7519 compliant https://tools.ietf.org/html/rfc7519#section-4.1
  name: string;
  givenname: string;
  surname: string;
  roles: string[];
  permissions: IDictionary<number[]>;
}

export interface IResponseToken {
  token: string;
  expiresIn: number;
  refreshToken: string;
}
export interface IToken {
  token: string;
  lifetime: number; // The lifetime duration of the token.
  expiresAt: number; // The absolute time that the token will expire (measured using the client local clock).
  refreshToken: string;
}

export interface ApplicableRank {
  rank: number;
  userId: number;
  isFacilityWide: boolean;
  facilityId: number[];
}
