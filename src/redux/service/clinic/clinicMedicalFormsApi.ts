import baseApi from "@/redux/api/baseApi";

export interface ClinicMedicalFormListParams {
  page: number;
  limit: number;
}

export interface ClinicMedicalFormRecord {
  id: string;
  clinicId: string;
  bookingId?: string | null;
  organizerRequestId?: string | null;
  driverId: string;
  result: "Pending" | "Submitted" | string;
  files?: string | null;
  notes?: string | null;
  expiryDate?: string | null;
  createdAt: string;
  updatedAt?: string;
  clinic?: {
    email?: string;
  } | null;
}

export interface ClinicMedicalFormListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: ClinicMedicalFormRecord[];
}

const clinicMedicalFormsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClinicMedicalForms: builder.query<
      ClinicMedicalFormListResponse,
      ClinicMedicalFormListParams
    >({
      query: (params) => ({
        url: "/medical-records/my",
        method: "GET",
        params,
      }),
      providesTags: ["medicalRecords"],
    }),
  }),
});

export const { useGetClinicMedicalFormsQuery } = clinicMedicalFormsApi;
