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
