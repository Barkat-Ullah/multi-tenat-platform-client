import baseApi from "@/redux/api/baseApi";

export interface AdminFaq {
  id: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminFaqMutationRequest {
  title: string;
  description: string;
}

export interface AdminFaqMutationResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: AdminFaq;
}

const adminFaqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminFaqs: builder.query<AdminFaq[], void>({
      query: () => ({
        url: "/faq",
        method: "GET",
      }),
      providesTags: ["faqs"],
    }),
    createAdminFaq: builder.mutation<
      AdminFaqMutationResponse,
      AdminFaqMutationRequest
    >({
      query: (body) => ({
        url: "/faq",
        method: "POST",
        body,
      }),
      invalidatesTags: ["faqs"],
    }),
    updateAdminFaq: builder.mutation<
      AdminFaqMutationResponse,
      { id: string; body: AdminFaqMutationRequest }
    >({
      query: ({ id, body }) => ({
        url: `/faq/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["faqs"],
    }),
  }),
});

export const {
  useGetAdminFaqsQuery,
  useCreateAdminFaqMutation,
  useUpdateAdminFaqMutation,
} = adminFaqApi;
