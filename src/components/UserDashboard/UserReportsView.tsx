"use client";

import React, { useState, useMemo } from "react";
import { Search, Eye, Download, FileText, X } from "lucide-react";
import { userReportsData, UserReport } from "@/app/data/UserDashboardData";
import { toast } from "sonner";

export default function UserReportsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<UserReport | null>(null);

  // State initialized with centralized mock data
  const [reports] = useState<UserReport[]>(userReportsData);

  const handleDownload = (title: string, id: string) => {
    toast.success(`Downloading ${title} (#${id})...`);
  };

  // Filter reports based on search term
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const search = searchTerm.toLowerCase();
      return (
        r.title.toLowerCase().includes(search) ||
        r.driverName.toLowerCase().includes(search) ||
        r.hospital.toLowerCase().includes(search) ||
        r.id.toLowerCase().includes(search)
      );
    });
  }, [reports, searchTerm]);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
        All Reports
      </h1>

      {/* Search Input Bar */}
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-4.5 w-4.5 text-[#00B2D6]" />
        </span>
        <input
          type="text"
          placeholder="Search Services Document"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-xs sm:text-sm text-[#0F2E4A] placeholder-slate-400 font-semibold transition-all shadow-[0_2px_8px_rgba(0,0,0,0.005)]"
        />
      </div>

      {/* Reports List Cards Container */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-[24px] border border-slate-100/90 p-5 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex items-center justify-between gap-4 transition-all hover:scale-[1.005] hover:shadow-md"
          >
            {/* Left side details */}
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-[#EAF8FC] flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5 text-[#00B2D6]" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm sm:text-base font-extrabold text-[#0F2E4A] font-poppins leading-tight">
                  {report.title}
                </h3>
                <p className="text-xs text-slate-400 font-bold font-sans">
                  {report.driverName}
                </p>
                <p className="text-xs text-slate-400 font-bold font-sans">
                  Generated: {report.date} |{" "}
                  <span className="text-[#00B2D6]">#{report.id}</span>
                </p>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3.5 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedReport(report)}
                className="text-[#00B2D6] hover:scale-110 active:scale-95 transition-all p-1.5 rounded-full hover:bg-slate-50 cursor-pointer border-none bg-transparent outline-none"
                title="View Details"
              >
                <Eye size={18} className="stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={() => handleDownload(report.title, report.id)}
                className="text-[#00B2D6] hover:scale-110 active:scale-95 transition-all p-1.5 rounded-full hover:bg-slate-50 cursor-pointer border-none bg-transparent outline-none"
                title="Download PDF"
              >
                <Download size={18} className="stroke-[2.5]" />
              </button>
            </div>
          </div>
        ))}

        {filteredReports.length === 0 && (
          <div className="text-center py-10 text-sm font-bold text-slate-450 font-sans">
            No matching reports found.
          </div>
        )}
      </div>

      {/* Details View Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setSelectedReport(null)}
          />

          {/* Modal box */}
          <div className="bg-white w-full max-w-[480px] rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-6 sm:p-8 relative z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2E4A] font-poppins">
                Report Details
              </h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="w-9 h-9 rounded-full bg-[#E6FAFF] text-[#00B2D6] hover:bg-[#D0F3FC] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer border-none outline-none"
              >
                <X size={18} className="stroke-[2.5]" />
              </button>
            </div>

            {/* Fields list */}
            <div className="space-y-4 text-sm sm:text-base text-[#0F2E4A] font-sans mt-6">
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Report:</span>
                <span className="font-semibold text-slate-500">{selectedReport.title}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Driver Name:</span>
                <span className="font-semibold text-slate-500">{selectedReport.driverName}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Email:</span>
                <span className="font-semibold text-slate-500">{selectedReport.email}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Client ID:</span>
                <span className="font-semibold text-slate-500">{selectedReport.clientId}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Hospital:</span>
                <span className="font-semibold text-slate-500">{selectedReport.hospital}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Clinician:</span>
                <span className="font-semibold text-slate-500">{selectedReport.clinician}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Generated On:</span>
                <span className="font-semibold text-slate-500">{selectedReport.date}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Status:</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
                  {selectedReport.status}
                </span>
              </div>

              {selectedReport.notes && (
                <div className="mt-4 pt-3.5 border-t border-slate-100">
                  <span className="font-extrabold block mb-1">Notes:</span>
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-2xl">
                    {selectedReport.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Footer close */}
            <div className="mt-8">
              <button
                onClick={() => setSelectedReport(null)}
                className="w-full py-3 bg-[#00B2D6] hover:bg-[#009cb9] rounded-2xl text-white font-bold text-sm tracking-wide transition-all active:scale-[0.99] shadow-md shadow-cyan-100"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
