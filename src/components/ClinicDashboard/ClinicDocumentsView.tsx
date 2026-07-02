"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Download, Eye, FileText, Search, X } from "lucide-react";
import {
  type ClinicMedicalFormRecord,
  useGetClinicMedicalFormsQuery,
} from "@/redux/service/clinic/clinicMedicalFormsApi";

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

const shortenId = (id: string) =>
  id.length > 16 ? `${id.slice(0, 8)}...${id.slice(-5)}` : id;

const DocumentsSkeleton = () => (
  <div className="space-y-4" role="status" aria-label="Loading documents">
    {Array.from({ length: 5 }, (_, index) => (
      <div
        key={index}
        className="flex h-[104px] animate-pulse items-center justify-between gap-4 rounded-[24px] border border-slate-100 bg-white p-5"
      >
        <div className="flex min-w-0 items-center gap-4">
          <div className="h-12 w-12 shrink-0 rounded-2xl bg-slate-200" />
          <div className="space-y-2.5">
            <div className="h-3 w-44 rounded-full bg-slate-200" />
            <div className="h-2.5 w-32 rounded-full bg-slate-100" />
            <div className="h-2 w-24 rounded-full bg-slate-100" />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="h-5 w-5 rounded bg-slate-200" />
          <div className="h-5 w-5 rounded bg-slate-200" />
        </div>
      </div>
    ))}
    <span className="sr-only">Loading documents...</span>
  </div>
);

export default function ClinicDocumentsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingDocument, setViewingDocument] =
    useState<ClinicMedicalFormRecord | null>(null);
  const [mounted, setMounted] = useState(false);

  const {
    data: recordsResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetClinicMedicalFormsQuery({ page: 1, limit: 100 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const submittedDocuments = useMemo(
    () =>
      (recordsResponse?.data || []).filter(
        (record) => record.result.trim().toLowerCase() === "submitted",
      ),
    [recordsResponse],
  );

  const filteredDocuments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return submittedDocuments;

    return submittedDocuments.filter((record) =>
      [
        record.id,
        record.driverId,
        record.bookingId,
        record.organizerRequestId,
        record.notes,
        record.clinic?.email,
      ].some((value) => value?.toLowerCase().includes(query)),
    );
  }, [searchQuery, submittedDocuments]);

  return (
    <div className="w-full space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex items-end justify-between gap-4">
        <h1 className="font-poppins text-2xl font-extrabold tracking-tight text-[#0F2E4A] sm:text-3xl">
          All Documents
        </h1>
        {!isLoading && !isError && (
          <span className="text-xs font-semibold text-slate-400">
            {submittedDocuments.length}{" "}
            {submittedDocuments.length === 1 ? "document" : "documents"}
          </span>
        )}
      </div>

      <div className="relative w-full">
        <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
          <Search size={18} />
        </span>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search Documents"
          className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 py-3.5 pl-12 pr-4 text-xs font-semibold text-[#0F2E4A] placeholder:text-slate-400 focus:border-[#00B2D6] focus:outline-none focus:ring-1 focus:ring-[#00B2D6] sm:text-sm"
        />
      </div>

      <div className="space-y-4 pt-2">
        <h2 className="font-poppins text-sm font-bold text-[#0F2E4A] sm:text-base">
          Patient Documents
        </h2>

        {isLoading || isFetching ? (
          <DocumentsSkeleton />
        ) : isError ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-[24px] border border-slate-100 bg-white text-center">
            <p className="text-sm font-bold text-red-500">
              Failed to load documents.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-full bg-[#00B2D6] px-5 py-2 text-xs font-bold text-white hover:bg-[#009cb9]"
            >
              Try Again
            </button>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="flex min-h-[280px] items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-white px-6 text-center">
            <p className="text-sm font-semibold text-slate-400">
              {searchQuery.trim()
                ? "No submitted documents match your search."
                : "No submitted documents found."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDocuments.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between gap-4 rounded-[24px] border border-slate-100 bg-white p-5 shadow-[0_2px_15px_rgba(0,0,0,0.008)]"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E6FAFF] text-[#00B2D6]">
                    <FileText size={22} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-poppins text-sm font-extrabold text-[#0F2E4A] sm:text-base">
                      Medical Certificate
                    </h3>
                    <p
                      className="mt-0.5 truncate text-xs font-semibold text-slate-400"
                      title={document.driverId}
                    >
                      Driver: {shortenId(document.driverId)}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400 sm:text-xs">
                      Generated: {formatDate(document.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-4 pr-2">
                  <button
                    type="button"
                    onClick={() => setViewingDocument(document)}
                    aria-label="View document details"
                    title="View details"
                    className="text-[#00B2D6] transition-colors hover:text-[#009cb9]"
                  >
                    <Eye size={20} />
                  </button>
                  {document.files ? (
                    <a
                      href={document.files}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      aria-label="Download medical document"
                      title="Download document"
                      className="text-[#00B2D6] transition-colors hover:text-[#009cb9]"
                    >
                      <Download size={20} />
                    </a>
                  ) : (
                    <span
                      className="cursor-not-allowed text-slate-300"
                      title="No document available"
                    >
                      <Download size={20} />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {viewingDocument &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <button
              type="button"
              aria-label="Close document details"
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
              onClick={() => setViewingDocument(null)}
            />
            <div className="relative z-10 w-full max-w-[520px] rounded-[32px] border border-slate-100 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] animate-in fade-in zoom-in-95 sm:p-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                <h2 className="font-poppins text-xl font-extrabold text-[#0F2E4A] sm:text-2xl">
                  Document Details
                </h2>
                <button
                  type="button"
                  onClick={() => setViewingDocument(null)}
                  aria-label="Close document details"
                  title="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-50 text-[#00B2D6] hover:bg-cyan-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 text-sm text-[#0F2E4A] sm:grid-cols-2 sm:text-base">
                <div>
                  <span className="block text-xs font-bold text-slate-400">Record ID</span>
                  <span className="break-all font-semibold">{viewingDocument.id}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400">Driver ID</span>
                  <span className="break-all font-semibold">{viewingDocument.driverId}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400">Booking ID</span>
                  <span className="break-all font-semibold">{viewingDocument.bookingId || "N/A"}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400">Clinic Email</span>
                  <span className="break-all font-semibold">{viewingDocument.clinic?.email || "N/A"}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400">Generated On</span>
                  <span className="font-semibold">{formatDate(viewingDocument.createdAt, true)}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400">Expiry Date</span>
                  <span className="font-semibold">{formatDate(viewingDocument.expiryDate)}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="block text-xs font-bold text-slate-400">Notes</span>
                  <span className="font-semibold">{viewingDocument.notes || "N/A"}</span>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                {viewingDocument.files && (
                  <a
                    href={viewingDocument.files}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#00B2D6] py-3 text-sm font-bold text-white hover:bg-[#009cb9]"
                  >
                    <Download size={17} />
                    Download
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setViewingDocument(null)}
                  className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-bold text-[#0F2E4A] hover:bg-slate-50"
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
