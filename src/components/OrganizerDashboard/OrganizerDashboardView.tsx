"use client";

import React, { useState, useEffect } from "react";
import { Users, Calendar, AlertCircle } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useGetCorporateAnalyticsQuery } from "@/redux/service/corporate/corporateDashboardApi";


// Custom Tooltip component to match the premium tooltip card style in the mockup
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 px-3.5 py-1.5 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex flex-col items-center">
        <span className="text-xs font-extrabold text-[#00B2D6]">
          {payload[0].value}
        </span>
      </div>
    );
  }
  return null;
};

export default function OrganizerDashboardView() {

    const { data, isLoading, isError, refetch } = useGetCorporateAnalyticsQuery();
    const overview = data?.data?.overview;
    console.log(overview);
  const [timeFilter, setTimeFilter] = useState("Yearly");
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by rendering Recharts only on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
        Overview
      </h1>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Drivers */}
        <div className="bg-white rounded-[24px] border border-slate-100/90 p-5 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex flex-col justify-between h-[130px] transition-all hover:scale-[1.01]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#EAF8FC] flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-[#00B2D6]" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-[#0F2E4A] font-poppins leading-tight">
              Total Drivers
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins pl-1">
            {overview?.totalDrivers}
          </span>
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-white rounded-[24px] border border-slate-100/90 p-5 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex flex-col justify-between h-[130px] transition-all hover:scale-[1.01]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#F2EFFF] flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5 text-[#7B62FF]" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-[#0F2E4A] font-poppins leading-tight">
              Upcoming Bookings
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins pl-1">
            {overview?.upcomingBookings}
          </span>
        </div>

        {/* Expiring Time */}
        <div className="bg-white rounded-[24px] border border-slate-100/90 p-5 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex flex-col justify-between h-[130px] transition-all hover:scale-[1.01]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFF1F0] flex items-center justify-center shrink-0">
              <AlertCircle className="h-5 w-5 text-[#FF4D4F]" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-[#0F2E4A] font-poppins leading-tight">
              Expiring Time
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 pl-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins">
              {overview?.expiringTimeMonths}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400">
              Month
            </span>
          </div>
        </div>
      </div>

      {/* Booking History Chart Card */}
      <div className="bg-white rounded-[24px] border border-slate-100/90 p-6 sm:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
        {/* Chart Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0F2E4A] text-sm sm:text-base font-extrabold font-poppins">
            Booking History
          </h2>
          {/* <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 bg-white outline-none cursor-pointer hover:border-slate-300 transition-colors"
          >
            <option value="Yearly">Yearly</option>
            <option value="Monthly">Monthly</option>
            <option value="Weekly">Weekly</option>
          </select> */}
        </div>

        {/* Responsive Recharts Line Chart */}
        <div className="w-full h-[320px]">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data?.data?.bookingHistory}
                margin={{ top: 20, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={true}
                  horizontal={true}
                  stroke="#F1F5F9"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#64748B",
                    fontSize: 11,
                    fontWeight: "bold",
                    fontFamily: "sans-serif",
                  }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#94A3B8",
                    fontSize: 11,
                    fontWeight: "bold",
                    fontFamily: "sans-serif",
                  }}
                  domain={[0, 500]}
                  ticks={[0, 100, 200, 300, 400, 500]}
                  dx={-10}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: "#E2E8F0", strokeWidth: 1, strokeDasharray: "4 4" }}
                />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#00B2D6"
                  strokeWidth={2.5}
                  strokeDasharray="6 6"
                  dot={{
                    stroke: "#00B2D6",
                    strokeWidth: 1.5,
                    r: 3.5,
                    fill: "#FFFFFF",
                  }}
                  activeDot={{
                    stroke: "#FFFFFF",
                    strokeWidth: 2,
                    r: 5.5,
                    fill: "#00B2D6",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full bg-slate-50/50 rounded-2xl animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
}
