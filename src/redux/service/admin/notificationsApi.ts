import baseApi from "@/redux/api/baseApi";

export interface AdminNotificationListParams {
  page: number;
  limit: number;
}

export interface AdminNotification {
  id?: string;
  _id?: string;
  title?: string | null;
  message?: string | null;
  body?: string | null;
  description?: string | null;
  type?: string | null;
  location?: string | null;
  isRead?: boolean;
  read?: boolean;
  createdAt?: string;
  updatedAt?: string;
  data?: {
    title?: string | null;
    message?: string | null;
    location?: string | null;
    locationName?: string | null;
    clinicName?: string | null;
    serviceTitle?: string | null;
    [key: string]: unknown;
  } | null;
  [key: string]: unknown;
}

export interface AdminNotificationListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
  data: AdminNotification[];
}

export interface AdminNotificationResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AdminNotification;
}

const adminNotificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminNotifications: builder.query<
      AdminNotificationListResponse,
      AdminNotificationListParams
    >({
      query: (params) => ({
        url: "/notifications",
        method: "GET",
        params,
      }),
      providesTags: ["notifications"],
    }),
    getAdminNotification: builder.query<AdminNotificationResponse, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}`,
        method: "GET",
      }),
      providesTags: ["notifications"],
    }),
  }),
});

export const {
  useGetAdminNotificationsQuery,
  useLazyGetAdminNotificationQuery,
} = adminNotificationsApi;
