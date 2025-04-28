import { ISchedule } from '@domain/schedule.dto';
import { createSlice } from '@reduxjs/toolkit';

export type TModalChoice = 'recipe' | 'schedule' | 'ingredient' | undefined;
type OmitDate<T> = Omit<T, 'date'>;

interface IModSchedule extends OmitDate<ISchedule> {
  date: string;
}

interface IGlobalModalSlice {
  modalOpen: TModalChoice;
  schedule: IModSchedule | undefined;
}

const initialState: IGlobalModalSlice = {
  modalOpen: undefined,
  schedule: undefined
};

const globalModalSlice = createSlice({
  name: 'currentSchedule',
  initialState,
  reducers: {
    setCurrentSchedule: (state, { payload }: { payload: IModSchedule | undefined }) => {
      state.schedule = payload;
      state.modalOpen = payload ? 'schedule' : undefined;
      console.log('the set schedule', state.schedule);
      return state;
    },
    closeAllGlobalModals: (state) => {
      Object.assign(state, { modalOpen: undefined, schedule: undefined });
      return state;
    }
  }
});

export const { setCurrentSchedule, closeAllGlobalModals } = globalModalSlice.actions;
export default globalModalSlice.reducer;
