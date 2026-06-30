"use client";

import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, FileText, Eye, Download, X } from "lucide-react";
import { organizerReportsData, OrganizerReport } from "@/app/data/OrganizerDashboardData";
import { toast } from "sonner";

export default function OrganizerReportsView() {
  const [reports] = useState<OrganizerReport[]>(organizerReportsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingReport, setViewingReport] = useState<OrganizerReport | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter list
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const search = searchTerm.toLowerCase();
      return (
        r.title.toLowerCase().includes(search) ||
        r.driverName.toLowerCase().includes(search) ||
        r.hospitalName.toLowerCase().includes(search)
      );
    });
  }, [reports, searchTerm]);

  // Download simulation handler
  const handleDownload = (report: OrganizerReport) => {
    toast.success(`Downloading report certificate "${report.title}" for ${report.driverName}...`);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          All Reports
        </h1>
      </div>

      {/* Search Input Bar */}
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-4.5 w-4.5 text-[#00B2D6]" />
        </span>
        <input
          type="text"
          placeholder="Search Report"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-xs sm:text-sm text-[#0F2E4A] placeholder-slate-400 font-semibold transition-all"
        />
      </div>

      {/* Reports vertical cards wrapper */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="flex items-center justify-between p-4 sm:p-5 bg-white border border-slate-100 rounded-[20px] shadow-[0_4px_25px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.02)] transition-shadow duration-200 gap-4"
          >
            {/* Left Content Column */}
            <div className="flex items-center gap-4 min-w-0">
              {/* Document Icon Badge */}
              <div className="w-12 h-12 rounded-[16px] bg-[#EAF8FC] text-[#00B2D6] flex items-center justify-center shrink-0">
                <FileText size={22} className="stroke-[2]" />
              </div>

              {/* Text metadata */}
              <div className="min-w-0 font-sans">
                <h3 className="text-sm sm:text-base font-extrabold text-[#0F2E4A] font-poppins truncate">
                  {report.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-0.5 truncate">
                  {report.driverName}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1 truncate">
                  Generated: {report.dateGenerated} | <span className="font-bold text-[#0F2E4A]">{report.hospitalName}</span>
                </p>
              </div>
            </div>

            {/* Right Action Icons Column */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              {/* View details */}
              <button
                onClick={() => setViewingReport(report)}
                className="w-10 h-10 rounded-full bg-slate-50 hover:bg-[#EAF8FC] hover:text-[#00B2D6] text-slate-400 transition-all flex items-center justify-center cursor-pointer border-none outline-none active:scale-95"
              >
                <Eye size={18} className="stroke-[2.5]" />
              </button>

              {/* Download mock */}
              <button
                onClick={() => handleDownload(report)}
                className="w-10 h-10 rounded-full bg-slate-50 hover:bg-[#EAF8FC] hover:text-[#00B2D6] text-slate-400 transition-all flex items-center justify-center cursor-pointer border-none outline-none active:scale-95"
              >
                <Download size={18} className="stroke-[2.5]" />
              </button>
            </div>
          </div>
        ))}

        {filteredReports.length === 0 && (
          <div className="py-12 text-center text-sm font-bold text-slate-400 font-sans">
            No report files matching search criteria.
          </div>
        )}
      </div>

      {/* Viewing Details Modal (rendered via React Portal) */}
      {viewingReport && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setViewingReport(null)}
          />

          <div className="bg-white w-full max-w-[480px] rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-6 sm:p-8 relative z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2E4A] font-poppins">
                Report Details
              </h2>
              <button
                onClick={() => setViewingReport(null)}
                className="w-9 h-9 rounded-full bg-[#E6FAFF] text-[#00B2D6] hover:bg-[#D0F3FC] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer border-none outline-none"
              >
                <X size={18} className="stroke-[2.5]" />
              </button>
            </div>

            {/* Details Fields */}
            <div className="space-y-4 text-sm sm:text-base text-[#0F2E4A] font-sans mt-6">
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Report Title:</span>
                <span className="font-semibold text-slate-500">{viewingReport.title}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Driver:</span>
                <span className="font-semibold text-slate-500">{viewingReport.driverName}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Hospital/Clinic:</span>
                <span className="font-semibold text-slate-500">{viewingReport.hospitalName}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Generated:</span>
                <span className="font-semibold text-slate-500">{viewingReport.dateGenerated}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Format:</span>
                <span className="font-semibold text-slate-500">PDF Certificate</span>
              </div>
            </div>

            {/* Action Footer */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => handleDownload(viewingReport)}
                className="flex-1 py-3 bg-[#00B2D6] hover:bg-[#009cb9] rounded-2xl text-white font-bold text-sm tracking-wide transition-all active:scale-[0.99] shadow-md shadow-cyan-100 flex items-center justify-center gap-2"
              >
                <Download size={16} />
                <span>Download</span>
              </button>
              <button
                onClick={() => setViewingReport(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-600 font-bold text-sm tracking-wide transition-all active:scale-[0.99]"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
