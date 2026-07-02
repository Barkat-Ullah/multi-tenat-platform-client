import baseApi from "@/redux/api/baseApi";

export interface ClinicAnalyticsUser {
  id?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
}

export interface ClinicAnalyticsOverview {
  appointmentsThisMonth: number;
  todaysAppointment: number;
  completed: number;
  pending: number;
}

export interface ClinicAnalyticsAppointment {
  id: string;
  driverName?: string;
  driverEmail?: string;
  clientName?: string;
  clientEmail?: string;
  serviceType?: string;
  serviceTitle?: string;
  service?: string;
  scheduledAt?: string;
  appointmentTime?: string;
  location?: string;
  status?: string;
  driver?: ClinicAnalyticsUser | null;
}

export interface ClinicAnalyticsData {
  overview: ClinicAnalyticsOverview;
  todaysAppointments: ClinicAnalyticsAppointment[];
}

export interface ClinicAnalyticsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ClinicAnalyticsData;
}

const clinicDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClinicAnalytics: builder.query<ClinicAnalyticsResponse, void>({
      query: () => ({
        url: "/analytics/clinic",
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),
  }),
});

export const { useGetClinicAnalyticsQuery } = clinicDashboardApi;
