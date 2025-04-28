import { createSlice } from '@reduxjs/toolkit';
import { getIncrementedDateIndex } from '@utils/dateUtils';

export interface IScheduleFilter {
  dateFrom: string;
}

const initialState: IScheduleFilter = {
  dateFrom: getIncrementedDateIndex(1)
};

const scheduleFilterSlice = createSlice({
  name: 'scheduleFilter',
  initialState,
  reducers: {
    setScheduleFilter: (state, { payload }: { payload: IScheduleFilter }) => {
      Object.assign(state, payload);
    }
  }
});

export const { setScheduleFilter } = scheduleFilterSlice.actions;
export default scheduleFilterSlice.reducer;
