"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { DriverBooking } from "@/redux/service/user/userBookingFlowApi";

interface Step5SuccessProps {
  booking: DriverBooking | null;
}

export default function Step5Success({ booking }: Step5SuccessProps) {
  return (
    <div className="mx-auto max-w-xl">
      <div className="flex flex-col items-center rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-lg shadow-slate-100 sm:p-12">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
          <CheckCircle2 size={40} className="stroke-[2.5]" />
        </div>

        <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-[#0F2E4A] sm:text-3xl">
          Booking Created!
        </h2>
        <p className="mt-3 max-w-sm text-sm font-semibold text-[#55697A] sm:text-base">
          Your appointment request has been created. Complete payment to confirm the booking process.
        </p>

        <div className="my-8 w-full space-y-3.5 rounded-2xl border border-slate-100 bg-[#FCFDFE] p-5 text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs sm:text-sm">
            <span className="font-bold uppercase tracking-wider text-slate-400">Booking ID</span>
            <span className="font-extrabold text-[#00B2D6]">{booking?.id || "N/A"}</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs sm:text-sm">
            <span className="font-bold uppercase tracking-wider text-slate-400">Medical Assessment</span>
            <span className="font-extrabold text-[#00B2D6]">{booking?.service?.title || "N/A"}</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs sm:text-sm">
            <span className="font-bold uppercase tracking-wider text-slate-400">Clinic</span>
            <span className="text-right font-extrabold text-[#0F2E4A]">{booking?.clinic?.fullName || "N/A"}</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs sm:text-sm">
            <span className="font-bold uppercase tracking-wider text-slate-400">Location</span>
            <span className="font-extrabold text-[#0F2E4A]">{booking?.clinic?.location?.locationName || "N/A"}</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs sm:text-sm">
            <span className="font-bold uppercase tracking-wider text-slate-400">Status</span>
            <span className="font-extrabold text-[#0F2E4A]">{booking?.status || "PENDING"}</span>
          </div>
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-bold uppercase tracking-wider text-slate-400">Slot</span>
            <span className="font-extrabold text-[#0F2E4A]">
              {booking?.timeSlot?.startTime && booking?.timeSlot?.endTime
                ? `${booking.timeSlot.startTime} - ${booking.timeSlot.endTime}`
                : "N/A"}
            </span>
          </div>
        </div>

        <Link
          href="/dashboard/user/bookings"
          className="rounded-full bg-[#00B2D6] px-8 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#0092B3] sm:text-base"
        >
          View My Bookings
        </Link>
      </div>
    </div>
  );
}
