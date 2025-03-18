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
    },
    setNewFilter: (state, { payload }: { payload: IFilter}) => {
        state = payload;
        return payload;
    }
  }
});

export const { setRecipeTakeSize, setRecipePageNumber, setNewFilter } = recipeFilterSlice.actions;
export default recipeFilterSlice.reducer;
