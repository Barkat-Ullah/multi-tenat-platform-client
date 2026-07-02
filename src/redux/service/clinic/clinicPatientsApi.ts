import baseApi from "@/redux/api/baseApi";

export interface ClinicPatientListParams {
  page: number;
  limit: number;
}

export interface ClinicPatientDriver {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  licenseNo?: string | null;
  medicalStatus?: string | null;
}

export interface ClinicPatientBooking {
  id: string;
  serviceId?: string;
  driverId?: string;
  clinicId?: string;
  timeSlotId?: string;
  paymethodId?: string;
  scheduledAt: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | string;
  createdAt?: string;
  driver?: ClinicPatientDriver | null;
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

export interface ClinicPatientListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: ClinicPatientBooking[];
}

const clinicPatientsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClinicPatients: builder.query<
      ClinicPatientListResponse,
      ClinicPatientListParams
    >({
      query: (params) => ({
        url: "/bookings/my",
        method: "GET",
        params,
      }),
      providesTags: ["bookings"],
    }),
  }),
});

export const { useGetClinicPatientsQuery } = clinicPatientsApi;
