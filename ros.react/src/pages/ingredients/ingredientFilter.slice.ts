import { CBlankFilter, IIngredientFilter } from '@domain/filter.dto';
import { createSlice } from '@reduxjs/toolkit';

const initialState: IIngredientFilter = { ...CBlankFilter, take: 25 };

const ingredientFilterSlice = createSlice({
  name: 'ingredientFilter',
  initialState,
  reducers: {
    setIngredientPageNumber: (state, { payload }: { payload: number }) => {
      state.page = payload;
    },
    setNewIngredientFilter: (state, { payload }: { payload: IIngredientFilter }) => {
      state = payload;
      return payload;
    }
  }
});

export const { setIngredientPageNumber, setNewIngredientFilter } = ingredientFilterSlice.actions;
export default ingredientFilterSlice.reducer;
