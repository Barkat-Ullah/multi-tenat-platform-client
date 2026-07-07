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

// ── Skeleton primitives ───────────────────────────────────────────────────────

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-slate-200 rounded-xl animate-pulse ${className}`} />
  );
}

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-[24px] border border-slate-100/90 p-5 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex flex-col justify-between h-[130px]">
      <div className="flex items-center gap-3.5">
        <SkeletonBlock className="w-10 h-10 rounded-xl shrink-0" />
        <SkeletonBlock className="h-3.5 w-32" />
      </div>
      <SkeletonBlock className="h-8 w-20 ml-1" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="w-full h-[320px] flex flex-col justify-between py-2">
      {/* Horizontal grid lines with y-axis label stubs */}
      {[500, 400, 300, 200, 100, 0].map((tick) => (
        <div key={tick} className="flex items-center gap-3">
          <SkeletonBlock className="w-6 h-2.5 shrink-0" />
          <div className="flex-1 h-px bg-slate-100" />
        </div>
      ))}
      {/* X-axis label stubs */}
      <div className="flex justify-between mt-1 pl-9">
        {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => (
          <SkeletonBlock key={m} className="h-2.5 w-5" />
        ))}
      </div>
    </div>
  );
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────

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

// ── Main Component ────────────────────────────────────────────────────────────

export default function OrganizerDashboardView() {
  const { data, isLoading } = useGetCorporateAnalyticsQuery();
  const overview = data?.data?.overview;

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
        Overview
      </h1>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
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
                {overview?.totalDrivers ?? "—"}
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
                {overview?.upcomingBookings ?? "—"}
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
                  {overview?.expiringTimeMonths ?? "—"}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-400">Month</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Booking History Chart Card */}
      <div className="bg-white rounded-[24px] border border-slate-100/90 p-6 sm:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
        {/* Chart Header */}
        <div className="flex items-center justify-between mb-6">
          {isLoading ? (
            <SkeletonBlock className="h-5 w-36" />
          ) : (
            <h2 className="text-[#0F2E4A] text-sm sm:text-base font-extrabold font-poppins">
              Booking History
            </h2>
          )}
        </div>

        {/* Chart or Skeleton */}
        <div className="w-full h-[320px]">
          {isLoading ? (
            <ChartSkeleton />
          ) : mounted ? (
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
                  tick={{ fill: "#64748B", fontSize: 11, fontWeight: "bold", fontFamily: "sans-serif" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: "bold", fontFamily: "sans-serif" }}
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
                  dot={{ stroke: "#00B2D6", strokeWidth: 1.5, r: 3.5, fill: "#FFFFFF" }}
                  activeDot={{ stroke: "#FFFFFF", strokeWidth: 2, r: 5.5, fill: "#00B2D6" }}
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
