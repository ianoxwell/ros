/**
 * For Redux specifically, "thunks" are a pattern of writing functions with logic inside that can
 * interact with a Redux store's dispatch and getState methods.
 * * Redux-Thunk is a middleware for Redux that allows you to write action creators that return a
 * function instead of an action object. It sits between the action dispatch and the reducer, allowing you
 * to intercept, modify, or delay actions as needed.
 * https://redux.js.org/usage/writing-logic-thunks
 */

import { GetThunkAPI } from '@reduxjs/toolkit';
import customFetch, { checkForUnauthorizedResponse } from '@utils/axios';
import axios, { AxiosResponse } from 'axios';
import { INewUser, IUserLogin, IVerifyUserEmail } from '@domain/user.dto';

export const registerUserThunk = async (user: INewUser, thunkAPI: GetThunkAPI<unknown>) => {
  const url = '/account/register';
  try {
    const resp = await customFetch.post(url, user);
    return resp.data;
  } catch (error: unknown) {
    return axios.isAxiosError(error) ? thunkAPI.rejectWithValue(error.response) : thunkAPI.rejectWithValue(error);
  }
};

export const loginUserThunk = async (user: IUserLogin, thunkAPI: GetThunkAPI<unknown>) => {
  const url = '/account/login';
  try {
    const resp = await customFetch.post(url, user);
    return resp.data;
  } catch (error: unknown) {
    return axios.isAxiosError(error) ? thunkAPI.rejectWithValue(error.response) : thunkAPI.rejectWithValue(error);
  }
};

export const verifyUserEmailThunk = async (emailToken: IVerifyUserEmail, thunkAPI: GetThunkAPI<unknown>) => {
  const url = '/account/verify-email';
  try {
    const resp = await customFetch.post(url, emailToken);
    return resp.data;
  } catch (error: unknown) {
    return axios.isAxiosError(error) ? thunkAPI.rejectWithValue(error.response?.data) : thunkAPI.rejectWithValue(error);
  }
};

export const updateUserThunk = async (url: string, user, thunkAPI) => {
  try {
    const resp = await customFetch.patch(url, user);
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const clearStoreThunk = async (message, thunkAPI) => {
  try {
    thunkAPI.dispatch(logoutUser(message));
    return Promise.resolve();
  } catch (error) {
    return Promise.reject();
  }
};
