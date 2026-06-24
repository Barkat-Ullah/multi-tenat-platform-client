"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

// Dashboard Components from dedicated AdminDashboard folder
import StatsCards from "@/components/AdminDashboard/StatsCards";
import BookingTrends from "@/components/AdminDashboard/BookingTrends";
import RecentBookings from "@/components/AdminDashboard/RecentBookings";
import TopServices from "@/components/AdminDashboard/TopServices";
import RecentReports from "@/components/AdminDashboard/RecentReports";

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-poppins tracking-tight">
        Overview
      </h1>

      {/* Top Stats Cards */}
      <StatsCards />

      {/* Search Patients Bar */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Search Patients"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-slate-200 bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-sm text-[#0F2E4A] placeholder-slate-400 transition-all font-semibold"
        />
      </div>

      {/* Booking Trends Card */}
      <BookingTrends />

      {/* Bottom Grid: Recent Bookings, Top Services, Recent Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentBookings />
        <TopServices />
        <RecentReports />
      </div>
    </div>
  );
}
