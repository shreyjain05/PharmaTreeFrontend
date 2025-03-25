import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ Load user from AsyncStorage on app start
export const loadUserFromStorage = createAsyncThunk(
  "auth/loadUserFromStorage",
  async () => {
    const storedUser = await AsyncStorage.getItem("loggedInUser");
    return storedUser ? JSON.parse(storedUser) : null;
  }
);

const initialState = {
  loggedInUser: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoggedInUser: (state, action) => {
      state.loggedInUser = action.payload;
      AsyncStorage.setItem("loggedInUser", JSON.stringify(action.payload)); // ✅ Save user persistently
    },
    logoutUser: (state) => {
      state.loggedInUser = null;
      AsyncStorage.removeItem("loggedInUser"); // ✅ Remove user data
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadUserFromStorage.fulfilled, (state, action) => {
      state.loggedInUser = action.payload; // ✅ Restore user from AsyncStorage
    });
  },
});

export const { setLoggedInUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
