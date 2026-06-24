"use client";

import React, { useState } from "react";
import { Card } from "antd";
import { ChevronDown } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { bookingTrendsData } from "@/app/data/AdminDashboardData";

export default function BookingTrends() {
  const [timeframe, setTimeframe] = useState("yearly");

  return (
    <Card
      variant="borderless"
      className="shadow-[0_4px_20px_rgba(0,0,0,0.015)] border border-slate-100 rounded-3xl"
      styles={{ body: { padding: "24px" } }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-gray-900 font-poppins">
          Booking Trends
        </h2>
        <div className="relative">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="appearance-none border border-slate-200 rounded-xl pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-500 bg-slate-50 hover:bg-slate-100 cursor-pointer focus:outline-none"
          >
            <option value="yearly">yearly</option>
            <option value="monthly">monthly</option>
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={bookingTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00B2D6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#00B2D6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 11, fontWeight: 500 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 11, fontWeight: 500 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
              }}
            />
            <Area
              type="monotone"
              dataKey="bookings"
              stroke="#00B2D6"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorBookings)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
