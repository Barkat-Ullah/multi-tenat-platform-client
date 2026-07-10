"use client";

import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, CheckCircle2, Clock, Calendar, X } from "lucide-react";
import { toast } from "sonner";
import {
  useGetMyOrganizerRequestsQuery,
  useGetCorporateAllDriversQuery,
  useAssignDriversToRequestMutation,
  type OrganizerRequest,
  type CorporateDriver,
} from "@/redux/service/corporate/corporateDashboardApi";

// ── helpers ──────────────────────────────────────────────────────────────────

// Convert UTC ISO string → user's local timezone + system locale (dynamic for all countries)
function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const isConfirmedStatus = (status: string | undefined) => status === "Confirmed";
const isPendingStatus = (status: string | undefined) => status === "Pending";
const isCanceledStatus = (status: string | undefined) =>
  status === "Cancelled" || status === "Canceled";

const getRequestedDriverLimit = (request: OrganizerRequest | null) => {
  const limit = Number(request?.totalDriver);
  return Number.isFinite(limit) && limit > 0 ? limit : 0;
};

function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      <td className="px-6 py-5">
        <div className="h-3 w-28 rounded-full bg-slate-200" />
      </td>
      <td className="px-6 py-5">
        <div className="h-3 w-10 rounded-full bg-slate-200" />
      </td>
      <td className="px-6 py-5">
        <div className="space-y-2">
          <div className="h-3 w-32 rounded-full bg-slate-200" />
          <div className="h-2.5 w-40 rounded-full bg-slate-100" />
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="h-3 w-28 rounded-full bg-slate-200" />
      </td>
      <td className="px-6 py-5">
        <div className="h-3 w-24 rounded-full bg-slate-200" />
      </td>
      <td className="px-6 py-5">
        <div className="mx-auto h-6 w-20 rounded-full bg-slate-200" />
      </td>
      <td className="px-6 py-5">
        <div className="mx-auto h-7 w-24 rounded-full bg-slate-200" />
      </td>
    </tr>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export default function OrganizerBookingsView() {
  const { data: requestsData, isLoading } = useGetMyOrganizerRequestsQuery();
  const { data: driversData } = useGetCorporateAllDriversQuery();
  const [assignDrivers, { isLoading: isAssigning }] = useAssignDriversToRequestMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [assigningBooking, setAssigningBooking] = useState<OrganizerRequest | null>(null);
  // Store selected driver IDs
  const [selectedDriverIds, setSelectedDriverIds] = useState<string[]>([]);
  const [driverSearchQuery, setDriverSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const requests: OrganizerRequest[] = requestsData?.data ?? [];
  const allOrgDrivers: CorporateDriver[] = driversData?.data ?? [];
  const isTableLoading = isLoading && requests.length === 0;

  // Stats derived from real data
  const confirmed = requests.filter((r) => isConfirmedStatus(r.status)).length;
  const pending = requests.filter((r) => isPendingStatus(r.status)).length;
  const upcoming = requests.filter(
    (r) => !isConfirmedStatus(r.status) && !isCanceledStatus(r.status)
  ).length;

  // Search filter
  const filteredRequests = useMemo(() => {
    const s = searchTerm.toLowerCase();
    if (!s) return requests;
    return requests.filter(
      (r) =>
        r.companyName.toLowerCase().includes(s) ||
        (r.service?.title ?? "").toLowerCase().includes(s) ||
        (r.clinic?.fullName ?? "").toLowerCase().includes(s) ||
        r.status.toLowerCase().includes(s)
    );
  }, [requests, searchTerm]);

  // Drivers not yet selected, filtered by search query (show all if query is empty)
  const suggestionDrivers = useMemo(() => {
    return allOrgDrivers.filter(
      (d) =>
        (driverSearchQuery.trim() === "" ||
          d.fullName.toLowerCase().includes(driverSearchQuery.toLowerCase())) &&
        !selectedDriverIds.includes(d.id)
    );
  }, [allOrgDrivers, driverSearchQuery, selectedDriverIds]);

  // Helper: get driver name by ID
  const getDriverName = (id: string) =>
    allOrgDrivers.find((d) => d.id === id)?.fullName ?? id;

  const openAssignModal = (booking: OrganizerRequest) => {
    setAssigningBooking(booking);
    // Pre-select drivers already assigned to this request
    setSelectedDriverIds(booking.drivers.map((d) => d.driverId));
    setDriverSearchQuery("");
  };

  const handleAssignDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningBooking) return;
    if (selectedDriverIds.length === 0) {
      toast.error("Please select at least one driver.");
      return;
    }
    const driverLimit = getRequestedDriverLimit(assigningBooking);
    if (driverLimit > 0 && selectedDriverIds.length > driverLimit) {
      toast.error(`Only ${driverLimit} drivers can be assigned to this request.`);
      return;
    }
    try {
      const res = await assignDrivers({
        requestId: assigningBooking.id,
        driverIds: selectedDriverIds,
      }).unwrap();
      if (res.success) {
        toast.success("Drivers assigned successfully!");
        setAssigningBooking(null);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to assign drivers.");
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          All Bookings
        </h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Completed / Confirmed */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col justify-between h-[140px] shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F8F5] text-[#10B981] flex items-center justify-center shrink-0">
              <CheckCircle2 size={20} className="stroke-[2.5]" />
            </div>
            <span className="text-sm sm:text-base font-extrabold text-[#0F2E4A] font-poppins">
              Completed
            </span>
          </div>
          <span className="text-3xl sm:text-4xl font-extrabold text-[#0F2E4A] tracking-tight font-poppins">
            {isLoading ? "—" : confirmed}
          </span>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col justify-between h-[140px] shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FEF9E7] text-[#D9A700] flex items-center justify-center shrink-0">
              <Clock size={20} className="stroke-[2.5]" />
            </div>
            <span className="text-sm sm:text-base font-extrabold text-[#0F2E4A] font-poppins">
              Pending
            </span>
          </div>
          <span className="text-3xl sm:text-4xl font-extrabold text-[#0F2E4A] tracking-tight font-poppins">
            {isLoading ? "—" : pending}
          </span>
        </div>

        {/* Upcoming */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col justify-between h-[140px] shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#6366F1] flex items-center justify-center shrink-0">
              <Calendar size={20} className="stroke-[2.5]" />
            </div>
            <span className="text-sm sm:text-base font-extrabold text-[#0F2E4A] font-poppins">
              Upcoming
            </span>
          </div>
          <span className="text-3xl sm:text-4xl font-extrabold text-[#0F2E4A] tracking-tight font-poppins">
            {isLoading ? "—" : upcoming}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-4.5 w-4.5 text-[#00B2D6]" />
        </span>
        <input
          type="text"
          placeholder="Search Booking"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-xs sm:text-sm text-[#0F2E4A] placeholder-slate-400 font-semibold transition-all"
        />
      </div>

      {/* Table */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          All Bookings
        </h2>

        <div className="bg-white rounded-[24px] border border-slate-100/90 shadow-[0_4px_25px_rgba(0,0,0,0.01)] overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[1000px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#00B2D6] bg-white">
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[18%]">
                    Srv. Name
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[14%]">
                    Num. of Driver
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[20%]">
                    Clinician Name
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[14%]">
                    Submitted
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[14%]">
                    Location
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins text-center w-[12%]">
                    Srv.request
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins text-center w-[8%]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody
                className="divide-y divide-slate-100/80"
                aria-busy={isTableLoading}
              >
                {isTableLoading ? (
                  Array.from({ length: 5 }, (_, index) => (
                    <SkeletonRow key={index} />
                  ))
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-sm font-bold text-slate-400 font-sans">
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/40 transition-colors">
                      {/* Srv. Name */}
                      <td className="py-4 px-6 text-xs sm:text-sm text-[#0F2E4A] font-bold font-sans">
                        {req.service?.title ?? "—"}
                      </td>
                      {/* Num. of Driver */}
                      <td className="py-4 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                        {req.totalDriver}
                      </td>
                      {/* Clinician Name */}
                      <td className="py-4 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                        {req.clinic ? (
                          <div>
                            <div>{req.clinic.fullName}</div>
                            <div className="text-[10px] text-[#00B2D6] font-bold mt-0.5">
                              {req.clinic.email}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-xs">Not assigned</span>
                        )}
                      </td>
                      {/* Submitted */}
                      <td className="py-4 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                        {formatDate(req.createdAt)}
                      </td>
                      {/* Location */}
                      <td className="py-4 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                        {req.location}
                      </td>
                      {/* Status badge */}
                      <td className="py-4 px-6 text-center">
                        {isConfirmedStatus(req.status) ? (
                          <span className="inline-flex items-center justify-center px-4 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-[#E8F8F5] text-[#10B981] border border-[#A3E4D7]/20">
                            Confirm
                          </span>
                        ) : isPendingStatus(req.status) ? (
                          <span className="inline-flex items-center justify-center px-4 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-[#FEF9E7] text-[#D9A700] border border-[#F9E79F]/20">
                            Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center px-4 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-red-50 text-red-600 border border-red-100">
                            {req.status}
                          </span>
                        )}
                      </td>
                      {/* Assign Driver button */}
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => openAssignModal(req)}
                          disabled={isPendingStatus(req.status) || isCanceledStatus(req.status)}
                          className="px-4 py-1.5 rounded-full bg-[#00A88F] hover:bg-[#008f79] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 text-white text-[11px] sm:text-xs font-bold transition-all border-none outline-none cursor-pointer active:scale-95 whitespace-nowrap"
                        >
                          Assign Driver
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Assign Driver Modal */}
      {assigningBooking && mounted &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
              onClick={() => setAssigningBooking(null)}
            />
            <div className="bg-white w-full max-w-[680px] rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-6 sm:p-8 relative z-10 animate-in fade-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2E4A] font-poppins">
                  Assign Driver
                </h2>
                <button
                  onClick={() => setAssigningBooking(null)}
                  className="w-9 h-9 rounded-full bg-[#E6FAFF] text-[#00B2D6] hover:bg-[#D0F3FC] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer border-none outline-none"
                >
                  <X size={18} className="stroke-[2.5]" />
                </button>
              </div>

              {/* Booking info summary */}
              <div className="mt-4 mb-2 text-xs text-slate-500 font-semibold space-y-1">
                <p>
                  <span className="text-[#0F2E4A] font-bold">Company:</span>{" "}
                  {assigningBooking.companyName}
                </p>
                <p>
                  <span className="text-[#0F2E4A] font-bold">Service:</span>{" "}
                  {assigningBooking.service?.title ?? "—"}
                </p>
                <p>
                  <span className="text-[#0F2E4A] font-bold">Total drivers requested:</span>{" "}
                  {assigningBooking.totalDriver}
                </p>
              </div>

              <form onSubmit={handleAssignDriver} className="space-y-5 text-xs sm:text-sm text-[#0F2E4A] font-sans mt-4">
                <div>
                  <label className="block text-xs font-bold text-[#0F2E4A] mb-3 font-sans">
                    Assigned Drivers ({selectedDriverIds.length})
                  </label>

                  {/* Selected driver ID tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedDriverIds.length === 0 ? (
                      <span className="text-slate-400 italic text-xs">No drivers assigned yet.</span>
                    ) : (
                      selectedDriverIds.map((driverId) => (
                        <span
                          key={driverId}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-bold text-slate-600 font-sans border border-slate-200/40"
                        >
                          <span>{getDriverName(driverId)}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedDriverIds((prev) => prev.filter((id) => id !== driverId))
                            }
                            className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors border-none bg-transparent p-0 cursor-pointer"
                          >
                            <X size={10} className="stroke-[3]" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  {/* Search input */}
                  <input
                    type="text"
                    placeholder="Type to search drivers..."
                    value={driverSearchQuery}
                    onChange={(e) => setDriverSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B2D6] text-xs sm:text-sm font-semibold text-[#0F2E4A]"
                  />

                  {/* Suggestions from real org driver list */}
                  {suggestionDrivers.length > 0 && (
                    <div className="flex flex-col items-start gap-2 mt-3 pl-1">
                      {suggestionDrivers.map((driver) => (
                        <button
                          key={driver.id}
                          type="button"
                          onClick={() => {
                            const driverLimit = getRequestedDriverLimit(assigningBooking);
                            if (driverLimit > 0 && selectedDriverIds.length >= driverLimit) {
                              toast.error(`Only ${driverLimit} drivers can be assigned to this request.`);
                              return;
                            }
                            setSelectedDriverIds((prev) => [...prev, driver.id]);
                            setDriverSearchQuery("");
                          }}
                          className="inline-flex items-center px-4 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-full text-xs font-bold text-slate-600 border border-slate-200/50 cursor-pointer transition-colors active:scale-95"
                        >
                          {driver.fullName}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-[#00B2D6] font-bold tracking-wide">
                  Note: Only {assigningBooking.totalDriver} drivers can be registered for this request.
                </div>

                <div className="pt-2 flex justify-start">
                  <button
                    type="submit"
                    disabled={isAssigning}
                    className="px-8 py-2.5 bg-[#00B2D6] hover:bg-[#009cb9] disabled:opacity-50 rounded-full text-white font-extrabold text-xs sm:text-sm tracking-wide transition-all active:scale-[0.98] shadow-md shadow-cyan-100/50 cursor-pointer border-none outline-none"
                  >
                    {isAssigning ? "Assigning..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
