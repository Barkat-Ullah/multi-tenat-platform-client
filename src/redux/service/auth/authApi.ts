/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

interface LoginRequest {
  email: string;
  password: string;
}

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (user) => ({
        url: "/auth/register",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["auth"],
    }),
    verifyUser: builder.mutation<any, { email: string; otp: string }>({
      query: (user) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["auth"],
    }),

    loginUser: builder.mutation<any, LoginRequest>({
      query: (user) => ({
        url: "/auth/login",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["auth"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["auth"],
    }),
    forgatPassword: builder.mutation<any, { email: string }>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["auth"],
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    changePassword: builder.mutation({
      query: (user) => ({
        url: "/auth/change-password",
        method: "PUT",
        body: user,
      }),
      invalidatesTags: ["auth"],
    }),
    resendOtp: builder.mutation({
      query: (body) => ({
        url: `/auth/resend-otp`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["auth"],
    }),
  }),
});

export const {
  useVerifyUserMutation,
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useForgatPasswordMutation,
  useResetPasswordMutation,
  useResendOtpMutation,
} = authApi;
export const { endpoints: authEndpoints } = authApi;
