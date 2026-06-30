"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, Eye, Download, X, FileText } from "lucide-react";
import { clinicDocumentsData, ClinicDocument } from "@/app/data/ClinicDashboardData";
import { toast } from "sonner";

export default function ClinicDocumentsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [documents] = useState<ClinicDocument[]>(clinicDocumentsData);
  const [viewingDoc, setViewingDoc] = useState<ClinicDocument | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredDocs = documents.filter(
    (d) =>
      d.docTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = (doc: ClinicDocument) => {
    toast.success(`Downloading "${doc.docTitle}" for ${doc.patientName}...`);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          All Documents
        </h1>
      </div>

      {/* Search Bar */}
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Patient or document"
          className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-xs sm:text-sm text-[#0F2E4A] placeholder-slate-400 font-semibold transition-all shadow-[0_2px_10px_rgba(0,0,0,0.005)]"
        />
      </div>

      {/* Documents Cards Stack */}
      <div className="space-y-4 pt-2">
        <h2 className="text-sm sm:text-base font-bold text-[#0F2E4A] font-poppins">
          Patient Docoments
        </h2>

        <div className="space-y-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-[0_2px_15px_rgba(0,0,0,0.008)] flex items-center justify-between gap-4"
            >
              {/* Left icon & details */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#E6FAFF] text-[#00B2D6] flex items-center justify-center shrink-0">
                  <FileText size={22} className="stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#0F2E4A] font-poppins">
                    {doc.docTitle}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 font-sans mt-0.5">
                    {doc.patientName}
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-sans mt-1">
                    Generated: {doc.generatedDate} |
                  </p>
                </div>
              </div>

              {/* Right Action Icons */}
              <div className="flex items-center gap-4 pr-2">
                <button
                  type="button"
                  onClick={() => setViewingDoc(doc)}
                  className="text-[#00B2D6] hover:text-[#009cb9] hover:scale-110 active:scale-95 transition-all outline-none border-none bg-transparent cursor-pointer"
                  title="View Document Details"
                >
                  <Eye size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(doc)}
                  className="text-[#00B2D6] hover:text-[#009cb9] hover:scale-110 active:scale-95 transition-all outline-none border-none bg-transparent cursor-pointer"
                  title="Download Document"
                >
                  <Download size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Details Modal Overlay */}
      {viewingDoc && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setViewingDoc(null)}
          />

          <div className="bg-white w-full max-w-[480px] rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-6 sm:p-8 relative z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2E4A] font-poppins">
                Document Details
              </h2>
              <button
                onClick={() => setViewingDoc(null)}
                className="w-9 h-9 rounded-full bg-[#E6FAFF] text-[#00B2D6] hover:bg-[#D0F3FC] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer border-none outline-none"
              >
                <X size={18} className="stroke-[2.5]" />
              </button>
            </div>

            {/* Details Fields */}
            <div className="space-y-4 text-sm sm:text-base text-[#0F2E4A] font-sans mt-6">
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Document Title:</span>
                <span className="font-semibold text-slate-500">{viewingDoc.docTitle}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Patient Name:</span>
                <span className="font-semibold text-slate-500">{viewingDoc.patientName}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Generated:</span>
                <span className="font-semibold text-slate-500">{viewingDoc.generatedDate}</span>
              </div>
            </div>

            {/* Action Footer */}
            <div className="mt-8">
              <button
                onClick={() => setViewingDoc(null)}
                className="w-full py-3 bg-[#00B2D6] hover:bg-[#009cb9] rounded-2xl text-white font-bold text-sm tracking-wide transition-all active:scale-[0.99] shadow-md shadow-cyan-100"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
