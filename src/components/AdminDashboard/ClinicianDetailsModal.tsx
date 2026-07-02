"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { AdminClinic } from "@/redux/service/admin/cliniciansApi";

interface ClinicianDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clinician: AdminClinic | null;
}

export default function ClinicianDetailsModal({
  isOpen,
  onClose,
  clinician,
}: ClinicianDetailsModalProps) {
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

  if (!isOpen || !clinician || !mounted) return null;

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
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2E4A] font-poppins">
            Clinician Details
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
        <div className="space-y-4 text-[15px] sm:text-base text-[#0F2E4A] font-sans mt-6">
          <div className="flex items-start gap-1.5">
            <span className="font-extrabold whitespace-nowrap">Name :</span>
            <span className="font-semibold text-slate-500">{clinician.fullName}</span>
          </div>

          <div className="flex items-start sm:items-center gap-1.5">
            <span className="font-extrabold whitespace-nowrap">Email Address :</span>
            <span className="font-semibold text-slate-500">{clinician.email}</span>
          </div>

          <div className="flex items-start sm:items-center gap-1.5">
            <span className="font-extrabold whitespace-nowrap">Phone Number:</span>
            <span className="font-semibold text-slate-500">{clinician.phoneNumber || "N/A"}</span>
          </div>

          <div className="flex items-start sm:items-center gap-1.5">
            <span className="font-extrabold whitespace-nowrap">GMC Number :</span>
            <span className="font-semibold text-slate-500">{clinician.clinicGmcNumber || "N/A"}</span>
          </div>

          <div className="flex items-start sm:items-center gap-1.5">
            <span className="font-extrabold whitespace-nowrap">Assigned Location :</span>
            <span className="font-semibold text-slate-500">{clinician.location?.locationName || "N/A"}</span>
          </div>

          <div className="flex items-start sm:items-center gap-1.5">
            <span className="font-extrabold whitespace-nowrap">Services :</span>
            <span className="font-semibold text-slate-500">
              {clinician.services?.map((service) => service.title).join(", ") || "N/A"}
            </span>
          </div>

          <div className="flex items-start sm:items-center gap-1.5">
            <span className="font-extrabold whitespace-nowrap">Parking :</span>
            <span className="font-semibold text-slate-500">{clinician.isParking ? "Available" : "Not available"}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#00B2D6] hover:bg-[#009cb9] rounded-2xl text-white font-bold text-sm tracking-wide transition-all active:scale-[0.99] shadow-md shadow-cyan-100"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
