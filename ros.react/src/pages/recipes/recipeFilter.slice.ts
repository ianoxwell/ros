import { CBlankFilter, IFilter } from '@domain/filter.dto';
import { createSlice } from '@reduxjs/toolkit';

const initialState: IFilter = CBlankFilter;

const recipeFilterSlice = createSlice({
  name: 'recipeFilter',
  initialState,
  reducers: {
    setRecipeTakeSize: (state, { payload }: { payload: number }) => {
      state.take = payload;
    }
  }
});

export const { setRecipeTakeSize } = recipeFilterSlice.actions;
export default recipeFilterSlice.reducer;
