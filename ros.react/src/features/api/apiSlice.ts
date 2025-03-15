// Import the RTK Query methods from the React-specific entry point
import { INewUser, IUserLogin, IUserToken, IVerifyUserEmail } from '@domain/user.dto';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IMessage } from '@domain/message.dto';
import { IResetPasswordRequest } from '@domain/reset-password-request.dto';

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // All of our requests will have URLs starting with
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    loginUser: builder.mutation<IUserToken | IMessage, IUserLogin>({
      query: (userLogin) => ({ url: '/account/login', method: 'POST', body: userLogin })
    }),
    registerUser: builder.mutation<IUserToken | IMessage, INewUser>({
      query: (newUser) => ({ url: '/account/register', method: 'POST', body: newUser })
    }),
    verifyUserEmail: builder.mutation<IUserToken | IMessage, IVerifyUserEmail>({
      query: (emailToken) => ({ url: '/account/verify-email', method: 'POST', body: emailToken })
    }),
    forgotPasswordEmail: builder.mutation<IMessage, string>({
      query: (email) => ({ url: '/account/forgot-password', method: 'POST', body: { email } })
    }),
    resetPassword: builder.mutation<IUserToken | IMessage, IResetPasswordRequest>({
      query: (reset) => ({ url: '/account/reset-password', method: 'POST', body: reset })
    })
  })
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useVerifyUserEmailMutation,
  useForgotPasswordEmailMutation,
  useResetPasswordMutation
} = apiSlice;
