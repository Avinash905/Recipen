import { apiSlice } from "../../redux/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation({
      query: (credentials) => ({
        url: "/api/auth/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    signUp: builder.mutation({
      query: (credentials) => ({
        url: "/api/auth/register",
        method: "POST",
        body: { ...credentials },
      }),
    }),
  }),
});

export const { useSignInMutation, useSignUpMutation } = authApiSlice;
