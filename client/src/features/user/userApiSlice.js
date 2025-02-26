import { apiSlice } from "../../redux/apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users/list",
      providesTags: ["users"],
    }),
    createUser: builder.mutation({
      query: (credentials) => ({
        url: "/users/create",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    updateUser: builder.mutation({
      query: (args) => {
        const { userId, ...userData } = args;
        return {
          url: `/users/${userId}`,
          method: "PUT",
          body: { ...userData },
        };
      },
      invalidatesTags: ["users"],
    }),
    disableUser: builder.mutation({
      query: (userId) => ({
        url: `/users/disable/${userId}`,
        method: "PUT",
      }),
      invalidatesTags: ["users"],
    }),
    subscribeUser: builder.mutation({
      query: () => ({
        url: `/stripe/create-checkout-session`,
        method: "POST",
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDisableUserMutation,
  useSubscribeUserMutation,
} = userApiSlice;
