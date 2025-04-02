import { CBlankFilter, IRecipeFilter } from '@domain/filter.dto';
import { createSlice } from '@reduxjs/toolkit';

const initialState: IRecipeFilter = CBlankFilter;

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
    setNewRecipeFilter: (state, { payload }: { payload: IRecipeFilter}) => {
        state = payload;
        return state;
    }
  }
});

export const { setRecipeTakeSize, setRecipePageNumber, setNewRecipeFilter } = recipeFilterSlice.actions;
export default recipeFilterSlice.reducer;
