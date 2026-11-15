import { apiSlice } from "../../redux/apiSlice";

export const blogApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBlogCatalog: builder.query({
      query: ({ scope = "public", ...params }) => ({ url: `/${"blog"}/catalog${scope === "public" ? "" : `/${scope}`}`, params }),
      providesTags: ["blogs"],
    }),
    getBlog: builder.query({
      query: (blogId) => `/blog/${blogId}?includeComments=false`,
      providesTags: (_result, _error, blogId) => [{ type: "blogDetail", id: blogId }],
    }),
    getBlogComments: builder.query({
      query: ({ blogId, page }) => ({ url: `/blog/${blogId}/comments`, params: { page, limit: 10 } }),
      providesTags: (_result, _error, { blogId }) => [{ type: "blogComments", id: blogId }],
    }),
    getBlogs: builder.query({
      query: (params) => params ? { url: "/blog", params } : "/blog",
      providesTags: ["blogs"],
    }),
    addBlog: builder.mutation({
      query: (blogData) => ({
        url: "/blog",
        method: "POST",
        body: { ...blogData },
      }),
      invalidatesTags: ["blogs"],
    }),
    updateBlog: builder.mutation({
      query: (args) => {
        const { blogId, ...blogData } = args;
        return {
          url: `/blog/${blogId}`,
          method: "PUT",
          body: { ...blogData },
        };
      },
      invalidatesTags: (_result, _error, { blogId }) => ["blogs", { type: "blogDetail", id: blogId }],
    }),
    deleteBlog: builder.mutation({
      query: (blogId) => ({
        url: `/blog/${blogId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, blogId) => ["blogs", { type: "blogDetail", id: blogId }, { type: "blogComments", id: blogId }],
    }),
    commentBlog: builder.mutation({
      query: (args) => {
        const { blogId, comment } = args;
        return {
          url: `/blog/comment/${blogId}`,
          method: "PUT",
          body: { comment },
        };
      },
      invalidatesTags: (_result, error, { blogId }) => error ? [] : [{ type: "blogComments", id: blogId }],
    }),
    deleteCommentBlog: builder.mutation({
      query: (args) => {
        const { blogId, commentId } = args;
        return {
          url: `/blog/comment/${blogId}/${commentId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (_result, error, { blogId }) => error ? [] : [{ type: "blogComments", id: blogId }],
    }),
  }),
});

export const {
  useGetBlogQuery,
  useGetBlogCommentsQuery,
  useGetBlogCatalogQuery,
  useGetBlogsQuery,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useCommentBlogMutation,
  useDeleteCommentBlogMutation,
} = blogApiSlice;
