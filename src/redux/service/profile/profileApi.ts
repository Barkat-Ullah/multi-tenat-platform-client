import { baseApi } from "@/redux/api/baseApi";
import type { BackendRole } from "@/utils/roles";

export type ProfileData = {
  id: string;
  email: string;
  fullName?: string;
  phoneNumber?: string | null;
  dob?: string | null;
  image?: string | null;
  role: BackendRole | string;
  status?: string;
  describe?: string | null;
  city?: string | null;
  address?: string | null;
  licenseNo?: string | null;
  medicalStatus?: string | null;
  medicalExpiry?: string | null;
  companyLocation?: string | null;
  clinicGmcNumber?: string | null;
  profile?: {
    name?: string;
    phone?: string;
    avatar?: string | null;
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
  data?: ProfileData;
};

export type UpdateProfilePayload = {
  fullName?: string;
  phoneNumber?: string;
  image?: null;
};

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAgencyProfileData: builder.query<GetProfileResponse, void>({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
      providesTags: ["profile"],
    }),

    getProfileData: builder.query<GetProfileResponse, void>({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
      providesTags: ["profile"],
    }),

    updateProfileData: builder.mutation<UpdateProfileResponse, FormData>({
      query: (body) => ({
        url: "/user/update-profile",
        method: "PUT",
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
} = profileApi;
