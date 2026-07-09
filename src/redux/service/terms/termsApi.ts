import baseApi from "@/redux/api/baseApi";

export interface TermsRecord {
  id: string;
  text: string;
  createdAt?: string;
  updatedAt?: string;
}

const termsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTerms: builder.query<TermsRecord | null, void>({
      query: () => ({
        url: "/terms",
        method: "GET",
      }),
      transformResponse: (response: TermsRecord | TermsRecord[] | null) =>
        Array.isArray(response) ? response[0] || null : response,
      providesTags: ["terms"],
    }),
  }),
});

export const { useGetTermsQuery } = termsApi;
