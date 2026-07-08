import baseApi from "@/redux/api/baseApi";

export interface PublicLocationsListParams {
  page: number;
  limit: number;
}

export interface PublicLocation {
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

export interface PublicLocationsListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: PublicLocation[];
}

const locationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicLocations: builder.query<
      PublicLocationsListResponse,
      PublicLocationsListParams
    >({
      query: (params) => ({
        url: "/locations",
        method: "GET",
        params,
      }),
      providesTags: ["locations"],
    }),
  }),
});

export const { useGetPublicLocationsQuery } = locationsApi;
