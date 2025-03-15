import { IReference } from '@domain/reference.dto';
import { IMeasurement } from '@domain/measurement.dto';
import { createSlice } from '@reduxjs/toolkit';

export interface IAllReferences {
  allergies: IReference[];
  diets: IReference[];
  measurements: IMeasurement[];
}

const initialState: IAllReferences = {
  allergies: [],
  diets: [],
  measurements: []
};

const referenceSlice = createSlice({
  name: 'references',
  initialState,
  reducers: {}
});

export default referenceSlice.reducer;
