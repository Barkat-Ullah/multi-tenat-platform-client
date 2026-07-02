"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Download, Eye, Search, X } from "lucide-react";
import {
  type ClinicMedicalFormRecord,
  useGetClinicMedicalFormsQuery,
} from "@/redux/service/clinic/clinicMedicalFormsApi";

const PAGE_LIMIT = 10;

const formatDate = (value?: string | null, includeTime = false) => {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(includeTime
      ? { hour: "numeric", minute: "2-digit", hour12: true }
      : {}),
  }).format(date);
};

const formatStatus = (status?: string) => {
  if (!status) return "N/A";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

const getStatusClassName = (status?: string) =>
  status?.toLowerCase() === "submitted"
    ? "border-emerald-100 bg-emerald-50 text-emerald-600"
    : "border-amber-100 bg-amber-50 text-amber-600";

const shortenId = (id?: string | null) => {
  if (!id) return "N/A";
  return id.length > 12 ? `${id.slice(0, 6)}...${id.slice(-4)}` : id;
};

const MedicalFormsSkeleton = () => (
  <tbody className="divide-y divide-slate-100/80" aria-label="Loading medical forms">
    {Array.from({ length: 6 }, (_, rowIndex) => (
      <tr key={rowIndex} className="animate-pulse">
        {[24, 30, 32, 32, 28].map((width, index) => (
          <td key={index} className="px-6 py-5">
            <div
              className="h-2.5 rounded-full bg-slate-200"
              style={{ width: `${width + (rowIndex % 3) * 5}%` }}
            />
          </td>
        ))}
        <td className="px-6 py-5 text-center">
          <div className="mx-auto h-6 w-20 rounded-full bg-slate-200" />
        </td>
        <td className="px-6 py-5 text-center">
          <div className="mx-auto h-5 w-14 rounded-full bg-slate-200" />
        </td>
      </tr>
    ))}
  </tbody>
);

export default function ClinicMedicalFormsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [viewingForm, setViewingForm] =
    useState<ClinicMedicalFormRecord | null>(null);
  const [mounted, setMounted] = useState(false);

  const {
    data: formsResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetClinicMedicalFormsQuery({ page, limit: PAGE_LIMIT });

  useEffect(() => {
    setMounted(true);
  }, []);

  const forms = formsResponse?.data || [];
  const filteredForms = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return forms;

    return forms.filter((form) =>
      [
        form.id,
        form.driverId,
        form.bookingId,
        form.organizerRequestId,
        form.result,
        form.notes,
        form.clinic?.email,
      ].some((value) => value?.toLowerCase().includes(query)),
    );
  }, [forms, searchQuery]);

  const total = formsResponse?.meta.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));
  const firstVisiblePage = Math.max(1, Math.min(page - 2, totalPages - 4));
  const visiblePages = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => firstVisiblePage + index,
  );

  return (
    <div className="w-full space-y-6 p-4 md:p-6 lg:p-8">
      <h1 className="font-poppins text-2xl font-extrabold tracking-tight text-[#0F2E4A] sm:text-3xl">
        Medical Forms
      </h1>

      <div className="relative w-full">
        <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
          <Search size={18} />
        </span>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search Medical Records"
          className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 py-3.5 pl-12 pr-4 text-xs font-semibold text-[#0F2E4A] placeholder:text-slate-400 focus:border-[#00B2D6] focus:outline-none focus:ring-1 focus:ring-[#00B2D6] sm:text-sm"
        />
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-poppins text-xl font-extrabold tracking-tight text-[#0F2E4A] sm:text-2xl">
            Medical Records
          </h2>
          {!isLoading && !isError && (
            <span className="text-xs font-semibold text-slate-400">
              {total} {total === 1 ? "record" : "records"}
            </span>
          )}
        </div>

        <div className="overflow-hidden rounded-[24px] border border-slate-100/90 bg-white shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1080px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#00B2D6] bg-white">
                  <th className="w-[13%] px-6 py-4 text-xs font-bold text-[#0F2E4A] sm:text-sm">Record ID</th>
                  <th className="w-[16%] px-6 py-4 text-xs font-bold text-[#0F2E4A] sm:text-sm">Driver ID</th>
                  <th className="w-[15%] px-6 py-4 text-xs font-bold text-[#0F2E4A] sm:text-sm">Booking ID</th>
                  <th className="w-[17%] px-6 py-4 text-xs font-bold text-[#0F2E4A] sm:text-sm">Created On</th>
                  <th className="w-[15%] px-6 py-4 text-xs font-bold text-[#0F2E4A] sm:text-sm">Expiry Date</th>
                  <th className="w-[12%] px-6 py-4 text-center text-xs font-bold text-[#0F2E4A] sm:text-sm">Status</th>
                  <th className="w-[12%] px-6 py-4 text-center text-xs font-bold text-[#0F2E4A] sm:text-sm">Actions</th>
                </tr>
              </thead>

              {isLoading || isFetching ? (
                <MedicalFormsSkeleton />
              ) : (
                <tbody className="divide-y divide-slate-100/80">
                  {filteredForms.map((form) => (
                    <tr key={form.id} className="transition-colors hover:bg-slate-50/40">
                      <td className="px-6 py-3.5 text-xs font-bold text-[#0F2E4A] sm:text-sm" title={form.id}>{shortenId(form.id)}</td>
                      <td className="px-6 py-3.5 text-xs font-semibold text-slate-500 sm:text-sm" title={form.driverId}>{shortenId(form.driverId)}</td>
                      <td className="px-6 py-3.5 text-xs font-semibold text-slate-500 sm:text-sm" title={form.bookingId || undefined}>{shortenId(form.bookingId)}</td>
                      <td className="px-6 py-3.5 text-xs font-semibold text-slate-500 sm:text-sm">{formatDate(form.createdAt, true)}</td>
                      <td className="px-6 py-3.5 text-xs font-semibold text-slate-500 sm:text-sm">{formatDate(form.expiryDate)}</td>
                      <td className="px-6 py-3.5 text-center">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider sm:text-xs ${getStatusClassName(form.result)}`}>
                          {formatStatus(form.result)}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            type="button"
                            onClick={() => setViewingForm(form)}
                            aria-label="View medical record"
                            title="View details"
                            className="text-[#00B2D6] transition-colors hover:text-[#009cb9]"
                          >
                            <Eye size={18} />
                          </button>
                          {form.files ? (
                            <a
                              href={form.files}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              aria-label="Download medical document"
                              title="Download document"
                              className="text-[#00B2D6] transition-colors hover:text-[#009cb9]"
                            >
                              <Download size={18} />
                            </a>
                          ) : (
                            <span className="cursor-not-allowed text-slate-300" title="No document available">
                              <Download size={18} />
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>

            {!isLoading && !isFetching && isError && (
              <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 border-t border-slate-100 text-center">
                <p className="text-sm font-bold text-red-500">Failed to load medical records.</p>
                <button type="button" onClick={() => refetch()} className="rounded-full bg-[#00B2D6] px-5 py-2 text-xs font-bold text-white hover:bg-[#009cb9]">Try Again</button>
              </div>
            )}

            {!isLoading && !isFetching && !isError && filteredForms.length === 0 && (
              <div className="flex min-h-[260px] items-center justify-center border-t border-slate-100 px-6 text-center">
                <p className="text-sm font-semibold text-slate-400">
                  {searchQuery.trim() ? "No medical records match your search." : "No medical records found."}
                </p>
              </div>
            )}
          </div>
        </div>

        {!isLoading && !isError && totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1 || isFetching}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
            >
              <ChevronLeft size={14} /><span>Previous</span>
            </button>
            {visiblePages.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                disabled={isFetching}
                aria-label={`Page ${pageNumber}`}
                aria-current={pageNumber === page ? "page" : undefined}
                className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold ${pageNumber === page ? "border-[#00B2D6] bg-[#00B2D6] text-white" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page === totalPages || isFetching}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
            >
              <span>Next</span><ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {viewingForm && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <button type="button" aria-label="Close medical record details" className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setViewingForm(null)} />
          <div className="relative z-10 w-full max-w-[520px] rounded-[32px] border border-slate-100 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] animate-in fade-in zoom-in-95 sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <h2 className="font-poppins text-xl font-extrabold text-[#0F2E4A] sm:text-2xl">Medical Record Details</h2>
              <button type="button" onClick={() => setViewingForm(null)} aria-label="Close medical record details" title="Close" className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-50 text-[#00B2D6] hover:bg-cyan-100">
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 text-sm text-[#0F2E4A] sm:grid-cols-2 sm:text-base">
              <div><span className="block text-xs font-bold text-slate-400">Record ID</span><span className="break-all font-semibold">{viewingForm.id}</span></div>
              <div><span className="block text-xs font-bold text-slate-400">Driver ID</span><span className="break-all font-semibold">{viewingForm.driverId}</span></div>
              <div><span className="block text-xs font-bold text-slate-400">Booking ID</span><span className="break-all font-semibold">{viewingForm.bookingId || "N/A"}</span></div>
              <div><span className="block text-xs font-bold text-slate-400">Clinic Email</span><span className="break-all font-semibold">{viewingForm.clinic?.email || "N/A"}</span></div>
              <div><span className="block text-xs font-bold text-slate-400">Created On</span><span className="font-semibold">{formatDate(viewingForm.createdAt, true)}</span></div>
              <div><span className="block text-xs font-bold text-slate-400">Expiry Date</span><span className="font-semibold">{formatDate(viewingForm.expiryDate)}</span></div>
              <div className="sm:col-span-2"><span className="block text-xs font-bold text-slate-400">Notes</span><span className="font-semibold">{viewingForm.notes || "N/A"}</span></div>
              <div><span className="block text-xs font-bold text-slate-400">Result</span><span className={`mt-1 inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase ${getStatusClassName(viewingForm.result)}`}>{formatStatus(viewingForm.result)}</span></div>
              <div><span className="block text-xs font-bold text-slate-400">Document</span>{viewingForm.files ? <a href={viewingForm.files} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1.5 font-bold text-[#00B2D6] hover:text-[#009cb9]"><Download size={15} />Download</a> : <span className="font-semibold">N/A</span>}</div>
            </div>

            <button type="button" onClick={() => setViewingForm(null)} className="mt-8 w-full rounded-2xl bg-[#00B2D6] py-3 text-sm font-bold text-white shadow-md shadow-cyan-100 hover:bg-[#009cb9]">Close Record</button>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
