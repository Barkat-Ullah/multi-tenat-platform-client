"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Search, Eye, Download, FileText, X } from "lucide-react";
import { toast } from "sonner";
import {
  MedicalRecordItem,
  useGetMyMedicalRecordsQuery,
} from "@/redux/service/user/userDashboardApi";

interface ReportRow {
  id: string;
  title: string;
  driverName: string;
  email: string;
  driverId: string;
  clinicId: string;
  bookingId: string;
  date: string;
  expiryDate: string;
  status: string;
  notes?: string | null;
  files: string[];
}

const formatDate = (dateValue?: string | null) => {
  if (!dateValue) return "N/A";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatStatus = (status: string) =>
  status
    .replace(/_/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const normalizeFiles = (files?: string | string[] | null) => {
  if (!files) return [];
  if (Array.isArray(files)) return files.filter(Boolean);

  return files
    .split(",")
    .map((file) => file.trim())
    .filter(Boolean);
};

const mapMedicalRecordToReport = (record: MedicalRecordItem): ReportRow => {
  const booking = record.booking;
  const serviceTitle =
    booking?.service?.title ||
    record.organizerRequest?.service?.title ||
    "Medical Report";
  const clinic = record.clinic || booking?.clinic;
  const driver = record.driver || booking?.driver;

  return {
    id: record.id,
    title: serviceTitle,
    driverName: driver?.fullName || record.driverId,
    email: driver?.email || "N/A",
    driverId: record.driverId || driver?.id || "N/A",
    clinicId: record.clinicId || clinic?.id || "N/A",
    bookingId: record.bookingId || booking?.id || "N/A",
    date: formatDate(record.createdAt),
    expiryDate: formatDate(record.expiryDate),
    status: formatStatus(record.result),
    notes: record.notes,
    files: normalizeFiles(record.files),
  };
};

const getStatusClassName = (status: string) => {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "submitted") {
    return "bg-emerald-50 text-emerald-600";
  }

  return "bg-amber-50 text-amber-600";
};

const ReportsListSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, index) => (
      <div
        key={index}
        className="animate-pulse bg-white rounded-[24px] border border-slate-100/90 p-5 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="w-11 h-11 rounded-full bg-slate-200 shrink-0" />
          <div className="space-y-2.5 min-w-0 flex-1">
            <div className="h-3.5 w-44 max-w-full rounded-full bg-slate-200" />
            <div className="h-2.5 w-32 rounded-full bg-slate-100" />
            <div className="h-2.5 w-64 max-w-full rounded-full bg-slate-100" />
          </div>
        </div>
        <div className="flex items-center gap-3.5 shrink-0">
          <div className="h-8 w-8 rounded-full bg-slate-100" />
          <div className="h-8 w-8 rounded-full bg-slate-100" />
        </div>
      </div>
    ))}
  </div>
);

export default function UserReportsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<ReportRow | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { data, isLoading, isFetching, isError, refetch } =
    useGetMyMedicalRecordsQuery();
  const isReportsLoading = isLoading || isFetching;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const reports = useMemo(
    () => (data?.data || []).map(mapMedicalRecordToReport),
    [data?.data],
  );

  const handleDownload = (report: ReportRow) => {
    const [fileUrl] = report.files;

    if (!fileUrl) {
      toast.info("No report file available for download.");
      return;
    }

    window.open(fileUrl, "_blank", "noopener,noreferrer");
    toast.success(`Opening ${report.title} (#${report.id})...`);
  };

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const search = searchTerm.toLowerCase();
      return (
        r.title.toLowerCase().includes(search) ||
        r.driverName.toLowerCase().includes(search) ||
        r.driverId.toLowerCase().includes(search) ||
        r.clinicId.toLowerCase().includes(search) ||
        r.bookingId.toLowerCase().includes(search) ||
        r.id.toLowerCase().includes(search)
      );
    });
  }, [reports, searchTerm]);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
        All Reports
      </h1>

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

      <div className="space-y-4">
        {isReportsLoading && <ReportsListSkeleton />}

        {isError && !isReportsLoading && (
          <div className="text-center py-10">
            <p className="text-sm font-bold text-red-500">
              Failed to load reports.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 rounded-full bg-[#00B2D6] px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#0092B0]"
            >
              Try Again
            </button>
          </div>
        )}

        {!isReportsLoading &&
          !isError &&
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-[24px] border border-slate-100/90 p-5 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex items-center justify-between gap-4 transition-all hover:scale-[1.005] hover:shadow-md"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-11 h-11 rounded-full bg-[#EAF8FC] flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-[#00B2D6]" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h3 className="text-sm sm:text-base font-extrabold text-[#0F2E4A] font-poppins leading-tight truncate">
                    {report.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold font-sans truncate">
                    {report.driverName}
                  </p>
                  <p className="text-xs text-slate-400 font-bold font-sans">
                    Generated: {report.date} |{" "}
                    <span className="text-[#00B2D6]">#{report.id}</span>
                  </p>
                </div>
              </div>

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
                  onClick={() => handleDownload(report)}
                  className="text-[#00B2D6] hover:scale-110 active:scale-95 transition-all p-1.5 rounded-full hover:bg-slate-50 cursor-pointer border-none bg-transparent outline-none"
                  title="Download PDF"
                >
                  <Download size={18} className="stroke-[2.5]" />
                </button>
              </div>
            </div>
          ))}

        {!isReportsLoading && !isError && filteredReports.length === 0 && (
          <div className="text-center py-10 text-sm font-bold text-slate-450 font-sans">
            No matching reports found.
          </div>
        )}
      </div>

      {selectedReport &&
        isMounted &&
        createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setSelectedReport(null)}
          />

          <div className="bg-white w-full max-w-[480px] rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-6 sm:p-8 relative z-10 animate-in fade-in zoom-in-95 duration-200">
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
                <span className="font-extrabold whitespace-nowrap">Driver ID:</span>
                <span className="font-semibold text-slate-500 break-all">{selectedReport.driverId}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Clinic ID:</span>
                <span className="font-semibold text-slate-500 break-all">{selectedReport.clinicId}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Booking ID:</span>
                <span className="font-semibold text-slate-500 break-all">{selectedReport.bookingId}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Generated On:</span>
                <span className="font-semibold text-slate-500">{selectedReport.date}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Expiry Date:</span>
                <span className="font-semibold text-slate-500">{selectedReport.expiryDate}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Status:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusClassName(
                    selectedReport.status,
                  )}`}
                >
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

            <div className="mt-8">
              <button
                onClick={() => setSelectedReport(null)}
                className="w-full py-3 bg-[#00B2D6] hover:bg-[#009cb9] rounded-2xl text-white font-bold text-sm tracking-wide transition-all active:scale-[0.99] shadow-md shadow-cyan-100"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>,
          document.body,
        )}
    </div>
  );
}
