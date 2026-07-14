"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import {
  UserBookingItem,
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

const BookingsTableSkeleton = () => (
  <>
    {Array.from({ length: 7 }).map((_, rowIndex) => (
      <tr key={rowIndex} className="animate-pulse">
        {[58, 64, 46, 62, 42].map((width, columnIndex) => (
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
  const itemsPerPage = 9;

  const { data, isLoading, isFetching, isError, refetch } = useGetMyBookingsQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

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
            <table className="w-full min-w-[1100px] border-collapse text-left">
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {isBookingsLoading && <BookingsTableSkeleton />}
                {isError && !isBookingsLoading && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center">
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
                  </tr>
                ))}
                {!isBookingsLoading && !isError && paginatedBookings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm font-bold text-slate-400 font-sans">
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
    </div>
  );
}
