"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Search,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  type ClinicCorporateRequest,
  type CorporateDriver,
  useGetClinicCorporatesQuery,
  useUploadCorporateDriverRecordMutation,
} from "@/redux/service/clinic/clinicCorporatesApi";

const PAGE_LIMIT = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png"];

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error !== "object" || error === null) return fallback;

  const apiError = error as {
    data?: { message?: string };
    error?: string;
    message?: string;
  };

  return apiError.data?.message || apiError.error || apiError.message || fallback;
};

const getStatusClassName = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "border-emerald-100 bg-emerald-50 text-emerald-600";
    case "canceled":
    case "cancelled":
      return "border-red-100 bg-red-50 text-red-500";
    default:
      return "border-amber-100 bg-amber-50 text-amber-600";
  }
};

const TableSkeleton = ({ columns }: { columns: number }) => (
  <tbody className="divide-y divide-slate-100/80" aria-label="Loading records">
    {Array.from({ length: 6 }, (_, rowIndex) => (
      <tr key={rowIndex} className="animate-pulse">
        {Array.from({ length: columns }, (_, columnIndex) => (
          <td key={columnIndex} className="px-6 py-5">
            <div
              className={`h-2.5 rounded-full bg-slate-200 ${
                columnIndex === columns - 1 ? "mx-auto w-20" : "w-2/3"
              }`}
            />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);

export default function ClinicCorporatesView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [driverSearch, setDriverSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCorporate, setSelectedCorporate] =
    useState<ClinicCorporateRequest | null>(null);
  const [uploadingDriver, setUploadingDriver] =
    useState<CorporateDriver | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    data: corporateResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetClinicCorporatesQuery({ page, limit: PAGE_LIMIT });
  const [uploadCorporateDriverRecord, { isLoading: isUploading }] =
    useUploadCorporateDriverRecordMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const corporates = corporateResponse?.data || [];
  const filteredCorporates = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return corporates;

    return corporates.filter((corporate) =>
      [
        corporate.companyName,
        corporate.email,
        corporate.service?.title,
        corporate.location,
        corporate.status,
      ].some((value) => value?.toLowerCase().includes(query)),
    );
  }, [corporates, searchQuery]);

  const filteredDrivers = useMemo(() => {
    const drivers = selectedCorporate?.drivers || [];
    const query = driverSearch.trim().toLowerCase();
    if (!query) return drivers;

    return drivers.filter(({ driver }) =>
      [driver.fullName, driver.email, driver.phoneNumber].some((value) =>
        value?.toLowerCase().includes(query),
      ),
    );
  }, [driverSearch, selectedCorporate]);

  const total = corporateResponse?.meta.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));
  const firstVisiblePage = Math.max(1, Math.min(page - 2, totalPages - 4));
  const visiblePages = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => firstVisiblePage + index,
  );

  const closeUploadModal = () => {
    setUploadingDriver(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      toast.error("Only JPG, JPEG, and PNG files are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File is too large. Maximum size is 5MB.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedCorporate || !uploadingDriver) return;

    if (!selectedFile) {
      toast.error("Please select a document file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        organizerRequestId: selectedCorporate.id,
        driverId: uploadingDriver.driverId || uploadingDriver.driver.id,
        result: "Submitted",
      }),
    );
    formData.append("files", selectedFile);

    try {
      const response = await uploadCorporateDriverRecord(formData).unwrap();
      toast.success(response.message || "Medical record uploaded successfully.");
      closeUploadModal();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to upload medical record."));
    }
  };

  if (selectedCorporate) {
    return (
      <div className="w-full space-y-6 p-4 animate-in fade-in md:p-6 lg:p-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedCorporate(null);
              setDriverSearch("");
            }}
            aria-label="Back to corporate list"
            title="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-[#0F2E4A] transition-colors hover:bg-slate-50"
          >
            <ArrowLeft size={18} className="stroke-[2.5]" />
          </button>
          <div>
            <h1 className="font-poppins text-2xl font-extrabold tracking-tight text-[#0F2E4A] sm:text-3xl">
              Driver List
            </h1>
            <p className="mt-1 text-xs font-semibold text-slate-400">
              {selectedCorporate.companyName}
            </p>
          </div>
        </div>

        <div className="relative w-full">
          <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="search"
            value={driverSearch}
            onChange={(event) => setDriverSearch(event.target.value)}
            placeholder="Search Driver"
            className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 py-3.5 pl-12 pr-4 text-xs font-semibold text-[#0F2E4A] placeholder:text-slate-400 focus:border-[#00B2D6] focus:outline-none focus:ring-1 focus:ring-[#00B2D6] sm:text-sm"
          />
        </div>

        <div className="overflow-hidden rounded-[24px] border border-slate-100/90 bg-white shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#00B2D6]">
                  <th className="w-[22%] px-6 py-4 text-xs font-bold text-[#0F2E4A] sm:text-sm">Driver Name</th>
                  <th className="w-[28%] px-6 py-4 text-xs font-bold text-[#0F2E4A] sm:text-sm">Email</th>
                  <th className="w-[18%] px-6 py-4 text-xs font-bold text-[#0F2E4A] sm:text-sm">Phone</th>
                  <th className="w-[20%] px-6 py-4 text-xs font-bold text-[#0F2E4A] sm:text-sm">Service</th>
                  <th className="w-[12%] px-6 py-4 text-center text-xs font-bold text-[#0F2E4A] sm:text-sm">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {filteredDrivers.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-50/40">
                    <td className="px-6 py-3.5 text-xs font-bold text-[#0F2E4A] sm:text-sm">{item.driver.fullName}</td>
                    <td className="px-6 py-3.5 text-xs font-semibold text-slate-500 sm:text-sm">{item.driver.email}</td>
                    <td className="px-6 py-3.5 text-xs font-semibold text-slate-500 sm:text-sm">{item.driver.phoneNumber || "N/A"}</td>
                    <td className="px-6 py-3.5 text-xs font-semibold text-slate-500 sm:text-sm">{selectedCorporate.service?.title || "N/A"}</td>
                    <td className="px-6 py-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => setUploadingDriver(item)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-1.5 text-[10px] font-bold text-amber-600 transition-colors hover:bg-amber-100 sm:text-xs"
                      >
                        <Upload size={13} />
                        Upload
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredDrivers.length === 0 && (
              <div className="flex min-h-[240px] items-center justify-center border-t border-slate-100 px-6 text-center">
                <p className="text-sm font-semibold text-slate-400">
                  {driverSearch.trim()
                    ? "No drivers match your search."
                    : "No drivers found for this corporate request."}
                </p>
              </div>
            )}
          </div>
        </div>

        {uploadingDriver &&
          mounted &&
          createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <button
                type="button"
                aria-label="Close upload dialog"
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                onClick={closeUploadModal}
              />
              <div className="relative z-10 w-full max-w-[560px] rounded-[32px] border border-slate-100 bg-white p-7 shadow-[0_20px_50px_rgba(0,0,0,0.1)] animate-in fade-in zoom-in-95 sm:p-9">
                <div className="flex items-center justify-between pb-5">
                  <div>
                    <h2 className="font-poppins text-xl font-extrabold text-[#0F2E4A] sm:text-2xl">Upload Document</h2>
                    <p className="mt-1 text-xs font-semibold text-slate-400">{uploadingDriver.driver.fullName}</p>
                  </div>
                  <button
                    type="button"
                    onClick={closeUploadModal}
                    aria-label="Close upload dialog"
                    title="Close"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500 transition-colors hover:bg-red-100"
                  >
                    <X size={15} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex min-h-[220px] w-full flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-300 bg-slate-50/40 p-8 text-center transition-colors hover:border-[#00B2D6] hover:bg-cyan-50/30"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-50 text-[#00B2D6]">
                    <Upload size={23} />
                  </span>
                  <span className="text-sm font-bold text-[#0F2E4A]">Choose Medical Document</span>
                  {selectedFile ? (
                    <span className="max-w-full truncate rounded-full bg-cyan-50 px-3.5 py-1 text-xs font-bold text-[#00B2D6]">{selectedFile.name}</span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">JPG, JPEG or PNG, maximum 5MB</span>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="mt-6 w-full rounded-full bg-[#00B2D6] py-3.5 text-sm font-bold text-white shadow-md shadow-cyan-100 transition-colors hover:bg-[#009cb9] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUploading ? "Uploading..." : "Submit"}
                </button>
              </div>
            </div>,
            document.body,
          )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-4 animate-in fade-in md:p-6 lg:p-8">
      <h1 className="font-poppins text-2xl font-extrabold tracking-tight text-[#0F2E4A] sm:text-3xl">Corporate List</h1>

      <div className="relative w-full">
        <span className="absolute inset-y-0 left-4 flex items-center text-slate-400"><Search size={18} /></span>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search Company"
          className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 py-3.5 pl-12 pr-4 text-xs font-semibold text-[#0F2E4A] placeholder:text-slate-400 focus:border-[#00B2D6] focus:outline-none focus:ring-1 focus:ring-[#00B2D6] sm:text-sm"
        />
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-poppins text-xl font-extrabold tracking-tight text-[#0F2E4A] sm:text-2xl">Corporate Requests</h2>
          {!isLoading && !isError && <span className="text-xs font-semibold text-slate-400">{total} {total === 1 ? "request" : "requests"}</span>}
        </div>

        <div className="overflow-hidden rounded-[24px] border border-slate-100/90 bg-white shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#00B2D6]">
                  <th className="w-[17%] px-6 py-4 text-xs font-bold text-[#0F2E4A] sm:text-sm">Company Name</th>
                  <th className="w-[20%] px-6 py-4 text-xs font-bold text-[#0F2E4A] sm:text-sm">Company Email</th>
                  <th className="w-[10%] px-6 py-4 text-xs font-bold text-[#0F2E4A] sm:text-sm">Drivers</th>
                  <th className="w-[17%] px-6 py-4 text-xs font-bold text-[#0F2E4A] sm:text-sm">Service</th>
                  <th className="w-[18%] px-6 py-4 text-xs font-bold text-[#0F2E4A] sm:text-sm">Location</th>
                  <th className="w-[9%] px-6 py-4 text-center text-xs font-bold text-[#0F2E4A] sm:text-sm">Status</th>
                  <th className="w-[9%] px-6 py-4 text-center text-xs font-bold text-[#0F2E4A] sm:text-sm">Action</th>
                </tr>
              </thead>
              {isLoading || isFetching ? (
                <TableSkeleton columns={7} />
              ) : (
                <tbody className="divide-y divide-slate-100/80">
                  {filteredCorporates.map((corporate) => (
                    <tr key={corporate.id} className="transition-colors hover:bg-slate-50/40">
                      <td className="px-6 py-3.5 text-xs font-bold text-[#0F2E4A] sm:text-sm">{corporate.companyName}</td>
                      <td className="px-6 py-3.5 text-xs font-semibold text-slate-500 sm:text-sm">{corporate.email}</td>
                      <td className="px-6 py-3.5 text-xs font-semibold text-slate-500 sm:text-sm">{corporate.totalDriver}</td>
                      <td className="px-6 py-3.5 text-xs font-semibold text-slate-500 sm:text-sm">{corporate.service?.title || "N/A"}</td>
                      <td className="px-6 py-3.5 text-xs font-semibold text-slate-500 sm:text-sm">{corporate.location || "N/A"}</td>
                      <td className="px-6 py-3.5 text-center">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${getStatusClassName(corporate.status)}`}>{corporate.status}</span>
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedCorporate(corporate)}
                          className="whitespace-nowrap rounded-full bg-cyan-50 px-4 py-1.5 text-[10px] font-bold text-[#00A5C7] transition-colors hover:bg-cyan-100 sm:text-xs"
                        >
                          View Drivers
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>

            {!isLoading && !isFetching && isError && (
              <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 border-t border-slate-100 text-center">
                <p className="text-sm font-bold text-red-500">Failed to load corporate requests.</p>
                <button type="button" onClick={() => refetch()} className="rounded-full bg-[#00B2D6] px-5 py-2 text-xs font-bold text-white hover:bg-[#009cb9]">Try Again</button>
              </div>
            )}

            {!isLoading && !isFetching && !isError && filteredCorporates.length === 0 && (
              <div className="flex min-h-[260px] items-center justify-center border-t border-slate-100 px-6 text-center">
                <p className="text-sm font-semibold text-slate-400">{searchQuery.trim() ? "No corporate requests match your search." : "No corporate requests found."}</p>
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
    </div>
  );
}
