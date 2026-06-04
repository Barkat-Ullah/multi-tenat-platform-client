// src/redux/service/subscription/checkout.ts
import baseApi from "@/redux/api/baseApi";

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
    status: string; // e.g. "unpaid"
  };
}

const checkoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation<
      CheckoutSessionResponse,
      CheckoutSessionRequest
    >({
      query: (body) => ({
        url: "/subscription/checkout-session",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useCreateCheckoutSessionMutation } = checkoutApi;
