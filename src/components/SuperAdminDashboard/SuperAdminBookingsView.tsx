"use client";

import React, { useState } from "react";
import BookingDetailsModal from "@/components/AdminDashboard/BookingDetailsModal";
import BookingStatsCards from "@/components/AdminDashboard/BookingStatsCards";
import BookingsTable from "@/components/AdminDashboard/BookingsTable";
import Pagination from "@/components/AdminDashboard/Pagination";
import {
  type AdminBooking,
  useGetAdminBookingsQuery,
} from "@/redux/service/admin/bookingsApi";

const PAGE_LIMIT = 10;

export default function SuperAdminBookingsView() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: bookingsResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAdminBookingsQuery({ page: currentPage, limit: PAGE_LIMIT });

  const bookings = bookingsResponse?.data || [];
  const totalPages = Math.max(
    1,
    Math.ceil((bookingsResponse?.meta.total || 0) / PAGE_LIMIT),
  );
  const isBookingsLoading = isLoading || isFetching;

  const handleViewDetails = (booking: AdminBooking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full space-y-8 p-4 md:p-6 lg:p-8">
      <h1 className="font-poppins text-2xl font-extrabold tracking-tight text-[#0F2E4A] sm:text-3xl">
        Bookings
      </h1>

      <BookingStatsCards
        meta={bookingsResponse?.meta}
        isLoading={isBookingsLoading}
      />

      <div className="space-y-4">
        <h2 className="font-poppins text-lg font-bold text-[#0F2E4A] sm:text-xl">
          All Bookings
        </h2>

        <BookingsTable
          bookings={bookings}
          isLoading={isBookingsLoading}
          isError={isError}
          onRetry={refetch}
          onViewDetails={handleViewDetails}
        />
      </div>

      {!isLoading && !isError && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <BookingDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
      />
    </div>
  );
}
