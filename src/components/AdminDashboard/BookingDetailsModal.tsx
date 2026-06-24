"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { AllBookingItemData } from "@/app/data/AdminDashboardData";

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: AllBookingItemData | null;
}

export default function BookingDetailsModal({
  isOpen,
  onClose,
  booking,
}: BookingDetailsModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !booking || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="bg-white w-full max-w-[480px] rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-6 sm:p-8 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2E4A] font-poppins">
            Booking Details
          </h2>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#E6FAFF] text-[#00B2D6] hover:bg-[#D0F3FC] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer border-none outline-none"
            aria-label="Close modal"
          >
            <X size={18} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Content Fields */}
        <div className="space-y-4.5 text-[15px] sm:text-base text-[#0F2E4A] font-sans mt-6">
          <div className="flex items-start sm:items-center gap-1.5">
            <span className="font-extrabold whitespace-nowrap">Client Name :</span>
            <span className="font-semibold text-slate-500">{booking.name}</span>
          </div>

          <div className="flex items-start sm:items-center gap-1.5">
            <span className="font-extrabold whitespace-nowrap">Email :</span>
            <span className="font-semibold text-slate-500">{booking.email}</span>
          </div>

          <div className="flex items-start sm:items-center gap-1.5">
            <span className="font-extrabold whitespace-nowrap">Client ID :</span>
            <span className="font-semibold text-slate-500">{booking.clientId}</span>
          </div>

          <div className="flex items-start sm:items-center gap-1.5">
            <span className="font-extrabold whitespace-nowrap">Service :</span>
            <span className="font-semibold text-slate-500">{booking.service}</span>
          </div>

          <div className="flex items-start gap-1.5">
            <span className="font-extrabold whitespace-nowrap">Location :</span>
            <span className="font-semibold text-slate-500 leading-tight">{booking.location}</span>
          </div>

          <div className="flex items-start sm:items-center gap-1.5">
            <span className="font-extrabold whitespace-nowrap">Council :</span>
            <span className="font-semibold text-slate-500">{booking.council}</span>
          </div>

          <div className="flex items-start sm:items-center gap-1.5">
            <span className="font-extrabold whitespace-nowrap">Clinician :</span>
            <span className="font-semibold text-slate-500">{booking.clinician}</span>
          </div>

          <div className="flex items-start sm:items-center gap-1.5">
            <span className="font-extrabold whitespace-nowrap">Date & Time :</span>
            <span className="font-semibold text-slate-500">{booking.fullDateTime}</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
