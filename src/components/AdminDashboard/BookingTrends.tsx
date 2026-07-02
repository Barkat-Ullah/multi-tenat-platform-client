"use client";

import React from "react";
import { Card } from "antd";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AdminAnalyticsTrend } from "@/redux/service/admin/dashboardApi";

interface BookingTrendsProps {
  data: AdminAnalyticsTrend[];
  isLoading: boolean;
}

export default function BookingTrends({
  data,
  isLoading,
}: BookingTrendsProps) {
  return (
    <Card
      variant="borderless"
      className="rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.015)]"
      styles={{ body: { padding: "24px" } }}
    >
      <div className="mb-6">
        <h2 className="font-poppins text-base font-bold text-gray-900">
          Booking Trends
        </h2>
      </div>

      <div className="h-[300px] w-full">
        {isLoading ? (
          <div
            className="relative h-full animate-pulse overflow-hidden rounded-xl"
            role="status"
            aria-label="Loading booking trends"
          >
            <div className="absolute bottom-7 left-8 right-2 top-2 border-b border-l border-slate-200">
              <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-slate-100" />
              <div className="absolute inset-x-0 top-2/4 border-t border-dashed border-slate-100" />
              <div className="absolute inset-x-0 top-3/4 border-t border-dashed border-slate-100" />
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <path
                  d="M0 82 C8 76, 12 64, 20 68 S32 46, 40 53 S52 28, 60 38 S72 20, 80 32 S92 16, 100 22 L100 100 L0 100 Z"
                  fill="#f1f5f9"
                />
                <path
                  d="M0 82 C8 76, 12 64, 20 68 S32 46, 40 53 S52 28, 60 38 S72 20, 80 32 S92 16, 100 22"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d="M0 90 C10 86, 14 78, 22 80 S34 66, 42 70 S54 50, 62 58 S74 44, 82 49 S94 36, 100 40"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
            <div className="absolute bottom-1 left-10 right-2 flex justify-between">
              {Array.from({ length: 8 }, (_, index) => (
                <span key={index} className="h-1.5 w-5 rounded-full bg-slate-100" />
              ))}
            </div>
            <span className="sr-only">Loading booking trends...</span>
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-400">
            No trend data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="adminBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00B2D6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00B2D6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="adminRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 11, fontWeight: 500 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 11, fontWeight: 500 }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }} />
              <Legend wrapperStyle={{ fontSize: "11px", fontWeight: 600 }} />
              <Area type="monotone" dataKey="bookings" name="Bookings" stroke="#00B2D6" strokeWidth={2.5} fill="url(#adminBookings)" />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10B981" strokeWidth={2} fill="url(#adminRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
