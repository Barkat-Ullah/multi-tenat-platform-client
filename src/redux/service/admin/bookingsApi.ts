import baseApi from "@/redux/api/baseApi";

export interface AdminBookingListParams {
  page: number;
  limit: number;
  createdAt?: string;
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
  }),
});

export const { useGetAdminBookingsQuery } = adminBookingsApi;
