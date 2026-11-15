import { apiSlice } from "../../redux/apiSlice";
import { logOut, setCredentials, sameSession } from "./authSlice";
import { refreshSession } from "../../redux/refreshSession";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    signUp: builder.mutation({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        const startingToken = getState().auth.token;
        try {
          await queryFulfilled;
        } catch (err) {
          console.error(err);
        } finally {
          if (getState().auth.token === startingToken || sameSession(getState().auth.token, startingToken)) {
            dispatch(logOut());
            dispatch(apiSlice.util.resetApiState());
          }
        }
      },
    }),
    refresh: builder.mutation({
      async queryFn(_arg, _api, _options, baseQuery) {
        try { return await refreshSession(() => baseQuery({ url: "/auth/refresh", method: "GET" })); }
        catch (error) { return { error: { status: "CUSTOM_ERROR", error: error.message, data: { message: error.message } } }; }
      },
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        const startingToken = getState().auth.token;
        const wasPersistent = localStorage.getItem("persist") === "true";
        try {
          const { data } = await queryFulfilled;
          if (getState().auth.token !== startingToken || (wasPersistent && localStorage.getItem("persist") !== "true")) return;
          dispatch(setCredentials(data));
        } catch (err) {
          console.error(err);
        }
      },
    }),
  }),
});

export const {
  useSignInMutation,
  useSignUpMutation,
  useLogoutMutation,
  useRefreshMutation,
} = authApiSlice;
