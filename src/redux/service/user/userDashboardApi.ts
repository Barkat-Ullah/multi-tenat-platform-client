import baseApi from "@/redux/api/baseApi";
import { CorporateAnalyticsResponse } from "../corporate/corporateDashboardApi";

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

export interface UserBookingListParams {
  page?: number;
  limit?: number;
}

export interface BookingUser {
  id?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  licenseNo?: string | null;
  medicalStatus?: string;
  clinicGmcNumber?: string;
  city?: string;
  address?: string;
  location?: {
    id?: string;
    locationName?: string;
  } | null;
}

export interface BookingService {
  id?: string;
  title?: string;
  description?: string | null;
}

export interface BookingTimeSlot {
  id?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  status?: string;
}

export interface BookingPaymentMethod {
  id?: string;
  type?: string;
  isActive?: boolean;
}

export interface BookingPayment {
  id?: string;
  status?: string;
  amount?: number;
}

export interface BookingMedicalRecord {
  id?: string;
  result?: string;
}

export interface UserBookingItem {
  id: string;
  serviceId?: string;
  driverId?: string;
  clinicId?: string;
  timeSlotId?: string;
  paymethodId?: string;
  scheduledAt: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | string;
  createdAt?: string;
  location?: string;
  serviceTitle?: string;
  clinicName?: string;
  clinicEmail?: string;
  service?: BookingService | null;
  clinic?: BookingUser | null;
  driver?: BookingUser | null;
  timeSlot?: BookingTimeSlot | null;
  method?: BookingPaymentMethod | null;
  payment?: BookingPayment | null;
  medicalRecord?: BookingMedicalRecord | null;
}

export interface UserBookingsMeta {
  total: number;
  page: number;
  limit: number;
}

export interface UserBookingsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: UserBookingsMeta;
  data: UserBookingItem[];
}

export interface MedicalRecordItem {
  id: string;
  bookingId?: string | null;
  organizerRequestId?: string | null;
  driverId: string;
  clinicId: string;
  result: "Pending" | "Submitted" | string;
  files?: string | string[] | null;
  notes?: string | null;
  expiryDate?: string | null;
  createdAt: string;
  updatedAt?: string;
  booking?: UserBookingItem | null;
  driver?: BookingUser | null;
  clinic?: BookingUser | null;
  organizerRequest?: {
    id?: string;
    companyName?: string;
    email?: string;
    phone?: string;
    location?: string;
    totalDriver?: string | number;
    service?: BookingService | null;
  } | null;
}

export interface MedicalRecordsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: UserBookingsMeta;
  data: MedicalRecordItem[];
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
    getMyBookings: builder.query<UserBookingsResponse, UserBookingListParams | void>({
      query: (params) => ({
        url: "/bookings/my",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["bookings"],
    }),
    cancelMyBooking: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({
        url: `/bookings/cancel/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["bookings", "dashboard"],
    }),
    getMyMedicalRecords: builder.query<MedicalRecordsResponse, void>({
      query: () => ({
        url: "/medical-records/my",
        method: "GET",
      }),
      providesTags: ["medicalRecords"],
    }),
  }),
});

export const {
  useGetDriverAnalyticsQuery,
  useGetMyBookingsQuery,
  useCancelMyBookingMutation,
  useGetMyMedicalRecordsQuery,
} = userDashboardApi;
