import baseApi from "@/redux/api/baseApi";

export type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "PENDING_CUSTOMER"
  | "RESOLVED"
  | "CLOSED"
  | "REOPENED";

export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TicketCategory =
  | "BOOKING_ISSUE"
  | "PAYMENT_ISSUE"
  | "MEDICAL_RECORD_ISSUE"
  | "ACCOUNT_ISSUE"
  | "CLINIC_ISSUE"
  | "TECHNICAL_ISSUE"
  | "OTHER";

export interface SupportTicketListParams {
  page?: number;
  limit?: number;
}

export interface SupportTicketUser {
  id?: string;
  _id?: string;
  fullName?: string | null;
  name?: string | null;
  email?: string | null;
  role?: string | null;
}

export interface SupportTicketMessage {
  id?: string;
  _id?: string;
  ticketId?: string;
  message?: string | null;
  text?: string | null;
  description?: string | null;
  files?: SupportTicketAttachment | SupportTicketAttachment[] | null;
  attachments?: SupportTicketAttachment | SupportTicketAttachment[] | null;
  isInternalNote?: boolean;
  sender?: SupportTicketUser | null;
  user?: SupportTicketUser | null;
  createdBy?: SupportTicketUser | null;
  senderId?: string | null;
  userId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SupportTicketAttachment {
  url?: string | null;
  fileUrl?: string | null;
  secureUrl?: string | null;
  path?: string | null;
  name?: string | null;
  fileName?: string | null;
  originalName?: string | null;
  mimetype?: string | null;
  mimeType?: string | null;
}

export interface SupportTicket {
  id?: string;
  _id?: string;
  ticketNo?: string | null;
  ticketNumber?: string | null;
  code?: string | null;
  subject?: string | null;
  title?: string | null;
  description?: string | null;
  category?: TicketCategory | string | null;
  priority?: TicketPriority | string | null;
  status?: TicketStatus | string | null;
  relatedBookingId?: string | null;
  createdById?: string | null;
  userId?: string | null;
  assignedToId?: string | null;
  createdBy?: SupportTicketUser | null;
  user?: SupportTicketUser | null;
  requester?: SupportTicketUser | null;
  assignedTo?: SupportTicketUser | null;
  assignee?: SupportTicketUser | null;
  messages?: SupportTicketMessage[];
  ticketMessages?: SupportTicketMessage[];
  _count?: {
    messages?: number;
  };
  firstResponseAt?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  satisfactionRating?: number | null;
  satisfactionFeedback?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SupportTicketsMeta {
  total?: number;
  page?: number;
  limit?: number;
  totalPage?: number;
  totalPages?: number;
}

export interface SupportTicketListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: SupportTicketsMeta;
  data: SupportTicket[];
}

export interface SupportTicketDetailsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: SupportTicket;
}

export interface SupportTicketAnalytics {
  period?: string;
  dateRange?: {
    rangeStart?: string;
    rangeEnd?: string;
  };
  statusDistribution?: Record<string, number>;
  categoryDistribution?: Record<string, number>;
  priorityDistribution?: Record<string, number>;
  avgResolutionTimeHours?: number;
  avgCSAT?: number;
  total?: number;
  totalTicket?: number;
  totalTickets?: number;
  totalSupportTicket?: number;
  pending?: number;
  pendingTicket?: number;
  pendingSupportTicket?: number;
  resolved?: number;
  resolvedTicket?: number;
  unassigned?: number;
  unassignedTicket?: number;
  open?: number;
  inProgress?: number;
  in_progress?: number;
}

export interface SupportTicketAnalyticsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: SupportTicketAnalytics;
}

export interface CreateSupportTicketPayload {
  subject: string;
  description: string;
  category?: TicketCategory;
  priority?: TicketPriority;
  relatedBookingId?: string;
  createdById?: string;
}

export interface UpdateSupportTicketStatusPayload {
  id: string;
  status: TicketStatus;
  note?: string;
}

export interface CreateSupportTicketMessagePayload {
  id: string;
  message: string;
  files?: File[];
}

const supportTicketsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSupportTicketAnalytics: builder.query<SupportTicketAnalyticsResponse, void>({
      query: () => ({
        url: "/tickets/analytics",
        method: "GET",
      }),
      providesTags: ["tickets"],
    }),

    getSupportTickets: builder.query<SupportTicketListResponse, SupportTicketListParams | void>({
      query: (params) => ({
        url: "/tickets",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 15,
        },
      }),
      providesTags: ["tickets"],
    }),

    getSupportTicket: builder.query<SupportTicketDetailsResponse, string>({
      query: (id) => ({
        url: `/tickets/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "tickets", id }],
    }),

    createSupportTicket: builder.mutation<SupportTicketDetailsResponse, CreateSupportTicketPayload>({
      query: (body) => ({
        url: "/tickets",
        method: "POST",
        body,
      }),
      invalidatesTags: ["tickets"],
    }),

    updateSupportTicketStatus: builder.mutation<
      SupportTicketDetailsResponse,
      UpdateSupportTicketStatusPayload
    >({
      query: ({ id, ...body }) => ({
        url: `/tickets/${id}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => ["tickets", { type: "tickets", id }],
    }),

    createSupportTicketMessage: builder.mutation<
      SupportTicketDetailsResponse,
      CreateSupportTicketMessagePayload
    >({
      query: ({ id, message, files }) => {
        const body = new FormData();
        body.append("data", JSON.stringify({ message }));
        files?.forEach((file) => body.append("files", file));

        return {
          url: `/tickets/${id}/messages`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: (_result, _error, { id }) => ["tickets", { type: "tickets", id }],
    }),
  }),
});

export const {
  useGetSupportTicketAnalyticsQuery,
  useGetSupportTicketsQuery,
  useGetSupportTicketQuery,
  useCreateSupportTicketMutation,
  useUpdateSupportTicketStatusMutation,
  useCreateSupportTicketMessageMutation,
} = supportTicketsApi;
