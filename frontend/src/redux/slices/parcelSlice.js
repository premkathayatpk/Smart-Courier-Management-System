import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,

  parcels: [],

  parcel: null,

  error: null,
};

const parcelSlice = createSlice({
  name: "parcel",

  initialState,

  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },

    setParcels(state, action) {
      state.loading = false;
      state.parcels = action.payload;
      state.error = null;
    },

    setParcel(state, action) {
      state.loading = false;
      state.parcel = action.payload;
      state.error = null;
    },

    addParcel(state, action) {
      state.parcels.unshift(action.payload);
    },

    updateParcel(state, action) {
      state.parcels = state.parcels.map((parcel) =>
        parcel._id === action.payload._id ? action.payload : parcel,
      );
    },

    removeParcel(state, action) {
      state.parcels = state.parcels.filter(
        (parcel) => parcel._id !== action.payload,
      );
    },

    setError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setParcels,
  setParcel,
  addParcel,
  updateParcel,
  removeParcel,
  setError,
} = parcelSlice.actions;

export default parcelSlice.reducer;
