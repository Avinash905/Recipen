import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: null,
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const { setUsers } = userSlice.actions;
export default userSlice.reducer;

export const selectCurrentUsers = (state) => state.user.users;
