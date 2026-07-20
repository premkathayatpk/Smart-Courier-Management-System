import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  parcels: [],
  selectedParcel: null,
};

const parcelSlice = createSlice({
  name: "parcel",
  initialState,
  reducers: {
    setParcels: (state, action) => {
      state.parcels = action.payload;
    },
  },
  setSelectedParcel: (state, action) => {
    state.selectedParcel = action.payload;
  },
  clearSelectedParcel: (state) => {
    state.selectedParcel = null;
  },
});

export const { setParcels, setSelectedParcel, clearSelectedParcel } =
  parcelSlice.actions;

export default parcelSlice.reducer;
