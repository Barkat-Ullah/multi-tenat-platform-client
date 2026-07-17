import baseApi from "@/redux/api/baseApi";

export interface ClinicTimeSlot {
  id: string;
  availabilityId?: string;
  clinicId?: string;
  date?: string;
  duration?: number;
  startTime: string;
  endTime: string;
  capacity?: number;
  booked?: number;
  isBooked?: boolean;
  availabilityIsActive?: boolean;
  status: "Active" | "Inactive" | string;
}

export interface ClinicAvailability {
  id: string;
  clinicId?: string;
  slotDate: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  timeSlots?: ClinicTimeSlot[];
}

export interface ClinicTimeSlotListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data:
    | ClinicTimeSlot[]
    | ClinicAvailability[]
    | {
        timeSlots?: ClinicTimeSlot[];
        slots?: ClinicTimeSlot[];
      };
}

export interface ClinicMonthlyDay {
  date: string;
  isActive: boolean;
  status: "available" | "unavailable" | string;
}

export interface ClinicMonthlyAvailabilityResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    month: string;
    offDays: string[];
    daysInMonth: number;
    data: ClinicMonthlyDay[];
  };
}

export interface CreateClinicScheduleRequest {
  clinicId?: string;
  slotDate: string;
  startTime: string;
  endTime: string;
}

export interface ClinicMonthlyAvailabilityParams {
  month: string;
  clinicId?: string;
}

export interface ClinicTimeSlotListParams {
  clinicId?: string;
}

const clinicScheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClinicAvailabilityByMonth: builder.query<
      ClinicMonthlyAvailabilityResponse,
      ClinicMonthlyAvailabilityParams
    >({
      query: ({ month, clinicId }) => ({
        url: "/timeslots/month",
        method: "GET",
        params: { month, clinicId },
      }),
      providesTags: ["timeslots"],
    }),
    getClinicTimeSlots: builder.query<
      ClinicTimeSlotListResponse,
      ClinicTimeSlotListParams | void
    >({
      query: (params) => ({
        url: "/timeslots/my",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["timeslots"],
    }),
    createClinicSchedule: builder.mutation<
      ClinicTimeSlotListResponse,
      CreateClinicScheduleRequest
    >({
      query: (body) => ({
        url: "/timeslots",
        method: "POST",
        body,
      }),
      invalidatesTags: ["timeslots"],
    }),
  }),
});

export const {
  useGetClinicAvailabilityByMonthQuery,
  useGetClinicTimeSlotsQuery,
  useCreateClinicScheduleMutation,
} = clinicScheduleApi;
