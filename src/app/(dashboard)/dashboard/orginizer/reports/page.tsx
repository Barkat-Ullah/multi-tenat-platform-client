"use client";

import React from "react";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";

export default function OrganizerReportsPage() {
  const reports = [
    { id: "rp-1", title: "Monthly Compliance Summary", date: "28 May 2025", size: "1.4 MB" },
    { id: "rp-2", title: "Driver Medical Audits", date: "15 May 2025", size: "950 KB" },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
        Reports
      </h1>

      <div className="space-y-4">
        {reports.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-[#EAF8FC] flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5 text-[#00B2D6]" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-[#0F2E4A] font-poppins leading-tight">
                  {r.title}
                </h3>
                <p className="text-xs text-slate-400 font-bold font-sans">
                  Generated: {r.date} | Size: {r.size}
                </p>
              </div>
            </div>

            <button
              onClick={() => toast.success(`Downloading ${r.title}...`)}
              className="text-[#00B2D6] hover:scale-110 active:scale-95 transition-all p-1.5 rounded-full hover:bg-slate-50 border-none bg-transparent outline-none cursor-pointer"
            >
              <Download size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
