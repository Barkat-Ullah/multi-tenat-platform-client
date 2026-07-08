import baseApi from "@/redux/api/baseApi";

export interface AdminLocationListParams {
  page: number;
  limit: number;
  searchTerm?: string;
}

export interface AdminLocation {
  id: string;
  locationName: string;
  lat: number;
  lng: number;
  image: string | null;
  totalBookings: number;
  totalClinicsAdded: number;
  isDeleted: boolean;
  createdAt: string;
}

export interface AdminLocationListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: AdminLocation[];
}

export interface CreateAdminLocationRequest {
  locationName: string;
  lat: number;
  lng: number;
  image?: File | null;
}

export interface LocationMutationResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: AdminLocation;
}

const adminLocationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminLocations: builder.query<
      AdminLocationListResponse,
      AdminLocationListParams
    >({
      query: (params) => ({
        url: "/locations",
        method: "GET",
        params,
      }),
      providesTags: ["locations"],
    }),
    createAdminLocation: builder.mutation<
      LocationMutationResponse,
      FormData
    >({
      query: (body) => ({
        url: "/locations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["locations", "dashboard"],
    }),
    deleteAdminLocation: builder.mutation<LocationMutationResponse, string>({
      query: (id) => ({
        url: `/locations/soft-delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["locations", "dashboard"],
    }),
  }),
});

export const {
  useGetAdminLocationsQuery,
  useCreateAdminLocationMutation,
  useDeleteAdminLocationMutation,
} = adminLocationsApi;
