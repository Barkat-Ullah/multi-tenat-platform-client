import baseApi from "@/redux/api/baseApi";

export interface PublicFaq {
  id: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFaqs: builder.query<PublicFaq[], void>({
      query: () => ({
        url: "/faq",
        method: "GET",
      }),
      providesTags: ["faqs"],
    }),
  }),
});

export const { useGetFaqsQuery } = faqApi;
