/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi"; // <-- adjust path if different

// ---------------- TYPES ----------------
export type ProfileData = {
  id: string;
  email: string;
  role: string;
  profile: {
    name: string;
    phone: string;
    street: string;
    city: string;
    zipCode: string;
    region: string;
    country: string;
    description: string;
    avatar: string;
  };
  stats: {
    totalProperty: number;
    totalShare: number;
    totalView: number;
    totalSaved: number;
  };
};

export type GetProfileResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: ProfileData;
};

export type UpdateProfileResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data?: ProfileData; // some backends return updated user, some only message
};

// Your backend expects JSON string inside "data"
export type UpdateProfilePayload = {
  name?: string;
  phone?: string;
  street?: string;
  city?: string;
  zipCode?: string;
  region?: string;
  country?: string;
  description?: string;
};

// ---------------- API ----------------
export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAgencyProfileData: builder.query<GetProfileResponse, void>({
      query: () => ({
        url: "/users/me/agency", // GET /api/v1/users
        method: "GET",
      }),
      providesTags: ["profile"],
    }),

        getProfileData: builder.query<GetProfileResponse, void>({
      query: () => ({
        url: "/users/me", // GET /api/v1/users
        method: "GET",
      }),
      providesTags: ["profile"],
    }),


    

    updateProfileData: builder.mutation<UpdateProfileResponse, FormData>({
      query: (body) => ({
        url: "/users", // PATCH /api/v1/users
        method: "PATCH",
        body,
        // ✅ IMPORTANT: do NOT set "Content-Type"
        // browser will set multipart/form-data boundary automatically
      }),
      invalidatesTags: ["profile"],
    }),

    updateThreadId: builder.mutation<any, { threadId: string }>({
      query: (body) => ({
        url: "/users/threadId",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["profile"],
    }),
  }),
});

export const {
  useGetProfileDataQuery,
  useGetAgencyProfileDataQuery,
  useUpdateProfileDataMutation,
  useUpdateThreadIdMutation,
} = profileApi;
