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
  slotDate: string;
  startTime: string;
  endTime: string;
}

const clinicScheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClinicAvailabilityByMonth: builder.query<
      ClinicMonthlyAvailabilityResponse,
      string
    >({
      query: (month) => ({
        url: "/timeslots/month",
        method: "GET",
        params: { month },
      }),
      providesTags: ["timeslots"],
    }),
    getClinicTimeSlots: builder.query<ClinicTimeSlotListResponse, void>({
      query: () => ({
        url: "/timeslots/my",
        method: "GET",
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
