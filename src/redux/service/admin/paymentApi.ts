import baseApi from "@/redux/api/baseApi";

// --- 1. Type Definitions based on your Postman Response ---

export interface PaymentProfile {
  name: string;
  phone: string | null;
  avatar: string | null;
  country: string | null;
  city: string | null;
}

export interface PaymentUser {
  id: string;
  role: string;
  profile: PaymentProfile;
}

export interface PaymentOperator {
  user: PaymentUser;
}

export interface SubscriptionPlan {
  id: string;
  plan: string;
  planName: string;
  name: string;
}

export interface PaymentSubscription {
  subscriptionPlan: SubscriptionPlan;
}

export interface PaymentData {
  id: string;
  operatorId: string;
  amount: number;
  currency: string;
  paymentDate: string;
  paymentStatus: string;
  operator: PaymentOperator;
  subscription: PaymentSubscription;
}

export interface PaymentPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaymentHistoryResponse {
  success: boolean;
  statusCode: number;
  message: string;
  pagination: PaymentPagination;
  data: PaymentData[];
}

// --- 2. The API Slice ---

const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminPayments: builder.query<
      PaymentHistoryResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: "/payment/admin",
        method: "GET",
        params, 
      }),
      providesTags: ["payments"],
    }),
    getAllPayments: builder.query<
      PaymentHistoryResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: "/payment/allf",
        method: "GET",
        params,
      }),
      providesTags: ["payments"],
    }),
    getPaymentById: builder.query<
      { success: boolean; statusCode: number; message: string; data: PaymentData },
      string
    >({
      query: (id) => ({
        url: `/payment/${id}`,
        method: "GET",
      }),
      providesTags: ["payments"],
    }),
  }),
});

export const {
  useGetAdminPaymentsQuery,
  useGetAllPaymentsQuery,
  useGetPaymentByIdQuery,
} = paymentApi;
