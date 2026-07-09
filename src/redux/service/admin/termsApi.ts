import baseApi from "@/redux/api/baseApi";
import type { TermsRecord } from "@/redux/service/terms/termsApi";

export interface TermsMutationResponse {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: TermsRecord;
}

const adminTermsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTerms: builder.mutation<TermsMutationResponse, { text: string }>({
      query: (body) => ({
        url: "/terms",
        method: "POST",
        body,
      }),
      invalidatesTags: ["terms"],
    }),
    updateTerms: builder.mutation<
      TermsMutationResponse,
      { id: string; text: string }
    >({
      query: ({ id, text }) => ({
        url: `/terms/${id}`,
        method: "PUT",
        body: { text },
      }),
      invalidatesTags: ["terms"],
    }),
  }),
});

export const { useCreateTermsMutation, useUpdateTermsMutation } =
  adminTermsApi;
