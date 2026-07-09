import baseApi from "@/redux/api/baseApi";
import type { PrivacyPolicyRecord } from "@/redux/service/privacy/privacyApi";

export interface PrivacyMutationResponse {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: PrivacyPolicyRecord;
}

const adminPrivacyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPrivacyPolicy: builder.mutation<
      PrivacyMutationResponse,
      { text: string }
    >({
      query: (body) => ({
        url: "/privacy",
        method: "POST",
        body,
      }),
      invalidatesTags: ["privacy"],
    }),
    updatePrivacyPolicy: builder.mutation<
      PrivacyMutationResponse,
      { id: string; text: string }
    >({
      query: ({ id, text }) => ({
        url: `/privacy/${id}`,
        method: "PUT",
        body: { text },
      }),
      invalidatesTags: ["privacy"],
    }),
  }),
});

export const {
  useCreatePrivacyPolicyMutation,
  useUpdatePrivacyPolicyMutation,
} = adminPrivacyApi;
