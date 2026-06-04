import baseApi from "@/redux/api/baseApi";

// ===== SUBSCRIPTION PLAN =====
export interface SubscriptionPlan {
  id: string;
  plan: "THREE_MONTH" | "SIX_MONTH" | "ONE_YEAR"; // backend codes
  planName: "QUARTER" | "SEMI_ANNUAL" | "ANNUAL"; // human-readable
  name: string; // display name, e.g., "Pro Plus"
  description: string;
  features: string[];

  price: number;
  status: "ACTIVE" | "INACTIVE"; // plan status
  stripePriceId?: string; // optional, only present if integrated with Stripe
  success?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ===== RESPONSE =====
export interface SubscriptionPlansResponse {
  success: boolean;
  statusCode: number;
  message: string;
  pagination?: {
    // optional
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: SubscriptionPlan[];
}

// Query Params for listing plans
export interface SubscriptionPlanParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: "oldest" | "priceLowHigh" | "priceHighLow" | "name";
  status?: "ACTIVE" | "INACTIVE" | "all";
  plan?: string;
  planName?: string;
}

// ===== API slice =====
const subscriptionPlanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all subscription plans
    getSubscriptionPlans: builder.query<SubscriptionPlansResponse, SubscriptionPlanParams | void>({
      query: (params) => ({
        url: `/subscription-plan?status=all`,
        params: params || {},
      }),
      providesTags: ["subscriptionPlans"],
    }),

    // Create a new subscription plan
    createSubscriptionPlan: builder.mutation<
      { success: boolean; message: string; data: SubscriptionPlan },
      Partial<Omit<SubscriptionPlan, "id" | "stripePriceId">>
    >({
      query: (newPlan) => ({
        url: `/subscription-plan`,
        method: "POST",
        body: newPlan,
      }),
      invalidatesTags: ["subscriptionPlans"],
    }),

    // Update an existing subscription plan
    updateSubscriptionPlan: builder.mutation<
      { success: boolean; message: string; data: SubscriptionPlan },
      { id: string; updatedPlan: Partial<Omit<SubscriptionPlan, "id" | "stripePriceId">> }
    >({
      query: ({ id, updatedPlan }) => ({
        url: `/subscription-plan/${id}`,
        method: "PATCH",
        body: updatedPlan,
      }),
      invalidatesTags: ["subscriptionPlans"],
    }),

    // Update subscription plan status only
    updateSubsceiptionPlanStatus: builder.mutation<
      { success: boolean; message: string; data: Partial<SubscriptionPlan> },
      { id: string; status: "ACTIVE" | "INACTIVE" }
    >({
      query: ({ id, status }) => ({
        url: `/subscription-plan/${id}/${status}`,
        method: "PATCH",
      }),
      invalidatesTags: ["subscriptionPlans"],
    }),

    // Get a single subscription plan by ID
    getSingleSubscriptionPlan: builder.query<{ success: boolean; data: SubscriptionPlan }, string>({
      query: (id) => ({
        url: `/subscription-plan/${id}`,
        method: "GET",
      }),
      providesTags: ["subscriptionPlans"],
    }),

    // DELETE/:id
    deleteSubscriptionPlan: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/subscription-plan/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["subscriptionPlans"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetSubscriptionPlansQuery,
  useCreateSubscriptionPlanMutation,
  useUpdateSubscriptionPlanMutation,
  useUpdateSubsceiptionPlanStatusMutation,
  useGetSingleSubscriptionPlanQuery,
  useDeleteSubscriptionPlanMutation,
} = subscriptionPlanApi;
