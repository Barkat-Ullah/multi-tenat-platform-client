import baseApi from "@/redux/api/baseApi";

export interface AdminClinicListParams {
  page: number;
  limit: number;
  searchTerm?: string;
}

export interface AdminClinic {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  status: "ACTIVE" | "INACTIVE" | string;
  clinicGmcNumber: string | null;
  isParking: boolean;
  createdAt: string;
  location?: {
    id: string;
    locationName: string;
  } | null;
  services?: {
    id: string;
    title: string;
  }[];
}

export interface AdminClinicListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: AdminClinic[];
}

export interface CreateAdminClinicRequest {
  email: string;
  fullName: string;
  phoneNumber: string;
  clinicGmcNumber: string;
  serviceId: string[];
  locationId: string;
  isParking: boolean;
}

export interface AdminClinicMutationResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: AdminClinic;
}

const adminCliniciansApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminClinics: builder.query<AdminClinicListResponse, AdminClinicListParams>({
      query: (params) => ({
        url: "/user/clinics",
        method: "GET",
        params,
      }),
      providesTags: ["clinics"],
    }),
    createAdminClinic: builder.mutation<
      AdminClinicMutationResponse,
      CreateAdminClinicRequest
    >({
      query: (body) => ({
        url: "/user/create-clinic",
        method: "POST",
        body,
      }),
      invalidatesTags: ["clinics", "dashboard"],
    }),
    deleteAdminClinic: builder.mutation<AdminClinicMutationResponse, string>({
      query: (id) => ({
        url: `/user/soft-delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["clinics", "user", "dashboard"],
    }),
  }),
});

export const {
  useGetAdminClinicsQuery,
  useCreateAdminClinicMutation,
  useDeleteAdminClinicMutation,
} = adminCliniciansApi;
