/* eslint-disable @typescript-eslint/no-explicit-any */

import baseApi from "@/redux/api/baseApi";

// ===== SUBSCRIPTION PLAN (nested inside subscription) =====
export interface SubscriptionPlan {
  id: string;
  plan: "THREE_MONTH" | "SIX_MONTH" | "ONE_YEAR";
  planName: "QUARTER" | "SEMI_ANNUAL" | "ANNUAL";
  name: string;
  description: string;
  features: string[];
  price: number;
  status: "ACTIVE" | "INACTIVE";
  stripePriceId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ===== USER SUBSCRIPTION (top-level item) =====
export interface UserSubscription {
  id: string;
  operatorId: string;
  subscriptionPlanId: string;
  subscriptionStatus: "ACTIVE" | "INACTIVE" | "CANCELLED" | "PAST_DUE" | "PENDING" | string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  expiresAt: string; // ISO date
  createdAt: string;
  cancelRequest: boolean;
  subscriptionPlan: SubscriptionPlan; // 👈 nested plan
  operator?: {
    user: {
      email: string;
      role: string;
      profile: { name: string; avatar?: string | null };
    };
  };
  payments?: {
    amount: number;
    currency: string;
    paymentDate: string;
    paymentStatus: string;
  }[];
}

// ===== CHECKOUT SESSION =====
export interface CheckoutSessionRequest {
  subscriptionPlanId: string;
}

export interface CheckoutSessionResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    sessionId: string;
    url: string;
    status: string;
  };
}

// ===== UPDATE SUBSCRIPTION PLAN REQUEST =====
export interface UpdateSubscriptionPlanRequest {
  subscriptionPlanId: string;
}

// ===== RESPONSE FOR /subscription/all =====
export interface SubscriptionsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: UserSubscription[]; // 👈 array of user subscriptions
}

export type SubscriptionItem = {
  id: string;
  operatorId: string;
  subscriptionPlanId: string;
  subscriptionStatus: "ACTIVE" | "INACTIVE" | "CANCELED" | string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  expiresAt: string;
  createdAt: string;
  cancelRequest: boolean;
  subscriptionPlan: SubscriptionPlan;
};

export type SubscriptionResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: SubscriptionItem[];
};

// ===== API SLICE =====
const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getSubscriptions: builder.query<
      SubscriptionsResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
      }
    >({
      query: (params) => ({
        url: `/subscription/all`,
        method: "GET",
        params: params,
      }),
      providesTags: ["subscription"],
    }),

    getSubscription: builder.query<SubscriptionsResponse, void>({
      query: () => ({
        url: "/subscription",
        method: "GET",
      }),
      providesTags: ["subscription"],
    }),

    checkoutSession: builder.mutation<CheckoutSessionResponse, CheckoutSessionRequest>({
      query: (body) => ({
        url: "/subscription/checkout-session",
        method: "POST",
        body,
      }),
      invalidatesTags: ["subscription"],
    }),

    cancelSubscription: builder.mutation<any, string>({
      query: (id) => ({
        url: `/subscription/cancel/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["subscription"],
    }),

    updateSubscription: builder.mutation<
      any,
      { id: string; subscriptionPlanId: string }
    >({
      query: ({ id, subscriptionPlanId }) => ({
        url: `/subscription/update/${id}`,
        method: "PATCH",
        body: { subscriptionPlanId },
      }),
      invalidatesTags: ["subscription"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetSubscriptionsQuery,
  useGetSubscriptionQuery,
  useCheckoutSessionMutation,
  useCancelSubscriptionMutation,
  useUpdateSubscriptionMutation,
} = subscriptionApi;
