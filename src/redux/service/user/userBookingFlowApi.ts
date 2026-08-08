import baseApi from "@/redux/api/baseApi";

export interface BookingService {
  id: string;
  title: string;
  description?: string | null;
  files?: string | null;
  isDeleted?: boolean;
  createdAt?: string;
}

export interface BookingClinicLocation {
  id: string;
  locationName: string;
  lat: number;
  lng: number;
}

export interface BookingServiceClinic {
  id: string;
  fullName: string;
  email?: string | null;
  phoneNumber?: string | null;
  status?: string;
  clinicGmcNumber?: string | null;
  isParking?: boolean;
  location?: BookingClinicLocation | null;
}

export interface BookingServiceDetails extends BookingService {
  clinics: BookingServiceClinic[];
}

export interface BookingServicesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
  data: BookingService[];
}

export interface BookingServiceDetailsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: BookingServiceDetails;
}

export interface BookingSlot {
  id: string;
  startTime: string;
  endTime: string;
  capacity: number;
  booked: number;
  isBooked: boolean;
  status: string;
}

export interface BookingSlotsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    date: string;
    serviceId: string;
    clinicId: string;
    isAvailable: boolean;
    totalSlots: number;
    slots: BookingSlot[];
  };
}

export interface BookingSlotsParams {
  serviceId: string;
  clinicId: string;
  date: string;
}

export interface CreateDriverBookingRequest {
  clinicId: string;
  serviceId: string;
  timeSlotId: string;
  scheduledAt: string;
  paymentType: string;
  price: number;
}

export interface DriverBooking {
  id: string;
  serviceId: string;
  driverId: string;
  clinicId: string;
  timeSlotId: string;
  paymethodId?: string | null;
  scheduledAt: string;
  status: string;
  createdAt: string;
  driver?: {
    id: string;
    fullName?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    licenseNo?: string | null;
    medicalStatus?: string | null;
  };
  clinic?: {
    id: string;
    fullName?: string | null;
    clinicGmcNumber?: string | null;
    location?: {
      id: string;
      locationName?: string | null;
    } | null;
  };
  timeSlot?: {
    id: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    duration?: number;
    status?: string;
  };
  service?: {
    id: string;
    title?: string | null;
    description?: string | null;
  };
  method?: {
    id: string;
    type?: string | null;
    isActive?: boolean;
  } | null;
  payment?: {
    id: string;
    status?: string | null;
    amount?: number;
  } | null;
  medicalRecord?: unknown;
}

export interface CreateDriverBookingResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    booking: DriverBooking;
    payment: {
      id: string;
      amount: number;
      status: string;
      paymentType: string;
    } | null;
    paymentUrl?: string;
  };
}

export interface VerifyStripePaymentData {
  status: "success" | "pending";
  message?: string;
  bookingId?: string;
  booking?: DriverBooking;
}

export interface VerifyStripePaymentResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: VerifyStripePaymentData;
}

const userBookingFlowApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookingServices: builder.query<
      BookingServicesResponse,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/services",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["services"],
    }),
    getBookingServiceDetails: builder.query<
      BookingServiceDetailsResponse,
      string
    >({
      query: (id) => ({
        url: `/services/${id}`,
        method: "GET",
      }),
      providesTags: ["services"],
    }),
    getBookingSlots: builder.query<BookingSlotsResponse, BookingSlotsParams>({
      query: (params) => ({
        url: "/timeslots/slots",
        method: "GET",
        params,
      }),
      providesTags: ["timeslots"],
    }),
    getDriverBookingDetails: builder.query<
      {
        success: boolean;
        statusCode: number;
        message: string;
        data: DriverBooking;
      },
      string
    >({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: "GET",
      }),
      providesTags: ["bookings"],
    }),
    createDriverBooking: builder.mutation<
      CreateDriverBookingResponse,
      CreateDriverBookingRequest
    >({
      query: (body) => ({
        url: "/bookings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["bookings", "timeslots", "dashboard"],
    }),

    verifyStripePayment: builder.query<VerifyStripePaymentResponse, string>({
      query: (sessionId) => ({
        url: "/bookings/payment/verify-stripe",
        method: "GET",
        params: { sessionId },
      }),
     
      providesTags: (result) =>
        result?.data?.bookingId
          ? [{ type: "bookings" as const, id: result.data.bookingId }]
          : ["bookings"],
    }),
  }),
});

export const {
  useGetBookingServicesQuery,
  useGetBookingServiceDetailsQuery,
  useGetBookingSlotsQuery,
  useLazyGetBookingSlotsQuery,
  useGetDriverBookingDetailsQuery,
  useCreateDriverBookingMutation,
  useVerifyStripePaymentQuery,
} = userBookingFlowApi;
