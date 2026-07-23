import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./slices/dashboardSlice";

import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import parcelReducer from "./slices/parcelSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    parcel: parcelReducer,
    dashboard: dashboardReducer,
  },
});
