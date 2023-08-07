import { apiSlice } from "../../redux/apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/api/user",
    }),
    updateUser: builder.mutation({
      query: (userData, userId) => ({
        url: `/api/user/${userId}`,
        method: "PUT",
        body: { ...userData },
      }),
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/api/user/${userId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApiSlice;
