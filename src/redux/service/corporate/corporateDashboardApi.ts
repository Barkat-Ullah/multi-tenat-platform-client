import baseApi from "@/redux/api/baseApi";

export interface CorporateAnalyticsUser {
  id?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
}

export interface CorporateAnalyticsOverview {
  totalDrivers: number;
  upcomingBookings: number;
  expiringTimeMonths: number;
  expiringDriversCount: number;
}

export interface CorporateBookingHistory {
  month?: string;
  bookings?: number;
}

export interface CorporateAnalyticsData {
  overview: CorporateAnalyticsOverview;
  bookingHistory: CorporateBookingHistory[];
}

export interface CorporateAnalyticsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CorporateAnalyticsData;
}

const corporateDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCorporateAnalytics: builder.query<CorporateAnalyticsResponse, void>({
      query: () => ({
        url: "/analytics/corporate",
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),
  }),
});

export const { useGetCorporateAnalyticsQuery } = corporateDashboardApi;
