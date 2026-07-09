"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";

const getFirstParam = (
  searchParams: ReturnType<typeof useSearchParams>,
  keys: string[],
) => {
  for (const key of keys) {
    const value = searchParams.get(key);
    if (value) return value;
  }
  return null;
};

export default function BookingPaymentErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FCFDFE]">
          <Loader2 className="h-10 w-10 animate-spin text-[#00B2D6]" />
        </div>
      }
    >
      <BookingPaymentErrorContent />
    </Suspense>
  );
}

function BookingPaymentErrorContent() {
  const searchParams = useSearchParams();
  const bookingId = getFirstParam(searchParams, [
    "bookingId",
    "booking_id",
    "booking",
    "id",
  ]);
  const sessionId = getFirstParam(searchParams, ["session_id", "sessionId"]);
  const status =
    getFirstParam(searchParams, ["status", "payment_status"]) || "FAILED";
  const errorMessage =
    getFirstParam(searchParams, ["message", "error", "reason"]) ||
    "Your payment was not completed. No successful payment confirmation was received.";

  return (
    <div className="min-h-screen bg-[#FCFDFE] px-4 py-14 poppins sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <div className="flex flex-col items-center rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-lg shadow-slate-100 sm:p-12">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertCircle size={40} className="stroke-[2.5]" />
          </div>

          <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-[#0F2E4A] sm:text-3xl">
            Payment Unsuccessful
          </h1>
          <p className="mt-3 max-w-md text-sm font-semibold leading-relaxed text-[#55697A] sm:text-base">
            {errorMessage}
          </p>

          {(bookingId || sessionId) && (
            <div className="my-8 w-full space-y-3 rounded-2xl border border-slate-100 bg-[#FCFDFE] p-5 text-left text-xs sm:text-sm">
              {bookingId && (
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                  <span className="font-bold uppercase text-slate-400">Booking ID</span>
                  <span className="break-all text-right font-extrabold text-[#0F2E4A]">
                    {bookingId}
                  </span>
                </div>
              )}
              {sessionId && (
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                  <span className="font-bold uppercase text-slate-400">Session ID</span>
                  <span className="max-w-[65%] break-all text-right font-extrabold text-[#0F2E4A]">
                    {sessionId}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between gap-4">
                <span className="font-bold uppercase text-slate-400">Status</span>
                <span className="font-extrabold uppercase text-red-500">{status}</span>
              </div>
            </div>
          )}

          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/booking"
              className="rounded-full bg-[#00B2D6] px-8 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#0092B3] sm:text-base"
            >
              Try Again
            </Link>
            <Link
              href="/dashboard/user/bookings"
              className="rounded-full border border-slate-200 px-8 py-3.5 text-sm font-bold text-[#0F2E4A] transition-colors hover:border-[#00B2D6] hover:text-[#00B2D6] sm:text-base"
            >
              View My Bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
