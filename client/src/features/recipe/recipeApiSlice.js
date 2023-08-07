import { apiSlice } from "../../redux/apiSlice";

export const recipeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecipe: builder.query({
      query: (recipeId) => `/api/recipe/${recipeId}`,
    }),
    getRecipes: builder.query({
      query: () => "/api/recipe",
    }),
    addRecipe: builder.mutation({
      query: (recipeData) => ({
        url: "/api/recipe",
        method: "POST",
        body: { ...recipeData },
      }),
    }),
    updateRecipe: builder.mutation({
      query: (recipeData, recipeId) => ({
        url: `/api/recipe/${recipeId}`,
        method: "PUT",
        body: { ...recipeData },
      }),
    }),
    deleteRecipe: builder.mutation({
      query: (recipeId) => ({
        url: `/api/recipe/${recipeId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetRecipeQuery,
  useGetRecipesQuery,
  useAddRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
} = recipeApiSlice;
