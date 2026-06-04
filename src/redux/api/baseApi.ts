/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { RootState } from "../store";
import { setAccessToken } from "../features/auth"; // 🔸 `logout` no longer needed → removed import

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth?.accessToken;
    if (token) {
      headers.set("Authorization", `${token}`);
    }
    return headers;
  },
  credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Attempt to refresh the access token
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const newAccessToken = (refreshResult.data as any).accessToken;
      api.dispatch(setAccessToken(newAccessToken));
      // Retry the original request with new token
      result = await baseQuery(args, api, extraOptions);
    }
    // ❌ Auto-logout REMOVED:
    // else {
    //   api.dispatch(logout());
    // }
    // → Now, if refresh fails, the 401 error is returned to the component
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["auth", "roofing", "window","profile","contact","properties","dashboard","user","payments","subscription","subscriptionPlans","favorites"],
  endpoints: () => ({}),
});

export default baseApi;