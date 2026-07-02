"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { AdminBooking } from "@/redux/service/admin/bookingsApi";

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: AdminBooking | null;
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

const formatAmount = (amount?: number) =>
  typeof amount === "number"
    ? new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
      }).format(amount)
    : "N/A";

const Detail = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="min-w-0">
    <span className="block text-xs font-bold text-slate-400">{label}</span>
    <span className="break-words font-semibold text-[#0F2E4A]">{value || "N/A"}</span>
  </div>
);

export default function BookingDetailsModal({
  isOpen,
  onClose,
  booking,
}: BookingDetailsModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !booking || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close booking details"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-[620px] overflow-y-auto rounded-[32px] border border-slate-100 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] animate-in fade-in zoom-in-95 sm:p-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <h2 className="font-poppins text-xl font-extrabold text-[#0F2E4A] sm:text-2xl">
            Booking Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E6FAFF] text-[#00B2D6] hover:bg-[#D0F3FC]"
            aria-label="Close booking details"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2 sm:text-base">
          <Detail label="Driver Name" value={booking.driver?.fullName} />
          <Detail label="Driver Email" value={booking.driver?.email} />
          <Detail label="Phone" value={booking.driver?.phoneNumber} />
          <Detail label="Licence Number" value={booking.driver?.licenseNo} />
          <Detail label="Service" value={booking.service?.title} />
          <Detail label="Clinic" value={booking.clinic?.fullName} />
          <Detail label="Location" value={booking.clinic?.location?.locationName} />
          <Detail label="Appointment" value={formatDateTime(booking.scheduledAt)} />
          <Detail
            label="Time Slot"
            value={
              booking.timeSlot?.startTime && booking.timeSlot?.endTime
                ? `${booking.timeSlot.startTime} - ${booking.timeSlot.endTime}`
                : undefined
            }
          />
          <Detail label="Booking Status" value={booking.status} />
          <Detail label="Payment Method" value={booking.method?.type} />
          <Detail label="Payment Status" value={booking.payment?.status} />
          <Detail label="Amount" value={formatAmount(booking.payment?.amount)} />
          <Detail label="Medical Record" value={booking.medicalRecord?.result} />
          <div className="sm:col-span-2">
            <Detail label="Booking ID" value={booking.id} />
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-8 w-full rounded-2xl bg-[#00B2D6] py-3 text-sm font-bold text-white hover:bg-[#009cb9]"
        >
          Close Details
        </button>
      </div>
    </div>,
    document.body,
  );
}
