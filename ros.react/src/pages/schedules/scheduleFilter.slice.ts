import { createSlice } from '@reduxjs/toolkit';
import { getIncrementalDateObject } from '@utils/dateUtils';

export interface IScheduleFilter {
  dateFrom: Date;
  dateTo: Date;
}

const initialState: IScheduleFilter = {
  dateFrom: getIncrementalDateObject(3),
  dateTo: getIncrementalDateObject(8)
};

const scheduleFilterSlice = createSlice({
  name: 'scheduleFilter',
  initialState,
  reducers: {
    setScheduleFilter: (state, { payload }: { payload: IScheduleFilter }) => {
      state = payload;
      return state;
    }
  }
});

export const { setScheduleFilter } = scheduleFilterSlice.actions;
export default scheduleFilterSlice.reducer;
