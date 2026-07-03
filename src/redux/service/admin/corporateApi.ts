import baseApi from "@/redux/api/baseApi";

export interface AdminCorporateListParams {
  page: number;
  limit: number;
}

export interface AdminCorporateDriver {
  id: string;
  organizerRequestId: string;
  driverId: string;
  createdAt?: string;
  driver: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber?: string | null;
  };
}

export interface AdminCorporateRequest {
  id: string;
  userId: string;
  serviceId: string;
  clinicId?: string | null;
  companyName: string;
  email: string;
  phone?: string | null;
  location: string;
  totalDriver: string;
  status: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt?: string;
  service?: {
    id: string;
    userId?: string;
    title: string;
    description?: string | null;
    files?: string | null;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
  } | null;
  clinic?: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  organizer?: {
    id: string;
    fullName: string;
  } | null;
  drivers?: AdminCorporateDriver[];
}

export interface AdminCorporateListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
    corporateClients: number;
    activeCorporate: number;
    monthlyBookings: number;
    reqCorporates: number;
  };
  data: AdminCorporateRequest[];
}

export interface UpdateCorporateRequestStatusPayload {
  id: string;
  clinicId: string | null;
  status: "Confirmed" | "Canceled";
}

export interface UpdateCorporateRequestStatusResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: AdminCorporateRequest;
}

const adminCorporateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminCorporateRequests: builder.query<
      AdminCorporateListResponse,
      AdminCorporateListParams
    >({
      query: (params) => ({
        url: "/organizer-requests",
        method: "GET",
        params,
      }),
      providesTags: ["corporates"],
    }),
    updateCorporateRequestStatus: builder.mutation<
      UpdateCorporateRequestStatusResponse,
      UpdateCorporateRequestStatusPayload
    >({
      query: ({ id, clinicId, status }) => ({
        url: `/organizer-requests/assign-clinic/${id}`,
        method: "PATCH",
        body: {
          clinicId,
          status,
        },
      }),
      invalidatesTags: ["corporates", "dashboard"],
    }),
  }),
});

export const {
  useGetAdminCorporateRequestsQuery,
  useUpdateCorporateRequestStatusMutation,
} = adminCorporateApi;
