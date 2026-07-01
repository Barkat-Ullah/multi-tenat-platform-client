import baseApi from "@/redux/api/baseApi";

export interface DriverAnalyticsOverview {
  totalAppointment: number;
  todayAppointment: number;
  completed: number;
  pending: number;
}

export interface DriverAnalyticsAppointment {
  id: string;
  serviceTitle: string;
  scheduledAt: string;
  location: string;
  clinicName: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | string;
}

export interface DriverAnalyticsData {
  overview: DriverAnalyticsOverview;
  appointments: DriverAnalyticsAppointment[];
}

export interface DriverAnalyticsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: DriverAnalyticsData;
}

const userDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDriverAnalytics: builder.query<DriverAnalyticsResponse, void>({
      query: () => ({
        url: "/analytics/driver",
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),
  }),
});

export const { useGetDriverAnalyticsQuery } = userDashboardApi;
