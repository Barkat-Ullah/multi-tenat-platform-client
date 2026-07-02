"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import {
  type ClinicPatientBooking,
  useGetClinicPatientsQuery,
} from "@/redux/service/clinic/clinicPatientsApi";

const PAGE_LIMIT = 10;

const formatAppointmentTime = (scheduledAt?: string) => {
  if (!scheduledAt) return "N/A";

  const date = new Date(scheduledAt);
  if (Number.isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const formatStatus = (status?: string) => {
  if (!status) return "N/A";

  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getStatusClassName = (status?: string) => {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
      return "border-emerald-100 bg-emerald-50 text-emerald-600";
    case "CANCELLED":
    case "CANCELED":
      return "border-red-100 bg-red-50 text-red-500";
    case "CONFIRMED":
      return "border-cyan-100 bg-cyan-50 text-[#00A5C7]";
    default:
      return "border-amber-100 bg-amber-50 text-amber-600";
  }
};

const getLocation = (booking: ClinicPatientBooking) =>
  booking.clinic?.location?.locationName || "N/A";

const PatientsTableSkeleton = () => (
  <tbody className="divide-y divide-slate-100/80" aria-label="Loading patients">
    {Array.from({ length: 6 }, (_, rowIndex) => (
      <tr key={rowIndex} className="animate-pulse">
        {[32, 44, 36, 40, 28].map((width, cellIndex) => (
          <td key={cellIndex} className="px-6 py-5">
            <div
              className="h-2.5 rounded-full bg-slate-200"
              style={{ width: `${width + (rowIndex % 3) * 4}%` }}
            />
          </td>
        ))}
        <td className="px-6 py-5 text-center">
          <div className="mx-auto h-6 w-20 rounded-full bg-slate-200" />
        </td>
      </tr>
    ))}
  </tbody>
);

export default function ClinicPatientsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [viewingPatient, setViewingPatient] =
    useState<ClinicPatientBooking | null>(null);
  const [mounted, setMounted] = useState(false);

  const {
    data: patientsResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetClinicPatientsQuery({ page, limit: PAGE_LIMIT });

  useEffect(() => {
    setMounted(true);
  }, []);

  const bookings = patientsResponse?.data || [];
  const filteredPatients = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return bookings;

    return bookings.filter((booking) =>
      [
        booking.driver?.fullName,
        booking.driver?.email,
        booking.service?.title,
        getLocation(booking),
        booking.status,
      ].some((value) => value?.toLowerCase().includes(query)),
    );
  }, [bookings, searchQuery]);

  const total = patientsResponse?.meta.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));
  const firstVisiblePage = Math.max(1, Math.min(page - 2, totalPages - 4));
  const visiblePages = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => firstVisiblePage + index,
  );

  return (
    <div className="w-full space-y-6 p-4 md:p-6 lg:p-8">
      <h1 className="font-poppins text-2xl font-extrabold tracking-tight text-[#0F2E4A] sm:text-3xl">
        My Patients
      </h1>

      <div className="relative w-full">
        <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
          <Search size={18} />
        </span>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search Patient"
          className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 py-3.5 pl-12 pr-4 text-xs font-semibold text-[#0F2E4A] shadow-[0_2px_10px_rgba(0,0,0,0.005)] transition-colors placeholder:text-slate-400 hover:bg-slate-50 focus:border-[#00B2D6] focus:outline-none focus:ring-1 focus:ring-[#00B2D6] sm:text-sm"
        />
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-poppins text-xl font-extrabold tracking-tight text-[#0F2E4A] sm:text-2xl">
            All Patients
          </h2>
          {!isLoading && !isError && (
            <span className="text-xs font-semibold text-slate-400">
              {total} {total === 1 ? "booking" : "bookings"}
            </span>
          )}
        </div>

        <div className="overflow-hidden rounded-[24px] border border-slate-100/90 bg-white shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#00B2D6] bg-white">
                  <th className="w-[18%] px-6 py-4 font-poppins text-xs font-bold text-[#0F2E4A] sm:text-sm">
                    Patient Name
                  </th>
                  <th className="w-[22%] px-6 py-4 font-poppins text-xs font-bold text-[#0F2E4A] sm:text-sm">
                    Patient Email
                  </th>
                  <th className="w-[18%] px-6 py-4 font-poppins text-xs font-bold text-[#0F2E4A] sm:text-sm">
                    Service Type
                  </th>
                  <th className="w-[20%] px-6 py-4 font-poppins text-xs font-bold text-[#0F2E4A] sm:text-sm">
                    Appointment Time
                  </th>
                  <th className="w-[12%] px-6 py-4 font-poppins text-xs font-bold text-[#0F2E4A] sm:text-sm">
                    Location
                  </th>
                  <th className="w-[10%] px-6 py-4 text-center font-poppins text-xs font-bold text-[#0F2E4A] sm:text-sm">
                    Status
                  </th>
                </tr>
              </thead>

              {isLoading || isFetching ? (
                <PatientsTableSkeleton />
              ) : (
                <tbody className="divide-y divide-slate-100/80">
                  {filteredPatients.map((booking) => (
                    <tr
                      key={booking.id}
                      onClick={() => setViewingPatient(booking)}
                      className="cursor-pointer transition-colors hover:bg-slate-50/40"
                    >
                      <td className="px-6 py-3.5 text-xs font-bold text-[#0F2E4A] sm:text-sm">
                        {booking.driver?.fullName || "N/A"}
                      </td>
                      <td className="px-6 py-3.5 text-xs font-semibold text-slate-500 sm:text-sm">
                        {booking.driver?.email || "N/A"}
                      </td>
                      <td className="px-6 py-3.5 text-xs font-semibold text-slate-500 sm:text-sm">
                        {booking.service?.title || "N/A"}
                      </td>
                      <td className="px-6 py-3.5 text-xs font-semibold text-slate-500 sm:text-sm">
                        {formatAppointmentTime(booking.scheduledAt)}
                      </td>
                      <td className="px-6 py-3.5 text-xs font-semibold text-slate-500 sm:text-sm">
                        {getLocation(booking)}
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider sm:text-xs ${getStatusClassName(booking.status)}`}
                        >
                          {formatStatus(booking.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>

            {!isLoading && !isFetching && isError && (
              <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 border-t border-slate-100 text-center">
                <p className="text-sm font-bold text-red-500">
                  Failed to load patients.
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="rounded-full bg-[#00B2D6] px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#009cb9]"
                >
                  Try Again
                </button>
              </div>
            )}

            {!isLoading &&
              !isFetching &&
              !isError &&
              filteredPatients.length === 0 && (
                <div className="flex min-h-[260px] items-center justify-center border-t border-slate-100 px-6 text-center">
                  <p className="text-sm font-semibold text-slate-400">
                    {searchQuery.trim()
                      ? "No patients match your search."
                      : "No patient bookings found."}
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
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>

            {visiblePages.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                disabled={isFetching}
                aria-label={`Page ${pageNumber}`}
                aria-current={pageNumber === page ? "page" : undefined}
                className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold transition-colors sm:text-sm ${
                  pageNumber === page
                    ? "border-[#00B2D6] bg-[#00B2D6] text-white"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              disabled={page === totalPages || isFetching}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {viewingPatient &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <button
              type="button"
              aria-label="Close patient details"
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
              onClick={() => setViewingPatient(null)}
            />

            <div className="relative z-10 w-full max-w-[520px] rounded-[32px] border border-slate-100 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] animate-in fade-in zoom-in-95 sm:p-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                <h2 className="font-poppins text-xl font-extrabold text-[#0F2E4A] sm:text-2xl">
                  Patient Details
                </h2>
                <button
                  type="button"
                  onClick={() => setViewingPatient(null)}
                  aria-label="Close patient details"
                  title="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E6FAFF] text-[#00B2D6] transition-colors hover:bg-[#D0F3FC]"
                >
                  <X size={18} className="stroke-[2.5]" />
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 text-sm text-[#0F2E4A] sm:grid-cols-2 sm:text-base">
                <div>
                  <span className="block text-xs font-bold text-slate-400">Patient Name</span>
                  <span className="font-semibold">{viewingPatient.driver?.fullName || "N/A"}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400">Email</span>
                  <span className="break-all font-semibold">{viewingPatient.driver?.email || "N/A"}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400">Phone</span>
                  <span className="font-semibold">{viewingPatient.driver?.phoneNumber || "N/A"}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400">Licence Number</span>
                  <span className="font-semibold">{viewingPatient.driver?.licenseNo || "N/A"}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400">Service</span>
                  <span className="font-semibold">{viewingPatient.service?.title || "N/A"}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400">Location</span>
                  <span className="font-semibold">{getLocation(viewingPatient)}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="block text-xs font-bold text-slate-400">Appointment</span>
                  <span className="font-semibold">{formatAppointmentTime(viewingPatient.scheduledAt)}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400">Medical Status</span>
                  <span className="font-semibold">{formatStatus(viewingPatient.driver?.medicalStatus || undefined)}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400">Medical Record</span>
                  <span className="font-semibold">{formatStatus(viewingPatient.medicalRecord?.result)}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400">Payment</span>
                  <span className="font-semibold">{formatStatus(viewingPatient.payment?.status)}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400">Booking Status</span>
                  <span
                    className={`mt-1 inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${getStatusClassName(viewingPatient.status)}`}
                  >
                    {formatStatus(viewingPatient.status)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewingPatient(null)}
                className="mt-8 w-full rounded-2xl bg-[#00B2D6] py-3 text-sm font-bold tracking-wide text-white shadow-md shadow-cyan-100 transition-colors hover:bg-[#009cb9]"
              >
                Close Record
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
