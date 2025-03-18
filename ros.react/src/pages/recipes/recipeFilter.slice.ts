import { CBlankFilter, IFilter } from '@domain/filter.dto';
import { createSlice } from '@reduxjs/toolkit';

const initialState: IFilter = CBlankFilter;

const recipeFilterSlice = createSlice({
  name: 'recipeFilter',
  initialState,
  reducers: {
    setRecipeTakeSize: (state, { payload }: { payload: number }) => {
      state.take = payload;
    },
    setRecipePageNumber: (state, { payload }: { payload: number }) => {
        state.page = payload;
    }
  }
});

export const { setRecipeTakeSize, setRecipePageNumber } = recipeFilterSlice.actions;
export default recipeFilterSlice.reducer;
