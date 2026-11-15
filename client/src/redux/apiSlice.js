import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut, sameSession } from "../features/auth/authSlice";
import { refreshSession, withSessionLock } from "./refreshSession";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_SERVER_BASE_URL,
  credentials: "include",

  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const initialToken = api.getState().auth.token;
  let expectedToken = initialToken;
  const url = typeof args === "string" ? args : args.url;
  const locked = url === "/auth/login" || url === "/auth/logout" || (url.startsWith("/user/") && args?.method === "PUT" && Boolean(args?.body?.password));
  const execute = () => locked ? withSessionLock(() => {
    if (url !== "/auth/login" && api.getState().auth.token !== expectedToken) return { error: { status: "CUSTOM_ERROR", error: "Your session changed. Please try again." } };
    return baseQuery(args, api, extraOptions);
  }) : baseQuery(args, api, extraOptions);
  let result;
  try { result = await execute(); }
  catch (error) { return { error: { status: "CUSTOM_ERROR", error: error.message, data: { message: error.message } } }; }
  if (!url.startsWith("/auth/") && (result?.error?.status === 403 || result?.error?.originalStatus === 403)) {
    if (initialToken && !api.getState().auth.token) return result;
    if (api.getState().auth.token !== initialToken) {
      if (!sameSession(initialToken, api.getState().auth.token)) return result;
      expectedToken = api.getState().auth.token;
      try { return await execute(); }
      catch (error) { return { error: { status: "CUSTOM_ERROR", error: error.message, data: { message: error.message } } }; }
    }
    let refreshResult;
    try { refreshResult = await refreshSession(() => baseQuery("/auth/refresh", api, extraOptions)); }
    catch (error) { return { error: { status: "CUSTOM_ERROR", error: error.message, data: { message: error.message } } }; }
    if (api.getState().auth.token !== initialToken) {
      if (!sameSession(initialToken, api.getState().auth.token)) return result;
      expectedToken = api.getState().auth.token;
      try { return await execute(); }
      catch (error) { return { error: { status: "CUSTOM_ERROR", error: error.message, data: { message: error.message } } }; }
    }

    if (refreshResult?.data) {
      api.dispatch(setCredentials({ ...refreshResult.data }));
      expectedToken = api.getState().auth.token;

      try { result = await execute(); }
      catch (error) { return { error: { status: "CUSTOM_ERROR", error: error.message, data: { message: error.message } } }; }
    } else {
      if ([401, 403].includes(refreshResult?.error?.status)) {
        api.dispatch(logOut());
        localStorage.setItem("persist", false);
        return { error: { status: 403, data: { message: "Your login has expired. Please sign in again." } } };
      }
      return refreshResult;
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["recipes", "recipeDetail", "recipeComments", "recipeSaved", "blogs", "blogDetail", "blogComments", "users"],
  endpoints: () => ({}),
});
