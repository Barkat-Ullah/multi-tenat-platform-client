"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

interface Step5SuccessProps {
  selectedType: string | null;
  selectedClinic: any;
  formData: any;
}

export default function Step5Success({
  selectedType,
  selectedClinic,
  formData
}: Step5SuccessProps) {
  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center shadow-lg shadow-slate-100 flex flex-col items-center">
        
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6">
          <CheckCircle2 size={40} className="stroke-[2.5]" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] tracking-tight leading-tight">
          Booking Requested!
        </h2>
        <p className="text-[#55697A] text-sm sm:text-base font-semibold mt-3 max-w-sm">
          We have received your appointment request. Our medical bookings team will contact you shortly.
        </p>

        {/* Appointment Summary details Card */}
        <div className="w-full bg-[#FCFDFE] border border-slate-100 rounded-2xl p-5 my-8 text-left space-y-3.5">
          <div className="flex justify-between items-center text-xs sm:text-sm border-b border-slate-100 pb-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Medical Assessment</span>
            <span className="text-[#00B2D6] font-extrabold">{selectedType}</span>
          </div>
          <div className="flex justify-between items-center text-xs sm:text-sm border-b border-slate-100 pb-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Clinic Location</span>
            <span className="text-[#0F2E4A] font-extrabold text-right">{selectedClinic?.name || "Aberdeen"}</span>
          </div>
          <div className="flex justify-between items-center text-xs sm:text-sm border-b border-slate-100 pb-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Preferred Date</span>
            <span className="text-[#0F2E4A] font-extrabold">{formData.date}</span>
          </div>
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Preferred Slot</span>
            <span className="text-[#0F2E4A] font-extrabold">{formData.timeSlot}</span>
          </div>
        </div>

        <Link
          href="/"
          className="px-8 py-3.5 rounded-full bg-[#00B2D6] hover:bg-[#0092B3] text-white font-bold text-sm sm:text-base transition-colors shrink-0 shadow-sm"
        >
          Back to Home Page
        </Link>
      </div>
    </div>
  );
}
