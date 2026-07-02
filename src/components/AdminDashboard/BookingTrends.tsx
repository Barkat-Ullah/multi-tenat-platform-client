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
          <div className="relative h-full animate-pulse overflow-hidden rounded-xl border-b border-l border-slate-100">
            <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-slate-100" />
            <div className="absolute inset-x-0 top-2/4 border-t border-dashed border-slate-100" />
            <div className="absolute inset-x-0 top-3/4 border-t border-dashed border-slate-100" />
            <div className="absolute bottom-0 left-[5%] h-[28%] w-[7%] rounded-t bg-slate-100" />
            <div className="absolute bottom-0 left-[18%] h-[42%] w-[7%] rounded-t bg-slate-200" />
            <div className="absolute bottom-0 left-[31%] h-[34%] w-[7%] rounded-t bg-slate-100" />
            <div className="absolute bottom-0 left-[44%] h-[58%] w-[7%] rounded-t bg-slate-200" />
            <div className="absolute bottom-0 left-[57%] h-[48%] w-[7%] rounded-t bg-slate-100" />
            <div className="absolute bottom-0 left-[70%] h-[66%] w-[7%] rounded-t bg-slate-200" />
            <div className="absolute bottom-0 left-[83%] h-[38%] w-[7%] rounded-t bg-slate-100" />
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
