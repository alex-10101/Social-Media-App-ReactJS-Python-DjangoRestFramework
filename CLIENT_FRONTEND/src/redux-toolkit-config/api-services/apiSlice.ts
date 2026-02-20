import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { getCSRFCookie } from "./djangoCSRFCookie/getCSRFCookie";
import { removeCredentials } from "../slices/authSlice";

const BASE_URL = "http://localhost:8000/api/";
// const CSRF_COOKIE_URL = `${BASE_URL}auth/csrf_cookie`;
const LOGOUT_URL = `${BASE_URL}auth/logout/`;

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api",
  credentials: "include",
  prepareHeaders: (headers) => {
    const csrfCookie = getCSRFCookie("csrftoken");
    if (csrfCookie) {
      headers.set("X-CSRFToken", csrfCookie);
    }
    return headers;
  },
});

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (
    result.error &&
    "originalStatus" in result.error &&
    result.error.originalStatus === 403
  ) {
    // Best-effort backend logout
    try {
      await fetch(LOGOUT_URL, {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRFToken": getCSRFCookie("csrftoken") ?? "",
        },
      });
    } catch {
      // ignore logout errors; we'll still clear client state
    }

    // Clear client-side auth
    api.dispatch(removeCredentials());
    api.dispatch(apiSlice.util.resetApiState());
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    "posts",
    "comments",
    "commentCount",
    "likes",
    "relationships",
    "users",
    "uploads",
  ],
  // underscore `_` is added to please typescript (variable not used (?))
  endpoints: (_builder) => ({}),
});
