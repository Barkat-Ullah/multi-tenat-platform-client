import baseApi from "@/redux/api/baseApi";

export interface PrivacyPolicyRecord {
  id: string;
  text: string;
  createdAt?: string;
  updatedAt?: string;
}

const privacyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPrivacyPolicies: builder.query<PrivacyPolicyRecord | null, void>({
      query: () => ({
        url: "/privacy",
        method: "GET",
      }),
      transformResponse: (
        response: PrivacyPolicyRecord | PrivacyPolicyRecord[] | null,
      ) => (Array.isArray(response) ? response[0] || null : response),
      providesTags: ["privacy"],
    }),
  }),
});

export const { useGetPrivacyPoliciesQuery } = privacyApi;
