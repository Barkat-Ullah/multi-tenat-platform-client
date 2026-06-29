"use client";

import React, { useState } from "react";
import { ClipboardPlus, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function OrganizerServicesRequestPage() {
  const [driverName, setDriverName] = useState("");
  const [serviceType, setServiceType] = useState("HGV D4 Medical");
  const [preferredDate, setPreferredDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverName.trim() || !preferredDate.trim()) {
      toast.error("Please fill in all details.");
      return;
    }
    toast.success(`Service request submitted for ${driverName}!`);
    setDriverName("");
    setPreferredDate("");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
        Services Request
      </h1>

      <div className="bg-white rounded-[24px] border border-slate-100 p-6 md:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.01)] max-w-2xl">
        <h2 className="text-[#0F2E4A] text-lg font-extrabold font-poppins pb-4 border-b border-slate-100 flex items-center gap-2">
          <ClipboardPlus className="text-[#00B2D6]" />
          <span>New Driver Medical Request</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div>
            <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
              Driver Name
            </label>
            <input
              type="text"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B2D6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
              Medical Service Type
            </label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B2D6]"
            >
              <option>HGV D4 Medical</option>
              <option>Taxi Medical</option>
              <option>Occupational Health Assessment</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
              Preferred Date
            </label>
            <input
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B2D6]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#00B2D6] hover:bg-[#009cb9] rounded-xl text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2"
          >
            <span>Submit Request</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
