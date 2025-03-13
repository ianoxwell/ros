import { clearStore } from '@features/user/userSlice';
import axios from 'axios';
import { getUserFromLocalStorage } from './localStorage';

/** Decodes the token, parses and attempts to cast to T. */
const decodeToken = (token: string) => {
  return JSON.parse(atob(token.split('.')[1]));
};

/** Decodes the jwt token and compares to current time to see if the token is still fresh. */
const isTokenFresh = (token: string | undefined, expiryKey = 'exp'): boolean => {
  if (!token) {
    return false;
  }

  const expiryString = decodeToken(token)[expiryKey] as unknown as string;
  const expiry = new Date(expiryString).getTime() * 1000;

  return new Date().getTime() < expiry;
};

const customFetch = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

customFetch.interceptors.request.use((config) => {
  // const dispatch = useDispatch();
  const user = getUserFromLocalStorage();
  const isFresh = !isTokenFresh(user?.token, 'exp');
  console.log('what is the user from local?', user, isFresh);

  if (user) {
    config.headers['Authorization'] = `Bearer ${user.token}`;
    if (!isFresh) {
      // dispatch(logoutUser('Logging out...'));
      console.log('should clear out the user somehow without a dispach?');
    }
  }

  return config;
});

export const checkForUnauthorizedResponse = (error, thunkAPI) => {
  if (error.response.status === 401) {
    thunkAPI.dispatch(clearStore);
    return thunkAPI.rejectWithValue('Unauthorized! Logging Out...');
  }
  return thunkAPI.rejectWithValue(error.response.data.msg);
};

export default customFetch;
