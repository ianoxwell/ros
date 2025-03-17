import { CBlankFilter, IFilter } from "@domain/filter.dto";
import { createSlice } from "@reduxjs/toolkit";

const initialState: IFilter = CBlankFilter;

const recipeFilterSlice = createSlice({
    name: 'recipeFilter',
    initialState,
    reducers: {}
});

export default recipeFilterSlice.reducer;