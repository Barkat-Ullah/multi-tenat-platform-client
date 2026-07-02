import baseApi from "@/redux/api/baseApi";

export interface ClinicTimeSlot {
  id: string;
  availabilityId?: string;
  clinicId?: string;
  date: string;
  duration?: number;
  startTime: string;
  endTime: string;
  capacity?: number;
  booked?: number;
  isBooked?: boolean;
  status: "Active" | "Inactive" | string;
}

export interface ClinicAvailability {
  id: string;
  clinicId?: string;
  slotDate: string;
  isActive?: boolean;
  timeSlots?: ClinicTimeSlot[];
}

export interface ClinicTimeSlotResponse {
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

export interface CreateClinicScheduleRequest {
  slotDate: string;
  startTime: string;
  endTime: string;
}

const clinicScheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClinicTimeSlotsByMonth: builder.query<ClinicTimeSlotResponse, string>({
      query: (month) => ({
        url: "/timeslots/month",
        method: "GET",
        params: { month },
      }),
      providesTags: ["timeslots"],
    }),
    createClinicSchedule: builder.mutation<
      ClinicTimeSlotResponse,
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
  useGetClinicTimeSlotsByMonthQuery,
  useCreateClinicScheduleMutation,
} = clinicScheduleApi;
