import baseApi from "@/redux/api/baseApi";

export interface AdminServiceListParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
}

export interface AdminService {
  id: string;
  title: string;
  description?: string | null;
  files?: string | null;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminServiceListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
  data: AdminService[];
}

const adminServicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminServices: builder.query<AdminServiceListResponse, AdminServiceListParams | void>({
      query: (params) => ({
        url: "/services",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["services"],
    }),
  }),
});

export const { useGetAdminServicesQuery } = adminServicesApi;
