import baseApi from "@/redux/api/baseApi";

export interface NotificationListParams {
  page: number;
  limit: number;
}

export interface AppNotification {
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

export interface NotificationListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
  data: AppNotification[];
}

export interface NotificationResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AppNotification;
}

const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      NotificationListResponse,
      NotificationListParams
    >({
      query: (params) => ({
        url: "/notifications",
        method: "GET",
        params,
      }),
      providesTags: ["notifications"],
    }),
    getNotification: builder.query<NotificationResponse, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}`,
        method: "GET",
      }),
      providesTags: ["notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useLazyGetNotificationQuery,
} = notificationsApi;
