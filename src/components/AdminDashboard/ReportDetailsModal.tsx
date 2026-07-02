"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { AdminMedicalRecord } from "@/redux/service/admin/reportsApi";

interface ReportDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AdminMedicalRecord | null;
}

export default function ReportDetailsModal({
  isOpen,
  onClose,
  report,
}: ReportDetailsModalProps) {
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

  if (!isOpen || !report || !mounted) return null;

  const generatedDate = new Date(report.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const expiryDate = report.expiryDate
    ? new Date(report.expiryDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";
  const driverName = report.driver?.fullName || report.driverId;
  const title = report.booking?.service?.title || "Medical Report";

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
            Report Details
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
            <span className="font-extrabold whitespace-nowrap">Report :</span>
            <span className="font-semibold text-slate-500">{title}</span>
          </div>

          <div className="flex items-start sm:items-center gap-1.5">
            <span className="font-extrabold whitespace-nowrap">Driver Name :</span>
            <span className="font-semibold text-slate-500 break-all">{driverName}</span>
          </div>

          <div className="flex items-start sm:items-center gap-1.5">
            <span className="font-extrabold whitespace-nowrap">Driver ID :</span>
            <span className="font-semibold text-slate-500 break-all">{report.driverId}</span>
          </div>

          <div className="flex items-start sm:items-center gap-1.5">
            <span className="font-extrabold whitespace-nowrap">Clinic :</span>
            <span className="font-semibold text-slate-500 break-all">{report.clinic?.fullName || report.clinic?.email || report.clinicId}</span>
          </div>

          <div className="flex items-start sm:items-center gap-1.5">
            <span className="font-extrabold whitespace-nowrap">Booking ID :</span>
            <span className="font-semibold text-slate-500 break-all">{report.bookingId || "N/A"}</span>
          </div>

          <div className="flex items-start sm:items-center gap-1.5">
            <span className="font-extrabold whitespace-nowrap">Generated On :</span>
            <span className="font-semibold text-slate-500">{generatedDate}</span>
          </div>

          <div className="flex items-start sm:items-center gap-1.5">
            <span className="font-extrabold whitespace-nowrap">Expiry Date :</span>
            <span className="font-semibold text-slate-500">{expiryDate}</span>
          </div>

          <div className="flex items-start sm:items-center gap-1.5">
            <span className="font-extrabold whitespace-nowrap">Status :</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              report.result.toLowerCase() === "submitted"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-amber-50 text-amber-600"
            }`}>
              {report.result}
            </span>
          </div>

          {report.notes && (
            <div className="mt-4 pt-3.5 border-t border-slate-100">
              <span className="font-extrabold block mb-1">Notes:</span>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-2xl">
                {report.notes}
              </p>
            </div>
          )}
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
