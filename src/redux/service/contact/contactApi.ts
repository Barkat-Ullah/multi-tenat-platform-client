/* eslint-disable @typescript-eslint/no-explicit-any */
// src/redux/api/endpoints/profileEndpoints.ts
import baseApi from "@/redux/api/baseApi";



// Profile Data Interface
export interface ContactData {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

// Profile Response Interface
interface ContactResponse {
  success: boolean;
  message: string;
  data: ContactData;
  error: any;
  timestamp: string;
}

export interface ContactsPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AllContactsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  pagination: ContactsPagination;
  data: ContactData[];
}

const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all contacts
    getAllContacts: builder.query<
      AllContactsResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: "/contact-us",
        method: "GET",
        params,
      }),
      providesTags: ["contact"],
    }),

    // Delete contact
    deleteContact: builder.mutation<any, string>({
      query: (id) => ({
        url: `/contact-us/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["contact"],
    }),
    // Get profile data
    createContact: builder.mutation<ContactResponse, Partial<ContactData>>({
      query: (data) => ({
        url: "/contact-us",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["contact"],
    }),
  }),
});

export const {
  useGetAllContactsQuery,
  useCreateContactMutation,
  useDeleteContactMutation,
} = contactApi;

export const { endpoints: profileApiEndpoints } = contactApi;

// Export types for use in components
export type { ContactResponse as ProfileResponse, ContactData as ProfileData };
