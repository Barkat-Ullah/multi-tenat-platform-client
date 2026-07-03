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

export interface AdminServiceMutationResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: AdminService;
}

export interface DeleteAdminServiceResponse {
  success: boolean;
  statusCode: number;
  message: string;
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
    createAdminService: builder.mutation<AdminServiceMutationResponse, FormData>({
      query: (body) => ({
        url: "/services",
        method: "POST",
        body,
      }),
      invalidatesTags: ["services", "dashboard"],
    }),
    updateAdminService: builder.mutation<
      AdminServiceMutationResponse,
      { id: string; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/services/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["services", "dashboard"],
    }),
    deleteAdminService: builder.mutation<DeleteAdminServiceResponse, string>({
      query: (id) => ({
        url: `/services/soft-delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["services", "dashboard"],
    }),
  }),
});

export const {
  useGetAdminServicesQuery,
  useCreateAdminServiceMutation,
  useUpdateAdminServiceMutation,
  useDeleteAdminServiceMutation,
} = adminServicesApi;
