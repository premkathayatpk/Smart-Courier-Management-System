import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,

  stats: {
    users: {},
    parcels: {},
    revenue: {},
    todayOrders: 0,
  },

  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState,

  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },

    setDashboardStats(state, action) {
      state.loading = false;
      state.stats = action.payload;
      state.error = null;
    },

    setError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setLoading, setDashboardStats, setError } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;
