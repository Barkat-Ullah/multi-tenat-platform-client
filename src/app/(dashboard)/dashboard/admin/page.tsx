"use client";

import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";

// Dashboard Components from dedicated AdminDashboard folder
import StatsCards from "@/components/AdminDashboard/StatsCards";
import BookingTrends from "@/components/AdminDashboard/BookingTrends";
import RecentBookings from "@/components/AdminDashboard/RecentBookings";
import TopServices from "@/components/AdminDashboard/TopServices";
import RecentReports from "@/components/AdminDashboard/RecentReports";
import { useGetAdminAnalyticsQuery } from "@/redux/service/admin/dashboardApi";

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isFetching, isError, refetch } =
    useGetAdminAnalyticsQuery("monthly");

  const analytics = data?.data;
  const query = searchTerm.trim().toLowerCase();
  const recentBookings = useMemo(
    () =>
      (analytics?.recentBookings || []).filter((booking) =>
        [booking.driverName, booking.service, booking.status].some((value) =>
          value?.toLowerCase().includes(query),
        ),
      ),
    [analytics?.recentBookings, query],
  );
  const recentReports = useMemo(
    () =>
      (analytics?.recentMedicalRecords || []).filter((record) =>
        [
          record.driverName,
          record.clinicName,
          record.service,
          record.companyName,
          record.result,
        ].some((value) => value?.toLowerCase().includes(query)),
      ),
    [analytics?.recentMedicalRecords, query],
  );
  const topServices = useMemo(
    () =>
      (analytics?.topServices || []).filter((service) =>
        service.title.toLowerCase().includes(query),
      ),
    [analytics?.topServices, query],
  );
  const isDashboardLoading = isLoading || isFetching;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-poppins tracking-tight">
        Overview
      </h1>

      {/* Top Stats Cards */}
      <StatsCards
        overview={analytics?.overview}
        isLoading={isDashboardLoading}
      />

      {isError && !isDashboardLoading && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50/40 px-6 py-8 text-center">
          <p className="text-sm font-bold text-red-500">
            Failed to load dashboard analytics.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-full bg-[#00B2D6] px-5 py-2 text-xs font-bold text-white hover:bg-[#009cb9]"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Search Patients Bar */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Search size={18} />
        </span>
        <input
          type="search"
          placeholder="Search Dashboard Records"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-slate-200 bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-sm text-[#0F2E4A] placeholder-slate-400 transition-all font-semibold"
        />
      </div>

      {/* Booking Trends Card */}
      <BookingTrends
        data={analytics?.trend || []}
        isLoading={isDashboardLoading}
      />

      {/* Bottom Grid: Recent Bookings, Top Services, Recent Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentBookings
          bookings={recentBookings}
          isLoading={isDashboardLoading}
        />
        <TopServices
          services={topServices}
          isLoading={isDashboardLoading}
        />
        <RecentReports
          reports={recentReports}
          isLoading={isDashboardLoading}
        />
      </div>
    </div>
  );
}
