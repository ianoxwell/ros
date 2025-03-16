import { IUserToken } from '@domain/user.dto';

export const addUserToLocalStorage = (userToken: IUserToken) => {
  localStorage.setItem('user', JSON.stringify(userToken));
};

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem('user');
};

export const getUserFromLocalStorage = () => {
  const result = localStorage.getItem('user');
  const user = typeof result === 'string' && result.includes('{') ? JSON.parse(result) as IUserToken : undefined;
  return user;
};

/** Decodes the token, parses and attempts to cast to T. */
const decodeToken = (token: string) => {
  return JSON.parse(atob(token.split('.')[1]));
};


/** Decodes the jwt token and compares to current time to see if the token is still fresh. */
export const isTokenFresh = (token: string | undefined, expiryKey = 'exp'): boolean => {
  if (!token) {
    return false;
  }

  const expiryString = decodeToken(token)[expiryKey] as unknown as string;
  const expiry = new Date(expiryString).getTime() * 1000;

  return new Date().getTime() < expiry;
};
