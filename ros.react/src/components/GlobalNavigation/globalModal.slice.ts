import { ISchedule } from '@domain/schedule.dto';
import { createSlice } from '@reduxjs/toolkit';

export type TModalChoice = 'recipe' | 'schedule' | 'ingredient' | undefined;
type OmitDate<T> = Omit<T, 'date'>;
/** 
 * Note that redux will not allow serialization of js date object. 
 * Kind of poor and unexpected, but have to transform to a dateIndex and back to use the redux store.
 * Redux won't even let it be part of the payload send to setCurrentSchedule...
 */
interface IModSchedule extends OmitDate<ISchedule> {
  /** getDateIndex from utils - stored as '20251015' */
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
