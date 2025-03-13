import userSlice from '@features/user/userSlice';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: { user: userSlice }
});
export type RootState = ReturnType<typeof store.getState>

