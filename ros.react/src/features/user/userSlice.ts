import { IMessage } from '@domain/message.dto';
import { IResetPasswordRequest } from '@domain/reset-password-request.dto';
import { INewUser, IUserToken, IVerifyUserEmail } from '@domain/user.dto';
import { apiSlice } from '@features/api/apiSlice';
import { notifications } from '@mantine/notifications';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addUserToLocalStorage, getUserFromLocalStorage, removeUserFromLocalStorage } from '@utils/localStorage';
import { isMessage } from '@utils/typescriptHelpers';
import { HttpStatusCode } from 'axios';
import { CRoutes } from 'src/routes.const';
import {
  clearStoreThunk,
  forgotPasswordEmailThunk,
  registerUserThunk,
  resetPasswordThunk,
  verifyUserEmailThunk
} from './userThunk';

export interface IUserState {
  isLoading: boolean;
  isMember: boolean;
  user: IUserToken | undefined;
  errorMessage: string;
  activePage: string;
}

const initialState: IUserState = {
  isLoading: false,
  isMember: true,
  user: getUserFromLocalStorage(),
  errorMessage: '',
  activePage: ''
};

export const registerUser = createAsyncThunk(
  'user/registerUser', // actionName
  async (user: INewUser, thunkAPI) => {
    console.log('Register user', user);
    return registerUserThunk(user, thunkAPI);
  }
);

// export const updateUser = createAsyncThunk('user/updateUser', async (user: IUserSummary, thunkAPI) => {
//   return updateUserThunk('/auth/updateUser', user, thunkAPI);
// });

export const verifyUserEmailAccount = createAsyncThunk(
  'user/verifyEmail',
  async (emailToken: IVerifyUserEmail, thunkAPI) => {
    return verifyUserEmailThunk(emailToken, thunkAPI);
  }
);

export const resetPasswordEmail = createAsyncThunk(
  'user/resetPassword',
  async (reset: IResetPasswordRequest, thunkAPI) => {
    return resetPasswordThunk(reset, thunkAPI);
  }
);

export const forgotPasswordEmail = createAsyncThunk('user/forgotPassword', async (email: string, thunkAPI) => {
  return forgotPasswordEmailThunk(email, thunkAPI);
});

export const clearStore = createAsyncThunk('user/clearStore', clearStoreThunk);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logoutUser: (state, { payload }) => {
      state.user = undefined;
      removeUserFromLocalStorage();
      if (payload) {
        notifications.show({ message: payload });
      }
    },
    toggleIsMember: (state) => {
      state.isMember = !state.isMember;
    },
    setPageNavigate: (state, { payload }: { payload: string }) => {
      state.activePage = payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, { payload }: { payload: INewUser | IMessage }) => {
        state.isLoading = false;
        if (Object.getOwnPropertyDescriptor(payload, 'message')) {
          payload = payload as IMessage;
          notifications.show({
            message: payload.message
          });
          return;
        }

        notifications.show({
          title: 'Success',
          message: `${
            (payload as INewUser).givenNames
          }, a verification message has been sent, you may need to check your spam account.`
        });
        state.isMember = true;
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        notifications.show({ message: payload as string });
      })
      // update user - TODO
      // .addCase(updateUser.pending, (state) => {
      //   state.isLoading = true;
      // })
      // Verify Email account
      .addCase(verifyUserEmailAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyUserEmailAccount.fulfilled, (state, { payload }: { payload: IUserToken | IMessage }) => {
        state.isLoading = false;
        if (isMessage<IUserToken>(payload)) {
          if (payload.status === HttpStatusCode.MisdirectedRequest) {
            notifications.show({ title: 'Email already verified', message: payload.message });
            state.activePage = CRoutes.login;
            return;
          }

          state.errorMessage = payload.message;
          return;
        }

        const { user } = payload;
        state.user = payload;
        addUserToLocalStorage(payload);

        notifications.show({ title: 'Email verified', message: `Welcome ${user.givenNames}` });
      })
      .addCase(verifyUserEmailAccount.rejected, (state, { payload }: { payload: IMessage | unknown }) => {
        console.log('verifyUser rejected', payload);
        state.isLoading = false;
        if (isMessage<unknown>(payload)) {
          notifications.show({ message: payload.message });
          state.errorMessage = payload.message;
        }
      })
      // Forgot Password
      .addCase(forgotPasswordEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotPasswordEmail.fulfilled, (state, { payload }: { payload: IMessage }) => {
        state.isLoading = false;
        if (payload.status === HttpStatusCode.Ok) {
          notifications.show({
            title: 'Email sent',
            message: `Please check your email (and spam folder) for a reset password link`
          });
          state.activePage = CRoutes.login;
          state.errorMessage = '';
          return;
        }

        notifications.show({ title: 'Problem', message: payload.message });
      })
      .addCase(forgotPasswordEmail.rejected, (state, { payload }: { payload: IMessage | unknown }) => {
        state.isLoading = false;
        console.log('error in forgetting password', payload);
        if (isMessage<unknown>(payload)) {
          notifications.show({ message: payload.message });
          state.errorMessage = payload.message;
        }
      })
      //reset password from email
      .addCase(resetPasswordEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPasswordEmail.fulfilled, (state, { payload }: { payload: IMessage | IUserToken }) => {
        state.isLoading = false;
        if (isMessage<IUserToken>(payload)) {
          if (payload.status === HttpStatusCode.ResetContent) {
            notifications.show({ title: 'Token expired', message: payload.message });
            state.activePage = CRoutes.forgotPassword;
            return;
          }

          notifications.show({ color: 'orange', title: 'Big error', message: payload.message });
          return;
        }

        const { user } = payload;
        state.user = payload;
        addUserToLocalStorage(payload);

        notifications.show({ title: 'Password reset', message: `Welcome ${user.givenNames}` });
      })
      .addCase(resetPasswordEmail.rejected, (state, { payload }: { payload: IMessage | unknown }) => {
        console.log('verifyUser rejected', payload);
        state.isLoading = false;
        if (isMessage<unknown>(payload)) {
          notifications.show({ message: payload.message });
          state.errorMessage = payload.message;
        }
      })
      .addMatcher(
        apiSlice.endpoints.loginUser.matchFulfilled,
        (state, { payload }: { payload: IUserToken | IMessage }) => {
          console.log('result from matcher', payload);
          if (isMessage<IUserToken>(payload)) {
            notifications.show({
              message: payload.message
            });
            if (payload.status === HttpStatusCode.NotFound) {
              state.isMember = false;
            }

            return;
          }

          const { user } = payload;
          state.user = payload;
          addUserToLocalStorage(payload);

          notifications.show({ message: `Welcome Back ${user.givenNames}` });
        }
      );
  }
});

export const { toggleIsMember, logoutUser, setPageNavigate } = userSlice.actions;
export default userSlice.reducer;
