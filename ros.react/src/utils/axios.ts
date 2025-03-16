import { clearStore } from '@features/user/userSlice';
import axios from 'axios';
import { getUserFromLocalStorage, isTokenFresh } from './localStorage';

const customFetch = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

customFetch.interceptors.request.use((config) => {
  const user = getUserFromLocalStorage();
  const isFresh = isTokenFresh(user?.token, 'exp');

  if (user) {
    config.headers['Authorization'] = `Bearer ${user.token}`;
    if (!isFresh) {
      console.log('should clear out the user somehow without a dispatch?');
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
