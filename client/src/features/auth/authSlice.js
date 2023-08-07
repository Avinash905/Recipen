import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.accessToken;
      localStorage.setItem("token", action.payload.accessToken);
    },
    logOut: (state) => {
      state.token = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentToken = (state) => state.auth.token;
