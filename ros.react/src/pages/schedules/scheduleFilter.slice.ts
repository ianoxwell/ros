import { createSlice } from '@reduxjs/toolkit';
import { getIncrementedDateIndex } from '@utils/dateUtils';

export interface IScheduleFilter {
  dateFrom: string;
  dateTo: string;
}

const initialState: IScheduleFilter = {
  dateFrom: getIncrementedDateIndex(1),
  dateTo: getIncrementedDateIndex(8)
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
