/** JWT issued by the local API to verify local user. */
export interface ILocalUserJwt {
  sub: string;
  /** Users Unique ID. */
  email: string;
  givenname: string;
  surname: string;
  /** date Time in Milliseconds when this will need to be refreshed. */
  exp: number;
  /** String array of possible roles such as Administrator, Teacher, SchoolAdmin etc. */
  roles: string[];
  /** Time the JWT was issued at in milliseconds. */
  iat: number;
  iss: string;
  aud: string;
}
