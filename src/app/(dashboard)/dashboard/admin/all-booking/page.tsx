"use client";

import React, { useState } from "react";
import { allBookingsData } from "@/app/data/AdminDashboardData";
import BookingStatsCards from "@/components/AdminDashboard/BookingStatsCards";
import BookingsTable from "@/components/AdminDashboard/BookingsTable";
import Pagination from "@/components/AdminDashboard/Pagination";

export default function AllBookingPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const totalPages = Math.ceil(allBookingsData.length / itemsPerPage);

  const paginatedBookings = allBookingsData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-poppins tracking-tight">
        Bookings
      </h1>

      {/* Bookings Status Counter Cards */}
      <BookingStatsCards />

      {/* Table Section */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 font-poppins">
          All booking
        </h2>
        
        {/* Bookings Table list */}
        <BookingsTable bookings={paginatedBookings} />
      </div>

      {/* Pagination Footer */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
