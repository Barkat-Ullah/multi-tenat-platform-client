"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CircleSlash, Loader2 } from "lucide-react";

export default function BookingPaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FCFDFE]">
          <Loader2 className="h-10 w-10 animate-spin text-[#00B2D6]" />
        </div>
      }
    >
      <BookingPaymentCancelContent />
    </Suspense>
  );
}

function BookingPaymentCancelContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  return (
    <div className="min-h-screen bg-[#FCFDFE] px-4 py-14 poppins sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <div className="flex flex-col items-center rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-lg shadow-slate-100 sm:p-12">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <CircleSlash size={40} className="stroke-[2.5]" />
          </div>

          <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-[#0F2E4A] sm:text-3xl">
            Payment Cancelled
          </h1>
          <p className="mt-3 max-w-sm text-sm font-semibold text-[#55697A] sm:text-base">
            No charge was made. You can retry the payment anytime from your
            bookings.
          </p>

          {bookingId && (
            <div className="my-8 w-full rounded-2xl border border-slate-100 bg-[#FCFDFE] p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Booking ID
              </p>
              <p className="mt-1 break-all text-sm font-extrabold text-[#0F2E4A]">
                {bookingId}
              </p>
            </div>
          )}

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard/user/bookings"
              className="rounded-full bg-[#00B2D6] px-8 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#0092B3] sm:text-base"
            >
              View My Bookings
            </Link>
            <Link
              href="/"
              className="rounded-full border border-slate-200 px-8 py-3.5 text-sm font-bold text-[#0F2E4A] transition-colors hover:border-[#00B2D6] hover:text-[#00B2D6] sm:text-base"
            >
              Back Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
