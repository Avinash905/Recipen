import { createSlice } from "@reduxjs/toolkit";

const recipeSlice = createSlice({
  name: "recipe",
  initialState: {
    recipes: null,
  },
  reducers: {
    setRecipes: (state, action) => {
      state.recipes = action.payload;
    },
  },
});

export const { setRecipes } = recipeSlice.actions;
export default recipeSlice.reducer;

export const selectCurrentRecipes = (state) => state.recipe.recipes;
