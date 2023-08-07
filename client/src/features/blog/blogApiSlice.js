import { apiSlice } from "../../redux/apiSlice";

export const blogApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBlog: builder.query({
      query: (blogId) => `/api/blog/${blogId}`,
    }),
    getBlogs: builder.query({
      query: () => "/api/blog",
    }),
    addBlog: builder.mutation({
      query: (blogData) => ({
        url: "/api/blog",
        method: "POST",
        body: { ...blogData },
      }),
    }),
    updateBlog: builder.mutation({
      query: (blogData, blogId) => ({
        url: `/api/blog/${blogId}`,
        method: "PUT",
        body: { ...blogData },
      }),
    }),
    deleteBlog: builder.mutation({
      query: (blogId) => ({
        url: `/api/blog/${blogId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetBlogQuery,
  useGetBlogsQuery,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApiSlice;
