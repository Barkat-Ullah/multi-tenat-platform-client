"use client";

import React, { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import { toast } from "sonner";
import {
  UserBookingItem,
  useCancelMyBookingMutation,
  useGetMyBookingsQuery,
} from "@/redux/service/user/userDashboardApi";

interface BookingRow {
  id: string;
  clinicianName: string;
  email: string;
  serviceType: string;
  appointmentTime: string;
  location: string;
  status: string;
}

const formatBookingDateTime = (scheduledAt?: string) => {
  if (!scheduledAt) return "Not scheduled";

  const date = new Date(scheduledAt);
  if (Number.isNaN(date.getTime())) return "Not scheduled";

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const formatStatus = (status: string) =>
  status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const normalizeStatus = (status: string) => status.trim().toUpperCase();

const mapBookingToRow = (booking: UserBookingItem): BookingRow => {
  const clinic = booking.clinic;
  const clinicLocation = clinic?.location?.locationName;

  return {
    id: booking.id,
    clinicianName: booking.clinicName || clinic?.fullName || "N/A",
    email: booking.clinicEmail || clinic?.email || booking.driver?.email || "N/A",
    serviceType: booking.serviceTitle || booking.service?.title || "N/A",
    appointmentTime: formatBookingDateTime(booking.scheduledAt),
    location: booking.location || clinicLocation || clinic?.city || clinic?.address || "N/A",
    status: booking.status,
  };
};

const getStatusClassName = (status: string) => {
  const normalized = normalizeStatus(status);

  if (normalized === "CONFIRMED") {
    return "bg-[#E8F8F5] text-[#10B981] border-[#A3E4D7]/30";
  }

  if (normalized === "CANCELLED" || normalized === "CANCELED") {
    return "bg-red-50 text-red-600 border-red-100";
  }

  if (normalized === "COMPLETED") {
    return "bg-[#E6FAFF] text-[#00B2D6] border-[#B2ECF7]/50";
  }

  return "bg-[#FEF9E7] text-[#D9A700] border-[#F9E79F]/30";
};

const canCancelBooking = (status: string) => {
  const normalized = normalizeStatus(status);
  return normalized === "PENDING" || normalized === "CONFIRMED";
};

const BookingsTableSkeleton = () => (
  <>
    {Array.from({ length: 7 }).map((_, rowIndex) => (
      <tr key={rowIndex} className="animate-pulse">
        {[58, 64, 46, 62, 42, 36].map((width, columnIndex) => (
          <td key={columnIndex} className="px-8 py-5">
            <div
              className="h-2.5 rounded-full bg-slate-200"
              style={{ width: `${width - (rowIndex % 3) * 5}%` }}
            />
            {columnIndex === 1 && (
              <div className="mt-2 h-1.5 w-1/3 rounded-full bg-slate-100" />
            )}
          </td>
        ))}
        <td className="px-6 py-5 text-center">
          <div className="mx-auto h-6 w-24 rounded-full bg-slate-200" />
        </td>
      </tr>
    ))}
  </>
);

export default function UserBookingsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingToCancel, setBookingToCancel] = useState<BookingRow | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const itemsPerPage = 9;

  const { data, isLoading, isFetching, isError, refetch } = useGetMyBookingsQuery({
    page: currentPage,
    limit: itemsPerPage,
  });
  const [cancelBooking, { isLoading: isCancellingBooking }] =
    useCancelMyBookingMutation();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const bookings = useMemo(
    () => (data?.data || []).map(mapBookingToRow),
    [data?.data],
  );

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const search = searchTerm.toLowerCase();
      return (
        b.clinicianName.toLowerCase().includes(search) ||
        b.email.toLowerCase().includes(search) ||
        b.serviceType.toLowerCase().includes(search) ||
        b.location.toLowerCase().includes(search)
      );
    });
  }, [bookings, searchTerm]);

  const serverTotalPages = data?.meta
    ? Math.max(1, Math.ceil(data.meta.total / data.meta.limit))
    : 1;
  const totalPages = searchTerm
    ? Math.ceil(filteredBookings.length / itemsPerPage)
    : serverTotalPages;
  const paginatedBookings = useMemo(() => {
    if (!searchTerm) return filteredBookings;

    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(startIdx, startIdx + itemsPerPage);
  }, [currentPage, filteredBookings, searchTerm]);
  const isBookingsLoading = isLoading || isFetching;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const closeCancelModal = () => {
    if (isCancellingBooking) return;
    setBookingToCancel(null);
    setCancelReason("");
  };

  const handleSubmitCancel = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!bookingToCancel) return;

    const reason = cancelReason.trim();
    if (!reason) {
      toast.error("Please enter a cancellation reason.");
      return;
    }

    try {
      const response = await cancelBooking({
        id: bookingToCancel.id,
        reason,
      }).unwrap();

      toast.success(response.message || "Booking cancelled successfully.");
      closeCancelModal();
    } catch (error) {
      const message =
        (error as { data?: { message?: string }; message?: string })?.data?.message ||
        (error as { message?: string })?.message ||
        "Failed to cancel booking.";
      toast.error(message);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
        Bookings
      </h1>

      {/* Search Input Bar */}
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-4.5 w-4.5 text-[#00B2D6]" />
        </span>
        <input
          type="text"
          placeholder="Search Booking"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-xs sm:text-sm text-[#0F2E4A] placeholder-slate-400 font-semibold transition-all shadow-[0_2px_8px_rgba(0,0,0,0.005)]"
        />
      </div>

      {/* Main Content Area */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-extrabold text-[#0F2E4A] font-poppins">
          All Bookings list
        </h2>

        {/* Scrollable Table Wrapper */}
        <div className="bg-white rounded-[24px] border border-slate-100/90 shadow-[0_4px_25px_rgba(0,0,0,0.01)] overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[1180px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#00B2D6] bg-white">
                  <th className="py-3.5 px-8 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[22%]">
                    Clinician Name
                  </th>
                  <th className="py-3.5 px-8 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[18%]">
                    Email
                  </th>
                  <th className="py-3.5 px-8 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[18%]">
                    Service Type
                  </th>
                  <th className="py-3.5 px-8 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[18%]">
                    Appointment Time
                  </th>
                  <th className="py-3.5 px-8 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[14%]">
                    Location
                  </th>
                  <th className="py-3.5 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins text-center w-[10%]">
                    Status
                  </th>
                  <th className="py-3.5 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins text-center w-[10%]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {isBookingsLoading && <BookingsTableSkeleton />}
                {isError && !isBookingsLoading && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center">
                      <p className="text-sm font-bold text-red-500">
                        Failed to load bookings.
                      </p>
                      <button
                        type="button"
                        onClick={() => refetch()}
                        className="mt-3 rounded-full bg-[#00B2D6] px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#0092B0]"
                      >
                        Try Again
                      </button>
                    </td>
                  </tr>
                )}
                {!isBookingsLoading && !isError && paginatedBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3.5 px-8 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                      {b.clinicianName}
                    </td>
                    <td className="py-3.5 px-8 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                      {b.email}
                    </td>
                    <td className="py-3.5 px-8 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                      {b.serviceType}
                    </td>
                    <td className="py-3.5 px-8 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                      {b.appointmentTime}
                    </td>
                    <td className="py-3.5 px-8 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                      {b.location}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold border uppercase tracking-wider ${getStatusClassName(b.status)}`}>
                        {formatStatus(b.status)}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      {canCancelBooking(b.status) ? (
                        <button
                          type="button"
                          onClick={() => setBookingToCancel(b)}
                          className="rounded-full border border-red-100 bg-red-50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-600 transition-colors hover:border-red-200 hover:bg-red-100 sm:text-xs"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-slate-300">
                          -
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {!isBookingsLoading && !isError && paginatedBookings.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-sm font-bold text-slate-400 font-sans">
                      No matching bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Row */}
        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-1.5 pt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white rounded-lg text-xs sm:text-sm font-bold text-[#0F2E4A] flex items-center gap-1 transition-all cursor-pointer disabled:cursor-not-allowed outline-none"
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isSelected = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 rounded-lg border text-xs sm:text-sm font-bold flex items-center justify-center transition-all cursor-pointer outline-none ${
                    isSelected
                      ? "bg-[#00B2D6] text-white border-[#00B2D6] shadow-sm"
                      : "bg-white hover:bg-slate-50 text-[#0F2E4A] border-slate-200"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white rounded-lg text-xs sm:text-sm font-bold text-[#0F2E4A] flex items-center gap-1 transition-all cursor-pointer disabled:cursor-not-allowed outline-none"
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {bookingToCancel && isMounted &&
        createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-booking-title"
        >
          <button
            type="button"
            aria-label="Close cancel booking modal"
            className="absolute inset-0 bg-[#0F2E4A]/45 backdrop-blur-[2px]"
            onClick={closeCancelModal}
          />
          <form
            onSubmit={handleSubmitCancel}
            className="relative z-10 w-full max-w-lg rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_24px_70px_rgba(15,46,74,0.18)] sm:p-7"
          >
            <button
              type="button"
              onClick={closeCancelModal}
              disabled={isCancellingBooking}
              aria-label="Close"
              title="Close"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-[#0F2E4A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X size={17} />
            </button>

            <h2
              id="cancel-booking-title"
              className="pr-10 font-poppins text-xl font-extrabold text-[#0F2E4A]"
            >
              Cancel Booking
            </h2>
            <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-sm font-bold text-[#0F2E4A]">
                {bookingToCancel.serviceType}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                {bookingToCancel.appointmentTime} · {bookingToCancel.clinicianName}
              </p>
            </div>

            <label
              htmlFor="cancel-reason"
              className="mt-5 block text-xs font-bold uppercase tracking-wide text-[#0F2E4A]"
            >
              Cancellation Reason
            </label>
            <textarea
              id="cancel-reason"
              value={cancelReason}
              onChange={(event) => setCancelReason(event.target.value)}
              rows={4}
              placeholder="Driver is unavailable on this date"
              className="mt-2 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#0F2E4A] outline-none transition-colors placeholder:text-slate-400 focus:border-[#00B2D6]"
              required
            />

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeCancelModal}
                disabled={isCancellingBooking}
                className="rounded-full border border-slate-200 px-6 py-3 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Keep Booking
              </button>
              <button
                type="submit"
                disabled={isCancellingBooking}
                className="rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isCancellingBooking ? "Cancelling..." : "Cancel Booking"}
              </button>
            </div>
          </form>
        </div>,
        document.body,
      )}
    </div>
  );
}
