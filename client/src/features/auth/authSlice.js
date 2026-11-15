import { createSlice } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";

export const sameSession = (first, second) => {
  if (!first || !second) return false;
  try {
    const a = jwtDecode(first).UserInfo;
    const b = jwtDecode(second).UserInfo;
    return Boolean(a?.userId && a.userId === b?.userId && a.sessionId === b.sessionId && (a.tokenVersion || 0) === (b.tokenVersion || 0));
  } catch { return false; }
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    user: null,
    restoring: typeof localStorage !== "undefined" && localStorage.getItem("persist") === "true",
  },
  reducers: {
    setCredentials: (state, action) => {
      const previousToken = state.token;
      state.token = action.payload.accessToken;
      if (action.payload.user) {
        if (!sameSession(previousToken, action.payload.accessToken) || !state.user || (action.payload.user.accountDataRevision || 0) >= (state.user.accountDataRevision || 0)) state.user = action.payload.user;
      }
      else {
        try { state.user = jwtDecode(action.payload.accessToken).UserInfo; }
        catch { state.user = null; }
      }
    },
    logOut: (state) => {
      state.token = null;
      state.user = null;
    },
    setRestoring: (state, action) => {
      state.restoring = action.payload;
    },
  },
});

export const { setCredentials, logOut, setRestoring } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentToken = (state) => state.auth.token;
