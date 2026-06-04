// src/redux/api/aiApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { RootState } from "../store";
import { setAccessToken } from "../features/auth";

const aiBaseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/ai`,
  prepareHeaders: (headers, { getState }) => {

    const token = (getState() as RootState).auth?.accessToken;
    
    // Set Content-Type and Accept headers
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");
    
    if (token) {
      headers.set("Authorization", `${token}`);
    }
    return headers;
  },
  credentials: "include",
});

const aiBaseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await aiBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Attempt to refresh the access token using your main API
    const refreshResult = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
      {
        method: "POST",
        credentials: "include",
      }
    );


    if (refreshResult.ok) {
      const data = await refreshResult.json();
      const newAccessToken = data.accessToken;
      api.dispatch(setAccessToken(newAccessToken));
      // Retry the original request with new token
      result = await aiBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const aiApi = createApi({
  reducerPath: "aiApi",
  baseQuery: aiBaseQueryWithReauth,
  tagTypes: ["ai"],
  endpoints: () => ({}),
});

export default aiApi;