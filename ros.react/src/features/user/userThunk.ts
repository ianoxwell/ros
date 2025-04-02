/**
 * For Redux specifically, "thunks" are a pattern of writing functions with logic inside that can
 * interact with a Redux store's dispatch and getState methods.
 * * Redux-Thunk is a middleware for Redux that allows you to write action creators that return a
 * function instead of an action object. It sits between the action dispatch and the reducer, allowing you
 * to intercept, modify, or delay actions as needed.
 * https://redux.js.org/usage/writing-logic-thunks
 */

import { IResetPasswordRequest } from '@domain/reset-password-request.dto';
import { INewUser, IVerifyUserEmail } from '@domain/user.dto';
import { GetThunkAPI } from '@reduxjs/toolkit';
import customFetch from '@utils/axios';
import axios from 'axios';
import { logoutUser } from './userSlice';

export const registerUserThunk = async (user: INewUser, thunkAPI: GetThunkAPI<unknown>) => {
  const url = '/account/register';
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

export const forgotPasswordEmailThunk = async (email: string, thunkAPI: GetThunkAPI<unknown>) => {
  const url = '/account/forgot-password';
  try {
    const resp = await customFetch.post(url, { email });
    return resp.data;
  } catch (error: unknown) {
    return axios.isAxiosError(error) ? thunkAPI.rejectWithValue(error.response?.data) : thunkAPI.rejectWithValue(error);
  }
};

export const resetPasswordThunk = async (reset: IResetPasswordRequest, thunkAPI: GetThunkAPI<unknown>) => {
  const url = '/account/reset-password';
  try {
    const resp = await customFetch.post(url, reset);
    return resp.data;
  } catch (error: unknown) {
    return axios.isAxiosError(error) ? thunkAPI.rejectWithValue(error.response?.data) : thunkAPI.rejectWithValue(error);
  }
};

export const clearStoreThunk = async (message: string, thunkAPI: GetThunkAPI<unknown>) => {
  try {
    thunkAPI.dispatch(logoutUser(message));
    return Promise.resolve();
  } catch (error) {
    console.log('error occurred for some reason', error);
    return Promise.reject();
  }
};
