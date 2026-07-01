/* eslint-disable @typescript-eslint/no-explicit-any */
// src/redux/api/endpoints/adminEndpoints.ts

import { UserStatus } from "@/utils/types";
import baseApi from "@/redux/api/baseApi";
import type { BackendRole } from "@/utils/roles";

// ===== USER LISTING =====
export interface User {
  id: string;
  email: string;
  verified: boolean;
  role: BackendRole;
  status: UserStatus;
  method: string;
  otp: string | null;
  otpExpiry: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: User[];
}

// Create API slice
const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<
      UsersResponse,
      { page?: number; limit?: number; search?: string; role?: string }
    >({
      query: ({ page, limit, search, role } = {}) => ({
        url: "/users",
        method: "GET",
        params: {
          page,
          limit,
          search,
          role,
        },
      }),
      providesTags: ["user"],
    }),
    deleteUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),
    getSingleUser: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    updateUserStatus: builder.mutation<any, { id: string; status: UserStatus }>(
      {
        query: ({ id, status }) => ({
          url: `/users/${id}/status`,
          method: "PATCH",
          body: { status },
        }),
        invalidatesTags: ["user"],
      },
    ),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
} = userApi;
