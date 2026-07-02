"use client";

import React from "react";
import { Card } from "antd";
import Link from "next/link";
import type { AdminRecentBooking } from "@/redux/service/admin/dashboardApi";

interface RecentBookingsProps {
  bookings: AdminRecentBooking[];
  isLoading: boolean;
}

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const getStatusClassName = (status: string) => {
  switch (status.toUpperCase()) {
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-600";
    case "CANCELLED":
    case "CANCELED":
      return "bg-red-50 text-red-500";
    case "CONFIRMED":
      return "bg-cyan-50 text-[#00A5C7]";
    default:
      return "bg-amber-50 text-amber-600";
  }
};

const BookingSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 4 }, (_, index) => (
      <div key={index} className="flex animate-pulse items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200" />
          <div className="space-y-2">
            <div className="h-2.5 w-24 rounded-full bg-slate-200" />
            <div className="h-2 w-36 rounded-full bg-slate-100" />
          </div>
        </div>
        <div className="h-5 w-16 rounded-full bg-slate-200" />
      </div>
    ))}
  </div>
);

export default function RecentBookings({
  bookings,
  isLoading,
}: RecentBookingsProps) {
  return (
    <Card
      variant="borderless"
      className="h-full rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.015)]"
      styles={{ body: { padding: "24px" } }}
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="font-poppins text-base font-bold text-gray-900">
          Recent Bookings
        </h2>
        <Link href="/dashboard/admin/all-booking" className="text-xs font-bold text-[#00B2D6] hover:underline">
          View All
        </Link>
      </div>

      {isLoading ? (
        <BookingSkeleton />
      ) : bookings.length === 0 ? (
        <div className="flex min-h-[180px] items-center justify-center text-center text-sm font-semibold text-slate-400">
          No recent bookings.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E6FAFF] text-sm font-bold text-[#00B2D6]">
                  {item.driverName?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="min-w-0">
                  <h4 className="truncate text-sm font-bold leading-tight text-[#0F2E4A]">
                    {item.driverName || "N/A"}
                  </h4>
                  <p className="mt-0.5 truncate text-[11px] font-semibold text-slate-400">
                    {item.service || "N/A"} - {formatDate(item.scheduledAt)}
                  </p>
                </div>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide ${getStatusClassName(item.status)}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
