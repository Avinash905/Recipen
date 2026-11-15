import { apiSlice } from "../../redux/apiSlice";

export const recipeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecipeCatalog: builder.query({
      query: ({ scope = "public", ...params }) => ({ url: `/${"recipe"}/catalog${scope === "public" ? "" : `/${scope}`}`, params: { ...params, ratingSummary: true } }),
      providesTags: (_result, _error, { scope = "public" }) => [scope === "saved" ? "recipeSaved" : "recipes"],
    }),
    getRecipe: builder.query({
      query: (recipeId) => `/recipe/${recipeId}?includeComments=false`,
      providesTags: (_result, _error, recipeId) => [{ type: "recipeDetail", id: recipeId }],
    }),
    getRecipeComments: builder.query({
      query: ({ recipeId, page }) => ({ url: `/recipe/${recipeId}/comments`, params: { page, limit: 10 } }),
      providesTags: (_result, _error, { recipeId }) => [{ type: "recipeComments", id: recipeId }],
    }),
    getRecipes: builder.query({
      query: (params) => params ? { url: "/recipe", params } : "/recipe",
      providesTags: ["recipes"],
    }),
    addRecipe: builder.mutation({
      query: (recipeData) => ({
        url: "/recipe",
        method: "POST",
        body: { ...recipeData },
      }),
      invalidatesTags: ["recipes"],
    }),
    updateRecipe: builder.mutation({
      query: (args) => {
        const { recipeId, ...recipeData } = args;
        return {
          url: `/recipe/${recipeId}`,
          method: "PUT",
          body: { ...recipeData },
        };
      },
      invalidatesTags: (_result, _error, { recipeId }) => ["recipes", "recipeSaved", { type: "recipeDetail", id: recipeId }],
    }),
    rateRecipe: builder.mutation({
      query: (args) => {
        const { recipeId, rating } = args;
        return {
          url: `/recipe/rate/${recipeId}`,
          method: "PUT",
          body: { rating },
        };
      },
      invalidatesTags: (_result, _error, { recipeId }) => ["recipes", "recipeSaved", { type: "recipeDetail", id: recipeId }],
    }),
    deleteRecipe: builder.mutation({
      query: (recipeId) => ({
        url: `/recipe/${recipeId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, recipeId) => ["recipes", "recipeSaved", { type: "recipeDetail", id: recipeId }, { type: "recipeComments", id: recipeId }],
    }),
    commentRecipe: builder.mutation({
      query: (args) => {
        const { recipeId, comment } = args;
        return {
          url: `/recipe/comment/${recipeId}`,
          method: "PUT",
          body: { comment },
        };
      },
      invalidatesTags: (_result, error, { recipeId }) => error ? [] : [{ type: "recipeComments", id: recipeId }],
    }),
    deleteCommentRecipe: builder.mutation({
      query: (args) => {
        const { recipeId, commentId } = args;
        return {
          url: `/recipe/comment/${recipeId}/${commentId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (_result, error, { recipeId }) => error ? [] : [{ type: "recipeComments", id: recipeId }],
    }),
    toggleFavorite: builder.mutation({
      query: ({ recipeId, saved }) => {
        return {
          url: `/recipe/favorite/${recipeId}`,
          method: "PUT",
          body: { saved },
        };
      },
      invalidatesTags: ["recipeSaved"],
    }),
  }),
});

export const {
  useGetRecipeQuery,
  useGetRecipeCommentsQuery,
  useGetRecipeCatalogQuery,
  useGetRecipesQuery,
  useAddRecipeMutation,
  useUpdateRecipeMutation,
  useRateRecipeMutation,
  useDeleteRecipeMutation,
  useCommentRecipeMutation,
  useDeleteCommentRecipeMutation,
  useToggleFavoriteMutation,
} = recipeApiSlice;
