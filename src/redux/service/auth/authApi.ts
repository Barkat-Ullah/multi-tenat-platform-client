/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";
import type { BackendRole } from "@/utils/roles";

export interface AuthResponse<T = unknown> {
  success: boolean;
  statusCode?: number;
  message?: string;
  data?: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken?: string;
  role?: BackendRole;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: Extract<BackendRole, "USER" | "ORGINIZER">;
  companyLocation?: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<AuthResponse, RegisterRequest>({
      query: (user) => ({
        url: "/auth/register",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["auth"],
    }),
    verifyUser: builder.mutation<AuthResponse, VerifyOtpRequest>({
      query: (user) => ({
        url: "/auth/verify-email-with-otp",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["auth"],
    }),

    loginUser: builder.mutation<AuthResponse<LoginResponseData>, LoginRequest>({
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
    forgotPassword: builder.mutation<AuthResponse, { email: string }>({
      query: (body) => ({
        url: "/auth/forget-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["auth"],
    }),
    resetPassword: builder.mutation<AuthResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    changePassword: builder.mutation<AuthResponse, ChangePasswordRequest>({
      query: (user) => ({
        url: "/auth/change-password",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["auth"],
    }),
    resendOtp: builder.mutation<AuthResponse, { email: string }>({
      query: (body) => ({
        url: `/auth/resend-verification-with-otp`,
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
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useResendOtpMutation,
} = authApi;
export const { endpoints: authEndpoints } = authApi;
