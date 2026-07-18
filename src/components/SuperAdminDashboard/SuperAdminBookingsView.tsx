"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import CancelBookingModal from "@/components/AdminDashboard/CancelBookingModal";
import BookingDetailsModal from "@/components/AdminDashboard/BookingDetailsModal";
import BookingStatsCards from "@/components/AdminDashboard/BookingStatsCards";
import BookingsTable from "@/components/AdminDashboard/BookingsTable";
import Pagination from "@/components/AdminDashboard/Pagination";
import {
  type AdminBooking,
  useCancelAdminBookingMutation,
  useGetAdminBookingsQuery,
} from "@/redux/service/admin/bookingsApi";

const PAGE_LIMIT = 10;

export default function SuperAdminBookingsView() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(
    null,
  );
  const [bookingToCancel, setBookingToCancel] = useState<AdminBooking | null>(
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
  const [cancelBooking, { isLoading: isCancellingBooking }] =
    useCancelAdminBookingMutation();

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

  const handleCancelBooking = async (reason: string) => {
    if (!bookingToCancel) return;

    const trimmedReason = reason.trim();
    if (!trimmedReason) {
      toast.error("Please enter a cancellation reason.");
      return;
    }

    try {
      const response = await cancelBooking({
        id: bookingToCancel.id,
        reason: trimmedReason,
      }).unwrap();

      toast.success(response.message || "Booking cancelled successfully.");
      setBookingToCancel(null);
    } catch (error) {
      const message =
        (error as { data?: { message?: string }; message?: string })?.data?.message ||
        (error as { message?: string })?.message ||
        "Failed to cancel booking.";
      toast.error(message);
    }
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
          onCancelBooking={setBookingToCancel}
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

      <CancelBookingModal
        booking={bookingToCancel}
        isSubmitting={isCancellingBooking}
        onClose={() => {
          if (!isCancellingBooking) setBookingToCancel(null);
        }}
        onSubmit={handleCancelBooking}
      />
    </div>
  );
}
