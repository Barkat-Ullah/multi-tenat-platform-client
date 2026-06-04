import baseApi from "@/redux/api/baseApi";

// Agency Statistics Data Interface
export interface AgencyStatisticsData {
  properties: number;
  bookedProperties: number;
  availableProperties: number;
  visitors: number;
  favorites: number;
}

// Agent Statistics Response Interface
export interface AgencyStatisticsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AgencyStatisticsData;
}

// Create API slice
const agencyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Use query for GET
    getAgencyStatistics: builder.query<AgencyStatisticsResponse, void>({
      query: () => ({
        url: "/agency/statistics",
        method: "GET",
        // No body for GET
      }),
      providesTags: ["dashboard"], // Fixed typo
    }),
  }),
});

export const { useGetAgencyStatisticsQuery } = agencyApi;

