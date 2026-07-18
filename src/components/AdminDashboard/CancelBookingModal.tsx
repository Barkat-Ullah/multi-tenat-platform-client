"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { AdminBooking } from "@/redux/service/admin/bookingsApi";

interface CancelBookingModalProps {
  booking: AdminBooking | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const formatDateTime = (value?: string) => {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

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

export default function CancelBookingModal({
  booking,
  isSubmitting,
  onClose,
  onSubmit,
}: CancelBookingModalProps) {
  const [mounted, setMounted] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (booking) {
      setReason("");
    }
  }, [booking]);

  if (!booking || !mounted) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(reason);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-cancel-booking-title"
    >
      <button
        type="button"
        aria-label="Close cancel booking modal"
        className="absolute inset-0 bg-[#0F2E4A]/45 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-lg rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_24px_70px_rgba(15,46,74,0.18)] sm:p-7"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close"
          title="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-[#0F2E4A] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <X size={17} />
        </button>

        <h2
          id="admin-cancel-booking-title"
          className="pr-10 font-poppins text-xl font-extrabold text-[#0F2E4A]"
        >
          Cancel Booking
        </h2>

        <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3">
          <p className="text-sm font-bold text-[#0F2E4A]">
            {booking.service?.title || "Booking"}
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            {formatDateTime(booking.scheduledAt)} · {booking.driver?.fullName || "N/A"}
          </p>
        </div>

        <label
          htmlFor="admin-cancel-booking-reason"
          className="mt-5 block text-xs font-bold uppercase tracking-wide text-[#0F2E4A]"
        >
          Cancellation Reason
        </label>
        <textarea
          id="admin-cancel-booking-reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          rows={4}
          placeholder="Booking is being cancelled by admin"
          className="mt-2 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#0F2E4A] outline-none transition-colors placeholder:text-slate-400 focus:border-[#00B2D6]"
          required
        />

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full border border-slate-200 px-6 py-3 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Keep Booking
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Cancelling..." : "Cancel Booking"}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
}
