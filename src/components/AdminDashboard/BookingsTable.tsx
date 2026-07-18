"use client";

import React, { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import type { AdminBooking } from "@/redux/service/admin/bookingsApi";

interface BookingsTableProps {
  bookings: AdminBooking[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onViewDetails: (booking: AdminBooking) => void;
  onCancelBooking: (booking: AdminBooking) => void;
  onRescheduleBooking?: (booking: AdminBooking) => void;
}

const format12HourTime = (time24?: string) => {
  if (!time24) return "";
  const [hStr, mStr] = time24.split(":");
  const h = parseInt(hStr, 10);
  if (isNaN(h)) return time24;
  const m = mStr || "00";
  const period = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${period}`;
};

const formatBookingAppointment = (booking: AdminBooking) => {
  const dateValue = booking.timeSlot?.date || booking.scheduledAt;
  if (!dateValue) return "N/A";

  const dateObj = new Date(dateValue);
  if (Number.isNaN(dateObj.getTime())) return "N/A";

  const dateFormatted = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(dateObj);

  if (booking.timeSlot?.startTime) {
    return `${dateFormatted}, ${format12HourTime(booking.timeSlot.startTime)}`;
  }

  const timeFormatted = new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(dateObj);

  return `${dateFormatted}, ${timeFormatted}`;
};

const getStatusClassName = (status: string) => {
  switch (status.toUpperCase()) {
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-600";
    case "CONFIRMED":
      return "bg-cyan-50 text-[#00A5C7]";
    case "CANCELLED":
    case "CANCELED":
      return "bg-red-50 text-red-500";
    default:
      return "bg-amber-50 text-amber-600";
  }
};

const canCancelBooking = (status: string) => {
  const normalized = status.trim().toUpperCase();
  return normalized !== "COMPLETED" && normalized !== "CANCELLED" && normalized !== "CANCELED";
};

const BookingsTableSkeleton = () => (
  <tbody className="divide-y divide-slate-100/80" aria-label="Loading bookings">
    {Array.from({ length: 7 }, (_, rowIndex) => (
      <tr key={rowIndex} className="animate-pulse">
        {[48, 58, 44, 42, 38, 52].map((width, index) => (
          <td key={index} className="px-4 py-5">
            <div
              className="h-2.5 rounded-full bg-slate-200"
              style={{ width: `${width - (rowIndex % 3) * 4}%` }}
            />
          </td>
        ))}
        <td className="px-4 py-5 text-center"><div className="mx-auto h-6 w-20 rounded-full bg-slate-200" /></td>
        <td className="px-4 py-5 text-center"><div className="mx-auto h-8 w-8 rounded-full bg-slate-200" /></td>
      </tr>
    ))}
  </tbody>
);

export default function BookingsTable({
  bookings,
  isLoading,
  isError,
  onRetry,
  onViewDetails,
  onCancelBooking,
  onRescheduleBooking,
}: BookingsTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!openMenuId) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [openMenuId]);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[#00B2D6]/20 bg-white">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[1150px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#00B2D6]">
              <th className="px-4 py-3.5 text-xs font-bold tracking-wide text-gray-500 sm:text-sm">Driver</th>
              <th className="px-4 py-3.5 text-xs font-bold tracking-wide text-gray-500 sm:text-sm">Email</th>
              <th className="px-4 py-3.5 text-xs font-bold tracking-wide text-gray-500 sm:text-sm">Service</th>
              <th className="px-4 py-3.5 text-xs font-bold tracking-wide text-gray-500 sm:text-sm">Clinic</th>
              <th className="px-4 py-3.5 text-xs font-bold tracking-wide text-gray-500 sm:text-sm">Location</th>
              <th className="px-4 py-3.5 text-xs font-bold tracking-wide text-gray-500 sm:text-sm">Appointment</th>
              <th className="px-4 py-3.5 text-center text-xs font-bold tracking-wide text-gray-500 sm:text-sm">Status</th>
              <th className="px-4 py-3.5 text-center text-xs font-bold tracking-wide text-gray-500 sm:text-sm">Action</th>
            </tr>
          </thead>

          {isLoading ? (
            <BookingsTableSkeleton />
          ) : (
            <tbody className="divide-y divide-slate-100/80">
              {bookings.map((booking) => (
                <tr key={booking.id} className="transition-colors hover:bg-slate-50/50">
                  <td className="px-4 py-4 text-xs font-semibold text-slate-600 sm:text-sm">{booking.driver?.fullName || "N/A"}</td>
                  <td className="px-4 py-4 text-xs font-medium text-slate-400 sm:text-sm">{booking.driver?.email || "N/A"}</td>
                  <td className="px-4 py-4 text-xs font-semibold text-slate-500 sm:text-sm">{booking.service?.title || "N/A"}</td>
                  <td className="px-4 py-4 text-xs font-medium text-slate-400 sm:text-sm">{booking.clinic?.fullName || "N/A"}</td>
                  <td className="px-4 py-4 text-xs font-medium text-slate-400 sm:text-sm">{booking.clinic?.location?.locationName || "N/A"}</td>
                  <td className="px-4 py-4 text-xs font-semibold text-slate-400 sm:text-sm">{formatBookingAppointment(booking)}</td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${getStatusClassName(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div
                      ref={openMenuId === booking.id ? menuRef : null}
                      className="relative inline-flex justify-center"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenuId((current) =>
                            current === booking.id ? null : booking.id,
                          )
                        }
                        className="mx-auto flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Open booking actions"
                        title="Actions"
                        aria-expanded={openMenuId === booking.id}
                      >
                        <MoreVertical size={18} />
                      </button>

                      {openMenuId === booking.id && (
                        <div className="absolute right-0 top-9 z-20 w-48 overflow-hidden rounded-2xl border border-slate-100 bg-white py-1.5 text-left shadow-[0_18px_45px_rgba(15,46,74,0.14)]">
                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(null);
                              onViewDetails(booking);
                            }}
                            className="block w-full px-4 py-2.5 text-left text-xs font-bold text-[#0F2E4A] transition-colors hover:bg-slate-50"
                          >
                            View Details
                          </button>
                          {canCancelBooking(booking.status) && onRescheduleBooking && (
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                onRescheduleBooking(booking);
                              }}
                              className="block w-full px-4 py-2.5 text-left text-xs font-bold text-[#00B2D6] transition-colors hover:bg-[#E6FAFF]"
                            >
                              Reschedule Appointment
                            </button>
                          )}
                          {canCancelBooking(booking.status) && (
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                onCancelBooking(booking);
                              }}
                              className="block w-full px-4 py-2.5 text-left text-xs font-bold text-red-600 transition-colors hover:bg-red-50"
                            >
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>

        {!isLoading && isError && (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 border-t border-slate-100 text-center">
            <p className="text-sm font-bold text-red-500">Failed to load bookings.</p>
            <button type="button" onClick={onRetry} className="rounded-full bg-[#00B2D6] px-5 py-2 text-xs font-bold text-white hover:bg-[#009cb9]">Try Again</button>
          </div>
        )}

        {!isLoading && !isError && bookings.length === 0 && (
          <div className="flex min-h-[280px] items-center justify-center border-t border-slate-100 px-6 text-center text-sm font-semibold text-slate-400">
            No bookings found.
          </div>
        )}
      </div>
    </div>
  );
}
