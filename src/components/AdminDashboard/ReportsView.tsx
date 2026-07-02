"use client";

import React, { useState, useMemo } from "react";
import { Search, FileText, Eye, Download } from "lucide-react";
import Pagination from "./Pagination";
import ReportDetailsModal from "./ReportDetailsModal";
import { toast } from "sonner";
import {
  AdminMedicalRecord,
  useGetAdminReportsQuery,
} from "@/redux/service/admin/reportsApi";

const ITEMS_PER_PAGE = 10;

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const ReportsSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, index) => (
      <div
        key={index}
        className="flex items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-[0_4px_25px_rgba(0,0,0,0.015)] sm:p-5"
      >
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="h-12 w-12 shrink-0 animate-pulse rounded-2xl bg-slate-100" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-48 max-w-full animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-36 animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-64 max-w-full animate-pulse rounded bg-slate-100" />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div className="h-10 w-10 animate-pulse rounded-full bg-slate-100" />
          <div className="h-10 w-10 animate-pulse rounded-full bg-slate-100" />
        </div>
      </div>
    ))}
  </div>
);

export default function ReportsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<AdminMedicalRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data, isLoading, isFetching, isError, refetch } = useGetAdminReportsQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    ...(searchTerm.trim() ? { searchTerm: searchTerm.trim() } : {}),
  });

  const reports = data?.data || [];

  const filteredReports = useMemo(() => {
    return reports.filter((rep) => {
      const term = searchTerm.toLowerCase();
      return [
        rep.driver?.fullName,
        rep.driver?.email,
        rep.driverId,
        rep.clinic?.email,
        rep.clinic?.fullName,
        rep.result,
        rep.notes,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }, [reports, searchTerm]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil((data?.meta.total || 0) / ITEMS_PER_PAGE));
  }, [data?.meta.total]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleDownload = (rep: AdminMedicalRecord) => {
    if (!rep.files) {
      toast.error("No report file available.");
      return;
    }
    window.open(rep.files, "_blank", "noopener,noreferrer");
    toast.success("Report file opened.");
  };

  const handleView = (rep: AdminMedicalRecord) => {
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

      {isLoading || isFetching ? (
        <ReportsSkeleton />
      ) : isError ? (
        <div className="rounded-3xl border border-red-100 bg-white p-12 text-center shadow-[0_4px_25px_rgba(0,0,0,0.015)]">
          <p className="text-sm font-semibold text-red-500">
            Failed to load reports.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-full bg-[#00B2D6] px-5 py-2 text-xs font-bold text-white hover:bg-[#009cb9]"
          >
            Try Again
          </button>
        </div>
      ) : filteredReports.length > 0 ? (
        <div className="space-y-4">
          {filteredReports.map((rep) => {
            const reportTitle = rep.booking?.service?.title || "Medical Report";
            const driverName = rep.driver?.fullName || rep.driverId;

            return (
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
                    {reportTitle}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5 truncate">
                    {driverName}
                  </p>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">
                    Generated: {formatDate(rep.createdAt)} | <strong className="font-bold text-[#0F2E4A]">{rep.clinic?.email || rep.clinicId}</strong>
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
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] p-12 text-center">
          <p className="text-slate-500 font-semibold text-sm">
            No reports found matching your search.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {!isLoading && !isFetching && !isError && totalPages > 1 && (
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
