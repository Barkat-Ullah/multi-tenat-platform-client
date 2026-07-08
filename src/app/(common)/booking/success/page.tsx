"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, ReceiptText } from "lucide-react";
import {
  type DriverBooking,
  useGetDriverBookingDetailsQuery,
} from "@/redux/service/user/userBookingFlowApi";

type StoredBooking = {
  booking?: DriverBooking;
  payment?: {
    id: string;
    amount: number;
    status: string;
    paymentType: string;
  } | null;
};

const DetailRow = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs sm:text-sm">
    <span className="font-bold uppercase tracking-wider text-slate-400">{label}</span>
    <span className="text-right font-extrabold text-[#0F2E4A]">{value || "N/A"}</span>
  </div>
);

export default function BookingPaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FCFDFE]">
          <Loader2 className="h-10 w-10 animate-spin text-[#00B2D6]" />
        </div>
      }
    >
      <BookingPaymentSuccessContent />
    </Suspense>
  );
}

function BookingPaymentSuccessContent() {
  const searchParams = useSearchParams();
  const bookingId =
    searchParams.get("bookingId") ||
    searchParams.get("booking_id") ||
    searchParams.get("booking") ||
    searchParams.get("id");
  const sessionId = searchParams.get("session_id") || searchParams.get("sessionId");
  const paymentId = searchParams.get("paymentId") || searchParams.get("payment_id");
  const status = searchParams.get("status") || searchParams.get("payment_status");
  const [storedBooking, setStoredBooking] = useState<StoredBooking | null>(null);

  const {
    data: bookingResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetDriverBookingDetailsQuery(bookingId || "", {
    skip: !bookingId,
  });

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("latestBooking");
      if (stored) {
        setStoredBooking(JSON.parse(stored) as StoredBooking);
      }
    } catch {
      setStoredBooking(null);
    }
  }, []);

  const booking = bookingResponse?.data || storedBooking?.booking || null;
  const payment = storedBooking?.payment || booking?.payment || null;
  const isBusy = isLoading || isFetching;

  const paymentStatus = useMemo(() => {
    if (status) return status;
    return payment?.status || "SUCCESS";
  }, [payment?.status, status]);

  return (
    <div className="min-h-screen bg-[#FCFDFE] px-4 py-14 poppins sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <div className="flex flex-col items-center rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-lg shadow-slate-100 sm:p-12">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
            <CheckCircle2 size={40} className="stroke-[2.5]" />
          </div>

          <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-[#0F2E4A] sm:text-3xl">
            Payment Successful
          </h1>
          <p className="mt-3 max-w-sm text-sm font-semibold text-[#55697A] sm:text-base">
            Thanks. Your payment return has been received and your booking details are shown below.
          </p>

          {isBusy ? (
            <div className="my-8 flex w-full items-center justify-center rounded-2xl border border-slate-100 bg-[#FCFDFE] p-10">
              <Loader2 className="h-8 w-8 animate-spin text-[#00B2D6]" />
            </div>
          ) : isError ? (
            <div className="my-8 w-full rounded-2xl border border-red-100 bg-red-50/40 p-6 text-center">
              <ReceiptText className="mx-auto mb-3 h-9 w-9 text-red-300" />
              <p className="text-sm font-bold text-red-500">Could not load booking details.</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 rounded-full bg-[#00B2D6] px-5 py-2 text-xs font-bold text-white hover:bg-[#0092B3]"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="my-8 w-full space-y-3.5 rounded-2xl border border-slate-100 bg-[#FCFDFE] p-5 text-left">
              <DetailRow label="Booking ID" value={booking?.id || bookingId} />
              <DetailRow label="Payment ID" value={payment?.id || paymentId} />
              <DetailRow label="Session ID" value={sessionId} />
              <DetailRow label="Payment Status" value={paymentStatus} />
              <DetailRow label="Amount" value={payment?.amount ? `£${payment.amount.toFixed(2)}` : null} />
              <DetailRow label="Medical Assessment" value={booking?.service?.title} />
              <DetailRow label="Clinic" value={booking?.clinic?.fullName} />
              <DetailRow label="Location" value={booking?.clinic?.location?.locationName} />
              <DetailRow
                label="Slot"
                value={
                  booking?.timeSlot?.startTime && booking?.timeSlot?.endTime
                    ? `${booking.timeSlot.startTime} - ${booking.timeSlot.endTime}`
                    : null
                }
              />
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
