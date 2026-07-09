import baseApi from "@/redux/api/baseApi";

export interface AdminBookingListParams {
  page: number;
  limit: number;
  createdAt?: string;
}

export interface AdminBookingCalendarParams {
  rangeStartDay: string;
  rangeEndDay: string;
  period?: "daily" | "weekly" | "monthly" | string;
  clinicId?: string;
  driverId?: string;
  locationId?: string;
}

export interface AdminBooking {
  id: string;
  serviceId?: string;
  driverId?: string;
  clinicId?: string;
  timeSlotId?: string;
  paymethodId?: string;
  scheduledAt: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | string;
  createdAt?: string;
  driver?: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber?: string | null;
    licenseNo?: string | null;
    medicalStatus?: string | null;
  } | null;
  clinic?: {
    id: string;
    fullName: string;
    clinicGmcNumber?: string | null;
    location?: {
      id: string;
      locationName: string;
    } | null;
  } | null;
  timeSlot?: {
    id: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    duration?: number;
    status?: string;
  } | null;
  service?: {
    id: string;
    title: string;
    description?: string | null;
  } | null;
  method?: {
    id: string;
    type: string;
    isActive?: boolean;
  } | null;
  payment?: {
    id: string;
    status: string;
    amount: number;
  } | null;
  medicalRecord?: {
    id: string;
    result: string;
  } | null;
}

export interface AdminBookingListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
    confirmed: number;
    pending: number;
    cancelled: number;
  };
  data: AdminBooking[];
}

export interface AdminBookingCalendarResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: {
    total: number;
    bookingTotal: number;
    organizerRequestTotal: number;
    page: number;
    limit: number;
    period: string;
    rangeStartDay: string;
    rangeEndDay: string;
  };
  data: {
    events: AdminBookingCalendarEvent[];
  };
}

export interface AdminBookingCalendarEvent {
  type: "booking" | "organizerRequest" | string;
  id: string;
  title: string;
  start: string;
  status: string;
  clinicId?: string | null;
  driverId?: string;
  organizerId?: string;
  timeSlot?: {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
    status: string;
  } | null;
  payload?: {
    id?: string;
    scheduledAt?: string;
    createdAt?: string;
    companyName?: string;
    status?: string;
    driver?: {
      id: string;
      fullName: string;
      email?: string;
    } | null;
    organizer?: {
      id: string;
      fullName: string;
    } | null;
    service?: {
      id: string;
      title: string;
    } | null;
    clinic?: {
      id: string;
      fullName: string;
    } | null;
  };
}

const adminBookingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminBookings: builder.query<
      AdminBookingListResponse,
      AdminBookingListParams
    >({
      query: (params) => ({
        url: "/bookings",
        method: "GET",
        params,
      }),
      providesTags: ["bookings"],
    }),
    getAdminBookingsCalendar: builder.query<
      AdminBookingCalendarResponse,
      AdminBookingCalendarParams
    >({
      query: (params) => ({
        url: "/bookings/calendar",
        method: "GET",
        params,
      }),
      providesTags: ["bookings"],
    }),
  }),
});

export const { useGetAdminBookingsQuery, useGetAdminBookingsCalendarQuery } =
  adminBookingsApi;
