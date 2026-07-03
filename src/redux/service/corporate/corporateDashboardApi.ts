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

interface Meta {
  total: number;
  page: number;
  limit: number;
}

export interface CorporateDriver {
  id: string;
  fullName: string;
  email: string;
  image: string | null;
  lastMedical: string | null;
  expiryDate: string | null;
  service: string | null;
  medicalResult: string | null;
}

export interface CorporateAllDriversResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: Meta;
  data: CorporateDriver[];
}

export interface ServiceItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  files?: string | null;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServicesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ServiceItem[];
}

export interface CreateOrganizerRequestPayload {
  companyName: string;
  serviceId: string;
  email: string;
  phone: string;
  location: string;
  totalDriver: string;
}

export interface CreateOrganizerRequestResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    id: string;
    userId: string;
    serviceId: string;
    clinicId?: string | null;
    companyName: string;
    email: string;
    phone: string;
    location: string;
    totalDriver: string;
    status: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface CorporateReport {
  id: string;
  title: string;
  driverName: string;
  generatedDate: string;
  hospitalName: string;
  fileUrl?: string | null;
}

export interface CorporateReportsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: Meta;
  data: CorporateReport[];
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

    getCorporateAllDrivers: builder.query<CorporateAllDriversResponse, void>({
      query: () => ({
        url: "/user/org-driver",
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),

    createCorporateDriver: builder.mutation<any, { fullName: string; email: string; phoneNumber: string }>({
      query: (body) => ({
        url: "/user/org-driver",
        method: "POST",
        body,
      }),
      invalidatesTags: ["dashboard"],
    }),

    getAllServices: builder.query<ServicesResponse, void>({
      query: () => ({
        url: "/services",
        method: "GET",
      }),
    }),

    createOrganizerRequest: builder.mutation<CreateOrganizerRequestResponse, CreateOrganizerRequestPayload>({
      query: (body) => ({
        url: "/organizer-requests",
        method: "POST",
        body,
      }),
    }),

    getCorporateReports: builder.query<CorporateReportsResponse, void>({
      query: () => ({
        url: "/user/org-driver-reports",
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),
  }),
});

export const {
  useGetCorporateAnalyticsQuery,
  useGetCorporateAllDriversQuery,
  useCreateCorporateDriverMutation,
  useGetAllServicesQuery,
  useCreateOrganizerRequestMutation,
  useGetCorporateReportsQuery,
} = corporateDashboardApi;
