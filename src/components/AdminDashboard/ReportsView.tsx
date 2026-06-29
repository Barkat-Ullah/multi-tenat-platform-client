"use client";

import React, { useState, useMemo } from "react";
import { Search, FileText, Eye, Download } from "lucide-react";
import { adminReportsData, ReportItemData } from "@/app/data/AdminDashboardData";
import Pagination from "./Pagination";
import ReportDetailsModal from "./ReportDetailsModal";
import { toast } from "sonner";

export default function ReportsView() {
  const [reports, setReports] = useState<ReportItemData[]>(adminReportsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<ReportItemData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const itemsPerPage = 5;

  // Filter reports based on driver name
  const filteredReports = useMemo(() => {
    return reports.filter((rep) => {
      const term = searchTerm.toLowerCase();
      return rep.driverName.toLowerCase().includes(term);
    });
  }, [reports, searchTerm]);

  // Total pages calculation
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredReports.length / itemsPerPage));
  }, [filteredReports]);

  // Reset page when search term changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Paginated slice
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReports.slice(start, start + itemsPerPage);
  }, [filteredReports, currentPage]);

  const handleDownload = (rep: ReportItemData) => {
    toast.success(`Successfully downloaded report for ${rep.driverName} (PDF)`);
  };

  const handleView = (rep: ReportItemData) => {
    setSelectedReport(rep);
    setIsDetailsOpen(true);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
        All Reports
      </h1>

      {/* Search Input Box */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Search Driver name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-slate-200 bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-sm text-[#0F2E4A] placeholder-slate-400 transition-all font-semibold"
        />
      </div>

      {/* Reports Cards List */}
      {paginatedReports.length > 0 ? (
        <div className="space-y-4">
          {paginatedReports.map((rep) => (
            <div
              key={rep.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] p-4 sm:p-5 flex items-center justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.025)] transition-all duration-300 gap-4"
            >
              {/* Left Group: Icon + Metadata */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-[#E6FAFF] text-[#00B2D6] flex items-center justify-center shrink-0 shadow-sm border border-cyan-50">
                  <FileText size={20} className="stroke-[2.25]" />
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold text-[#0F2E4A] text-sm sm:text-base font-poppins tracking-tight truncate">
                    {rep.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5 truncate">
                    {rep.driverName}
                  </p>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">
                    Generated: {rep.date} | <strong className="font-bold text-[#0F2E4A]">{rep.hospital}</strong>
                  </p>
                </div>
              </div>

              {/* Right Group: Action Icons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleView(rep)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[#00B2D6] hover:bg-[#E6FAFF] active:scale-95 transition-all cursor-pointer border-none outline-none"
                  aria-label="View report details"
                >
                  <Eye size={20} className="stroke-[2.25]" />
                </button>
                <button
                  onClick={() => handleDownload(rep)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[#00B2D6] hover:bg-[#E6FAFF] active:scale-95 transition-all cursor-pointer border-none outline-none"
                  aria-label="Download report PDF"
                >
                  <Download size={20} className="stroke-[2.25]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] p-12 text-center">
          <p className="text-slate-500 font-semibold text-sm">
            No reports found matching your search.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Details Modal overlay */}
      <ReportDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        report={selectedReport}
      />
    </div>
  );
}
