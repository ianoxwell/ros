// Import the RTK Query methods from the React-specific entry point
import { IPagedResult } from '@domain/base.dto';
import { IFilter, IRecipeFilter } from '@domain/filter.dto';
import { IIngredient, IIngredientShort } from '@domain/ingredient.dto';
import { IMessage } from '@domain/message.dto';
import { IOrder } from '@domain/order.dto';
import { IRecipe, IRecipeShort } from '@domain/recipe.dto';
import { IAllReferences } from '@domain/reference.dto';
import { IResetPasswordRequest } from '@domain/reset-password-request.dto';
import { ISchedule, IWeeklySchedule } from '@domain/schedule.dto';
import { INewUser, IUserLogin, IUserToken, IVerifyUserEmail } from '@domain/user.dto';
import { logoutUser } from '@features/user/userSlice';
import { IScheduleFilter } from '@pages/schedules/scheduleFilter.slice';
import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { getUserFromLocalStorage, isTokenFresh } from '@utils/localStorage';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers) => {
    const user = getUserFromLocalStorage();
    const isFresh = isTokenFresh(user?.token, 'exp');

    // If we have a token and its fresh let's assume that we should be passing it.
    if (user && isFresh) {
      headers.set('authorization', `Bearer ${user.token}`);
    }

    return headers;
  }
});
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // TODO - follow this pattern to reauth - https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#automatic-re-authorization-by-extending-fetchbasequery
    api.dispatch(logoutUser('Not authorized, logging out user'));
  }
  return result;
};

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // All of our requests will check if token is available and attach (baseQuery) and all responses will be checked for 401 not authorized
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Schedules'],
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
    }),
    getReferences: builder.query<IAllReferences, void>({
      query: () => '/reference/all',
      keepUnusedDataFor: 0
    }),
    getRecipes: builder.mutation<IPagedResult<IRecipeShort>, IRecipeFilter>({
      query: (filter) => ({ url: '/recipe/search', method: 'POST', body: filter })
    }),
    getRecipe: builder.query<IRecipe, string | undefined>({
      query: (id) => ({ url: `/recipe/${id}` })
    }),
    getRecipeSuggestions: builder.query<IPagedResult<IRecipeShort>, string>({
      query: (keyword) => ({ url: `/recipe/suggestion?filter=${keyword}` })
    }),
    getIngredients: builder.mutation<IPagedResult<IIngredientShort>, IFilter>({
      query: (filter) => ({ url: '/ingredient/search', method: 'POST', body: filter })
    }),
    getIngredient: builder.query<IIngredient, string | undefined>({
      query: (id) => ({ url: `/ingredient/${id}` })
    }),
    getMyScheduledRecipes: builder.query<IWeeklySchedule, IScheduleFilter>({
      query: (filter) => `/schedule?from=${filter.dateFrom}`,
      providesTags: (result) =>
        result
          ? [
              ...Object.keys(result).map((key) => ({ type: 'Schedules' as const, id: key })),
              { type: 'Schedules', id: 'LIST' }
            ]
          : [{ type: 'Schedules', id: 'LIST' }]
    }),
    getScheduleForDate: builder.query<ISchedule[], string>({
      query: (date) => `schedule/day?date=${date}`,
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: 'Schedules' as const, id }))] : [{ type: 'Schedules', id: 'LIST' }]
    }),
    saveSchedule: builder.mutation<ISchedule, ISchedule>({
      query: (schedule) => ({ url: '/schedule', method: 'POST', body: schedule }),
      invalidatesTags: [{ type: 'Schedules', id: 'LIST' }]
    }),
    deleteSchedule: builder.mutation<string, number>({
      query: (id) => ({ url: `/schedule?id=${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Schedules', id: 'LIST' }]
    }),
    getRandomWeekRecipes: builder.mutation<IMessage, string>({
      query: (date) => `schedule/createRandom?from=${date}`,
      invalidatesTags: [{ type: 'Schedules', id: 'LIST' }]
    }),
    getWeeklyOrders: builder.query<IOrder, string>({
      query: (date) => `orders?from=${date}`,
      providesTags: [{ type: 'Schedules', id: 'LIST' }]
    })
  })
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useVerifyUserEmailMutation,
  useForgotPasswordEmailMutation,
  useResetPasswordMutation,
  useGetReferencesQuery,
  useGetRecipesMutation,
  useGetRecipeQuery,
  useGetRecipeSuggestionsQuery,
  useGetIngredientsMutation,
  useGetIngredientQuery,
  useGetMyScheduledRecipesQuery,
  useLazyGetScheduleForDateQuery,
  useSaveScheduleMutation,
  useDeleteScheduleMutation,
  useGetRandomWeekRecipesMutation,
  useGetWeeklyOrdersQuery
} = apiSlice;
