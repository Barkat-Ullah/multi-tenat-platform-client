import baseApi from "@/redux/api/baseApi";

export interface PaymentMethodType {
  id: string;
  type: "Stripe" | "Paypal" | string;
  isActive: boolean;
  createdAt?: string;
}

export interface PaymentMethodsResponse {
  success: boolean;
  message: string;
  data: PaymentMethodType[];
}

export interface PaymentMethodMutationResponse {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: PaymentMethodType;
}

const paymentMethodsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentMethods: builder.query<PaymentMethodsResponse, void>({
      query: () => ({
        url: "/method",
        method: "GET",
      }),
      providesTags: ["payments"],
    }),
    updatePaymentMethod: builder.mutation<
      PaymentMethodMutationResponse,
      string
    >({
      query: (id) => ({
        url: `/method/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["payments"],
    }),
  }),
});

export const {
  useGetPaymentMethodsQuery,
  useUpdatePaymentMethodMutation,
} = paymentMethodsApi;
