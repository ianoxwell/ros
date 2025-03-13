import { IMessage } from '@domain/message.dto';
import { INewUser, IUserLogin, IUserToken, IVerifyUserEmail } from '@domain/user.dto';
import { notifications } from '@mantine/notifications';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addUserToLocalStorage, getUserFromLocalStorage, removeUserFromLocalStorage } from '@utils/localStorage';
import { HttpStatusCode } from 'axios';
import { clearStoreThunk, loginUserThunk, registerUserThunk, updateUserThunk, verifyUserEmailThunk } from './userThunk';

export interface IUserState {
  isLoading: boolean;
  isMember: boolean;
  user: IUserToken | undefined;
  errorMessage: string;
}

const initialState: IUserState = {
  isLoading: false,
  isMember: true,
  user: getUserFromLocalStorage(),
  errorMessage: ''
};

function isMessage<T>(payload: IMessage | T): payload is IMessage {
  //magic happens here
  return (<IMessage>payload).message !== undefined;
}

export const registerUser = createAsyncThunk(
  'user/registerUser', // actionName
  async (user: INewUser, thunkAPI) => {
    console.log('Register user', user);
    return registerUserThunk(user, thunkAPI);
  }
);

export const loginUser = createAsyncThunk('user/loginUser', async (user: IUserLogin, thunkAPI) => {
  return loginUserThunk(user, thunkAPI);
});

export const updateUser = createAsyncThunk('user/updateUser', async (user, thunkAPI) => {
  return updateUserThunk('/auth/updateUser', user, thunkAPI);
});

export const verifyUserEmailAccount = createAsyncThunk(
  'user/verifyEmail',
  async (emailToken: IVerifyUserEmail, thunkAPI) => {
    return verifyUserEmailThunk(emailToken, thunkAPI);
  }
);

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
    }
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, { payload }: { payload: IUserToken | IMessage }) => {
        state.isLoading = false;
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
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        notifications.show({ message: payload as string });
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyUserEmailAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyUserEmailAccount.fulfilled, (state, { payload }: { payload: IUserToken | IMessage }) => {
        state.isLoading = false;
        if (isMessage<IUserToken>(payload)) {
          state.errorMessage = payload.message;
          return;
        }

        const { user } = payload;
        state.user = payload;
        addUserToLocalStorage(payload);

        notifications.show({ title: 'Email verified', message: `Welcome ${user.givenNames}` });
      })
      .addCase(verifyUserEmailAccount.rejected, (state, { payload }: { payload: IMessage | unknown }) => {
        console.log('rejected', payload);
        state.isLoading = false;
        if (isMessage<unknown>(payload)) {
          notifications.show({ message: payload.message });
          state.errorMessage = payload.message;
        }
      });
  }
});

export const { toggleIsMember, logoutUser } = userSlice.actions;
export default userSlice.reducer;
