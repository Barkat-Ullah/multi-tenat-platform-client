import baseApi from "@/redux/api/baseApi";

export interface AdminReportListParams {
  page: number;
  limit: number;
  searchTerm?: string;
}

export interface AdminMedicalRecord {
  id: string;
  clinicId: string;
  bookingId: string | null;
  driverId: string;
  result: string;
  files: string | null;
  notes: string | null;
  expiryDate: string | null;
  createdAt: string;
  updatedAt: string;
  clinic?: {
    email?: string | null;
    fullName?: string | null;
  } | null;
  driver?: {
    id?: string;
    fullName?: string | null;
    email?: string | null;
  } | null;
  booking?: {
    id?: string;
    service?: {
      title?: string | null;
    } | null;
  } | null;
}

export interface AdminMedicalRecordListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: AdminMedicalRecord[];
}

const adminReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminReports: builder.query<
      AdminMedicalRecordListResponse,
      AdminReportListParams
    >({
      query: (params) => ({
        url: "/medical-records",
        method: "GET",
        params,
      }),
      providesTags: ["medicalRecords"],
    }),
  }),
});

export const { useGetAdminReportsQuery } = adminReportsApi;
