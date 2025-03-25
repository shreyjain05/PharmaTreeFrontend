import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // Import authentication reducer

const store = configureStore({
  reducer: {
    auth: authReducer, // Add reducers here
  },
});
export default store;
