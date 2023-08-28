import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import authReducer from "../features/auth/authSlice";
import blogReducer from "../features/blog/blogSlice";
import recipeReducer from "../features/recipe/recipeSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    blog: blogReducer,
    recipe: recipeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: false,
});
