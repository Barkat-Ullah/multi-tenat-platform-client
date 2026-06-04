// src/redux/api/endpoints/adminEndpoints.ts (recommended new file)

import baseApi from "@/redux/api/baseApi";

// Admin Statistics Data Interface
export interface AdminStatisticsData {
  customerCount: number;
  agencyCount: number;
  investorCount: number;
  propertyCount: number;
  subscriptionCount: number;
  totalIncome: number;
}

// Admin Statistics Response Interface
export interface AdminStatisticsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AdminStatisticsData;
}


// ===== Agency sell Breakdown item =====
export interface AgencySellStatisticBreakdown {
  type:
  | "RESIDENTIAL"
  | "BUILDINGS"
  | "FLAT"
  | "SHOPS"
  | "GARAGE"
  | "OFFICES"
  | "LAND"
  | "WAREHOUSES"
  | "OTHERS"
  | "COMMERCIAL"
  | "HOSPITALITY"
  | string;

  total: number;
  sell: number;
  rent: number;
}

// ===== Data wrapper =====
export interface AgencySellStatisticsData {
  totalProperties: number;
  breakdown: AgencySellStatisticBreakdown[];
}

// ===== API response =====
export interface AgencySellStatisticsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AgencySellStatisticsData;
}



// Create API slice
const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Use query for GET
    getAdminStatistics: builder.query<AdminStatisticsResponse, void>({
      query: () => ({
        url: "/admin/statistics",
        method: "GET",
        // No body for GET
      }),
      providesTags: ["dashboard"], // Fixed typo
    }),


    getAgencySellStatistics: builder.query<AgencySellStatisticsResponse, void>({
      query: () => ({
        url: "/agency/sellStatistics",
        method: "GET",
        // No body for GET
      }),
      providesTags: ["dashboard"], // Fixed typo
    }),


  }),


});

export const { useGetAdminStatisticsQuery, useGetAgencySellStatisticsQuery } = adminApi;

