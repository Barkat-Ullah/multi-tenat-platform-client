import baseApi from "@/redux/api/baseApi";

export interface ClinicCorporateListParams {
  page: number;
  limit: number;
}

export interface CorporateDriver {
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

export interface ClinicCorporateRequest {
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
    title: string;
    description?: string | null;
    files?: string | null;
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
  drivers: CorporateDriver[];
}

export interface ClinicCorporateListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: ClinicCorporateRequest[];
}

export interface UploadCorporateRecordResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: unknown;
}

const clinicCorporatesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClinicCorporates: builder.query<
      ClinicCorporateListResponse,
      ClinicCorporateListParams
    >({
      query: (params) => ({
        url: "/organizer-requests",
        method: "GET",
        params,
      }),
      providesTags: ["bookings"],
    }),
    uploadCorporateDriverRecord: builder.mutation<
      UploadCorporateRecordResponse,
      FormData
    >({
      query: (body) => ({
        url: "/medical-records",
        method: "POST",
        body,
      }),
      invalidatesTags: ["medicalRecords"],
    }),
  }),
});

export const {
  useGetClinicCorporatesQuery,
  useUploadCorporateDriverRecordMutation,
} = clinicCorporatesApi;
