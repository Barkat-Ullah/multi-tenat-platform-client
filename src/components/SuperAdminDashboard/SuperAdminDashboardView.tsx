"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Search,
  ChevronDown,
  FileText,
  Download,
  BookOpen
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  superAdminStatsData,
  bookingRevenueTrendsData,
  superAdminRecentBookings,
  topServicesPieData,
  superAdminRecentReports
} from "@/app/data/SuperAdminDashboardData";
import { toast } from "sonner";

// Custom Tooltip component to match the premium tooltip card style in the mockup
const CustomChartTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] space-y-2">
        <p className="text-xs font-extrabold text-[#0F2E4A] font-poppins">April</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-300" />
          <span className="text-[11px] font-bold text-slate-500 font-sans">
            Booking: {payload[0]?.value ?? 300}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00B2D6]" />
          <span className="text-[11px] font-bold text-slate-500 font-sans">
            Reviews: ${payload[1]?.value ?? 300}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function SuperAdminDashboardView() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleDownload = (title: string) => {
    toast.success(`Successfully downloaded "${title}"!`);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 w-full">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          Overview
        </h1>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Today's Bookings */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col justify-between min-h-[140px] shadow-[0_4px_25px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins">
              Today&apos;s Bookings
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#E6FAFF] text-[#00B2D6] flex items-center justify-center shrink-0">
              <Calendar size={18} className="stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins pt-4">
            {superAdminStatsData.todaysBookings}
          </div>
        </div>

        {/* Pending Bookings */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col justify-between min-h-[140px] shadow-[0_4px_25px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins">
              Pending Bookings
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#FEF9E7] text-[#D9A700] flex items-center justify-center shrink-0">
              <Clock size={18} className="stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins pt-4">
            {superAdminStatsData.pendingBookings}
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col justify-between min-h-[140px] shadow-[0_4px_25px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins">
              Today&apos;s Revenue
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#EEF2FF] text-[#6366F1] flex items-center justify-center shrink-0">
              <DollarSign size={18} className="stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins pt-4">
            {superAdminStatsData.todaysRevenue}
          </div>
        </div>

        {/* Active Locations */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col justify-between min-h-[140px] shadow-[0_4px_25px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins">
              Active Locations
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#FEF5E7] text-[#F39C12] flex items-center justify-center shrink-0">
              <MapPin size={18} className="stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins pt-4">
            {superAdminStatsData.activeLocations}
          </div>
        </div>
      </div>

      {/* Search Patients Bar */}
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Patients"
          className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-xs sm:text-sm text-[#0F2E4A] placeholder-slate-400 font-semibold transition-all shadow-[0_2px_10px_rgba(0,0,0,0.005)]"
        />
      </div>

      {/* Booking & Revenue Trends Graph Card */}
      <div className="bg-white rounded-[24px] border border-slate-100 p-6 sm:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.01)] space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#0F2E4A] font-poppins">
            Booking & Revenue Trends
          </h2>
          <div className="flex items-center gap-2 px-3.5 py-1.5 border border-slate-200 rounded-xl text-slate-600 cursor-pointer hover:bg-slate-50 transition-all select-none">
            <span className="text-xs font-bold font-sans">Yearly</span>
            <ChevronDown size={14} className="text-slate-400" />
          </div>
        </div>

        {/* Double Line/Area Chart */}
        <div className="h-[340px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={bookingRevenueTrendsData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBooking" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F2E4A" stopOpacity={0.08} />
                  <stop offset="95%" stopColor="#0F2E4A" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00B2D6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#00B2D6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: "bold" }}
              />
              <YAxis
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#00B2D6", fontSize: 11, fontWeight: "bold" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#00B2D6", fontSize: 11, fontWeight: "bold" }}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip content={<CustomChartTooltip />} />
              
              {/* Booking Area/Line */}
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="booking"
                stroke="#0F2E4A"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorBooking)"
                activeDot={{ r: 6, strokeWidth: 0, fill: "#0F2E4A" }}
              />
              
              {/* Revenue Area/Line */}
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#00B2D6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                activeDot={{ r: 6, strokeWidth: 0, fill: "#00B2D6" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid of 3 Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card A: Recent Bookings */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#0F2E4A] font-poppins">
                Recent Bookings
              </h3>
              <button
                type="button"
                className="text-[#00B2D6] hover:underline font-bold text-xs cursor-pointer border-none outline-none bg-transparent"
              >
                View All Bookings
              </button>
            </div>

            {/* List */}
            <div className="space-y-4">
              {superAdminRecentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#00B2D6] text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {booking.initial}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-[#0F2E4A]">{booking.name}</p>
                      <p className="text-[10px] sm:text-xs font-semibold text-slate-400 font-sans mt-0.5">
                        {booking.service} · {booking.time}
                      </p>
                    </div>
                  </div>
                  <span className="px-3.5 py-1 rounded-full text-[10px] font-bold bg-[#E8F8F5] text-[#10B981] select-none">
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card B: Top Services Donut Chart */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#0F2E4A] font-poppins">
                Top Services
              </h3>
              <button
                type="button"
                className="text-[#00B2D6] hover:underline font-bold text-xs cursor-pointer border-none outline-none bg-transparent"
              >
                View All
              </button>
            </div>

            {/* Donut Chart representation */}
            <div className="relative h-[180px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topServicesPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {topServicesPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-[#0F2E4A] font-poppins leading-none">
                  850
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Total
                </span>
              </div>
            </div>

            {/* Donut Labels List */}
            <div className="space-y-2 pt-2">
              {topServicesPieData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-bold text-slate-500 font-sans">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-[#0F2E4A]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card C: Recent Reports */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#0F2E4A] font-poppins">
                Recent Reports
              </h3>
              <button
                type="button"
                className="text-[#00B2D6] hover:underline font-bold text-xs cursor-pointer border-none outline-none bg-transparent"
              >
                View All Reports
              </button>
            </div>

            {/* List */}
            <div className="space-y-4">
              {superAdminRecentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#E6FAFF] text-[#00B2D6] flex items-center justify-center shrink-0">
                      <FileText size={18} className="stroke-[2.2]" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-[#0F2E4A]">{report.title}</p>
                      <p className="text-[10px] sm:text-xs font-semibold text-slate-400 font-sans mt-0.5">
                        {report.date}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDownload(report.title)}
                    className="text-[#00B2D6] hover:text-[#009cb9] hover:scale-110 active:scale-95 transition-all outline-none border-none bg-transparent cursor-pointer"
                    title="Download Report"
                  >
                    <Download size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
