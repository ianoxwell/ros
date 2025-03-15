/**
 * https://codesandbox.io/p/sandbox/github/reduxjs/redux-essentials-example-app/tree/ts-checkpoint-6-rtkqConversion/?file=%2Fsrc%2Fapp%2FwithTypes.ts%3A1%2C1-8%2C5&from-embed
 */
import { createAsyncThunk } from '@reduxjs/toolkit'

import type { RootState, AppDispatch } from './store'

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: AppDispatch
}>()