/* eslint-disable @typescript-eslint/no-explicit-any */
// src/redux/api/endpoints/adminEndpoints.ts

import { UserStatus } from "@/utils/types";
import baseApi from "@/redux/api/baseApi";
import type { BackendRole } from "@/utils/roles";

// ===== USER LISTING =====

// ===== USER LISTING =====
export interface RoleSpecificData {
  location?: {
    id: string;
    locationName: string;
    totalBookings?: number;
  } | null;
  services?: Array<{
    id: string;
    title: string;
  }>;
  bookings?: Array<{
    id: string;
    scheduledAt: string;
    status: string;
    createdAt: string;
    driver?: {
      id: string;
      fullName?: string | null;
      email?: string | null;
    } | null;
    service?: {
      id: string;
      title?: string | null;
    } | null;
    timeSlot?: {
      date?: string;
      startTime?: string;
      endTime?: string;
    } | null;
  }>;
  timeSlots?: any[];
  medicalRecords?: any[];
  organizerRequests?: any[];
  bookingCount?: number;
  timeSlotCount?: number;
  medicalRecordCount?: number;
}

export interface User {
  id: string;
  fullName?: string | null;
  email: string;
  image?: string | null;
  phoneNumber?: string | null;
  describe?: string | null;
  city?: string | null;
  address?: string | null;
  verified?: boolean;
  role: BackendRole;
  status: UserStatus;
  method?: string;
  otp?: string | null;
  otpExpiry?: string | null;
  joinDate?: string;
  createdAt?: string;
  updatedAt?: string;
  dob?: string | null;
  dateOfBirth?: string | null;
  licenseNo?: string | null;
  medicalStatus?: string | null;
  medicalExpiry?: string | null;
  clinicGmcNumber?: string | null;
  isParking?: boolean;
  offDays?: string[];
  locationId?: string | null;
  companyLocation?: string | null;
  organizerId?: string | null;
  createdById?: string | null;
  roleSpecificData?: RoleSpecificData | null;
}

export interface UpdateClientInfoPayload {
  fullName?: string;
  phoneNumber?: string;
  describe?: string;
  city?: string;
  address?: string;
  image?: string;
}

export interface SendManualEmailPayload {
  subject: string;
  message: string;
}

export interface UsersMeta {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

export interface UsersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  pagination?: UsersMeta;
  meta?: Partial<UsersMeta>;
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
        url: "/user",
        method: "GET",
        params: {
          page,
          limit,
          searchTerm: search,
          role,
        },
      }),
      providesTags: ["user"],
    }),
    deleteUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/user/soft-delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),
    getSingleUser: builder.query<
      { success: boolean; statusCode: number; message: string; data: User },
      string
    >({
      query: (id) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    updateUserStatus: builder.mutation<any, { id: string; status: UserStatus }>(
      {
        query: ({ id, status }) => ({
          url: `/user/user-status/${id}`,
          method: "PUT",
          body: { status },
        }),
        invalidatesTags: ["user"],
      },
    ),
    updateClientInfo: builder.mutation<
      any,
      { id: string; body: UpdateClientInfoPayload }
    >({
      query: ({ id, body }) => ({
        url: `/user/update-client-info/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["user"],
    }),
    sendManualEmail: builder.mutation<
      any,
      { id: string; body: SendManualEmailPayload }
    >({
      query: ({ id, body }) => ({
        url: `/user/send-email/${id}`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
  useUpdateClientInfoMutation,
  useSendManualEmailMutation,
} = userApi;
