import baseApi from "@/redux/api/baseApi";

export type AdminAnalyticsPeriod = "daily" | "weekly" | "monthly";

export interface AdminAnalyticsOverview {
  bookings: number;
  pendingBookings: number;
  revenue: number;
  activeLocations: number;
  totalServices: number;
}

export interface AdminAnalyticsTrend {
  month: string;
  bookings: number;
  revenue: number;
}

export interface AdminRecentBooking {
  id: string;
  driverName: string;
  service: string;
  scheduledAt: string;
  status: string;
}

export interface AdminRecentMedicalRecord {
  id: string;
  result: string;
  files?: string | null;
  createdAt: string;
  driverName: string;
  clinicName: string;
  bookingId?: string | null;
  service: string;
  organizerRequestId?: string | null;
  companyName?: string | null;
}

export interface AdminTopService {
  serviceId: string;
  title: string;
  count: number;
}

export interface AdminAnalyticsData {
  period: AdminAnalyticsPeriod | string;
  rangeStart: string;
  rangeEnd: string;
  overview: AdminAnalyticsOverview;
  trend: AdminAnalyticsTrend[];
  recentBookings: AdminRecentBooking[];
  recentMedicalRecords: AdminRecentMedicalRecord[];
  topServices: AdminTopService[];
}

export interface AdminAnalyticsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AdminAnalyticsData;
}

const adminDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminAnalytics: builder.query<
      AdminAnalyticsResponse,
      AdminAnalyticsPeriod
    >({
      query: (period) => ({
        url: "/analytics/admin",
        method: "GET",
        params: { period },
      }),
      providesTags: ["dashboard"],
    }),
  }),
});

export const { useGetAdminAnalyticsQuery } = adminDashboardApi;
