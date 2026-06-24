"use client";

import React from "react";
import { Eye } from "lucide-react";
import { AllBookingItemData } from "@/app/data/AdminDashboardData";

interface BookingsTableProps {
  bookings: AllBookingItemData[];
  onViewDetails?: (booking: AllBookingItemData) => void;
}

export default function BookingsTable({ bookings, onViewDetails }: BookingsTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[900px] border-collapse text-left">
        <thead>
          <tr className="border-b border-[#00B2D6] border-t-0">
            <th className="py-3.5 px-4 text-xs sm:text-sm font-bold text-gray-500 font-sans tracking-wide">
              Client Name
            </th>
            <th className="py-3.5 px-4 text-xs sm:text-sm font-bold text-gray-500 font-sans tracking-wide">
              Email
            </th>
            <th className="py-3.5 px-4 text-xs sm:text-sm font-bold text-gray-500 font-sans tracking-wide">
              Service
            </th>
            <th className="py-3.5 px-4 text-xs sm:text-sm font-bold text-gray-500 font-sans tracking-wide">
              Council
            </th>
            <th className="py-3.5 px-4 text-xs sm:text-sm font-bold text-gray-500 font-sans tracking-wide">
              Clinician
            </th>
            <th className="py-3.5 px-4 text-xs sm:text-sm font-bold text-gray-500 font-sans tracking-wide">
              Date & Time
            </th>
            <th className="py-3.5 px-4 text-xs sm:text-sm font-bold text-gray-500 font-sans tracking-wide text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr
              key={booking.id}
              className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
            >
              <td className="py-4 px-4 text-xs sm:text-sm font-semibold text-slate-500 font-sans">
                {booking.name}
              </td>
              <td className="py-4 px-4 text-xs sm:text-sm font-medium text-slate-400 font-sans">
                {booking.email}
              </td>
              <td className="py-4 px-4 text-xs sm:text-sm font-semibold text-slate-500 font-sans">
                {booking.service}
              </td>
              <td className="py-4 px-4 text-xs sm:text-sm font-medium text-slate-400 font-sans">
                {booking.council}
              </td>
              <td className="py-4 px-4 text-xs sm:text-sm font-medium text-slate-400 font-sans">
                {booking.clinician}
              </td>
              <td className="py-4 px-4 text-xs sm:text-sm font-semibold text-slate-400 font-sans">
                {booking.dateTime}
              </td>
              <td className="py-4 px-4 text-center">
                <button
                  onClick={() => onViewDetails?.(booking)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer border-none bg-transparent mx-auto"
                  aria-label="View booking details"
                >
                  <Eye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
