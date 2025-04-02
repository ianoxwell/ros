import { clearStore } from '@features/user/userSlice';
import { GetThunkAPI } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
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

export const checkForUnauthorizedResponse = (error: AxiosError, thunkAPI: GetThunkAPI<unknown>) => {
  if (error.response?.status === 401) {
    thunkAPI.dispatch(clearStore('Unauthorized'));
    return thunkAPI.rejectWithValue('Unauthorized! Logging Out...');
  }
  const errorMessage = (error.response?.data as { msg?: string })?.msg || 'An error occurred';
  return thunkAPI.rejectWithValue(errorMessage);
};

export default customFetch;
