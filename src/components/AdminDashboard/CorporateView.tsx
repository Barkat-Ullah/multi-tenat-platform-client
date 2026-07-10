"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Users, Check, Calendar, FileText, X } from "lucide-react";
import Pagination from "./Pagination";
import {
  AdminCorporateRequest,
  useGetAdminCorporateRequestsQuery,
  useUpdateCorporateRequestStatusMutation,
} from "@/redux/service/admin/corporateApi";
import { useGetAdminClinicsQuery } from "@/redux/service/admin/cliniciansApi";
import { toast } from "sonner";

const PAGE_LIMIT = 10;

const MetricCard = ({
  icon,
  label,
  value,
  accent = "cyan",
  isLoading,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent?: "cyan" | "green";
  isLoading: boolean;
}) => (
  <div className="flex min-h-[140px] flex-col justify-between rounded-[24px] border border-slate-100/80 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
    <div className="flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
        accent === "green"
          ? "bg-[#E6FDF5] text-[#10B981]"
          : "bg-[#E6FAFF] text-[#00B2D6]"
      }`}>
        {icon}
      </div>
      <span className="font-sans text-[13px] font-bold text-[#0F2E4A] sm:text-[14px]">
        {label}
      </span>
    </div>
    {isLoading ? (
      <div className="mt-4 h-9 w-16 animate-pulse rounded bg-slate-100" />
    ) : (
      <span className="font-poppins mt-4 text-2xl font-extrabold text-[#0F2E4A] sm:text-3xl">
        {value}
      </span>
    )}
  </div>
);

const CorporateTableSkeleton = () => (
  <>
    {Array.from({ length: 5 }).map((_, index) => (
      <tr key={index} className="border-b border-slate-100 last:border-b-0">
        {Array.from({ length: 5 }).map((__, cellIndex) => (
          <td key={cellIndex} className="px-6 py-4">
            <div className="h-4 w-full max-w-[150px] animate-pulse rounded bg-slate-100" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

const isCompletedStatus = (status: string) => {
  const normalized = status.toLowerCase();
  return ["confirmed", "approved", "canceled", "cancelled", "rejected"].includes(normalized);
};

const getStatusClassName = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized === "confirmed" || normalized === "approved") {
    return "bg-[#E6FDF5] text-[#10B981]";
  }
  if (normalized === "canceled" || normalized === "cancelled" || normalized === "rejected") {
    return "bg-[#FFEBEB] text-[#FF4D4F]";
  }
  return "bg-[#FFF8E6] text-[#F59E0B]";
};

type CorporateActionStatus = "Confirmed" | "Canceled";

export default function CorporateView() {
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [assigningRequest, setAssigningRequest] =
    useState<AdminCorporateRequest | null>(null);
  const [assigningStatus, setAssigningStatus] =
    useState<CorporateActionStatus>("Confirmed");
  const [selectedClinicId, setSelectedClinicId] = useState("");
  const [mounted, setMounted] = useState(false);
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAdminCorporateRequestsQuery({
    page: currentPage,
    limit: PAGE_LIMIT,
  });
  const {
    data: clinicsData,
    isLoading: isClinicsLoading,
    isFetching: isClinicsFetching,
    isError: isClinicsError,
    refetch: refetchClinics,
  } = useGetAdminClinicsQuery({ page: 1, limit: 100 });
  const [updateCorporateRequestStatus] = useUpdateCorporateRequestStatusMutation();

  const requests = data?.data || [];
  const meta = data?.meta;
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil((meta?.total || 0) / PAGE_LIMIT));
  }, [meta?.total]);
  const isBusy = isLoading || isFetching;
  const clinics = clinicsData?.data || [];
  const isClinicOptionsLoading = isClinicsLoading || isClinicsFetching;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!assigningRequest) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [assigningRequest]);

  const openAssignClinicModal = (
    request: AdminCorporateRequest,
    status: CorporateActionStatus,
  ) => {
    setAssigningRequest(request);
    setAssigningStatus(status);
    setSelectedClinicId(request.clinicId || "");
  };

  const closeAssignClinicModal = () => {
    if (updatingId) return;
    setAssigningRequest(null);
    setAssigningStatus("Confirmed");
    setSelectedClinicId("");
  };

  const handleStatusUpdate = async (
    request: AdminCorporateRequest,
    status: "Confirmed" | "Canceled",
    clinicId?: string | null,
  ) => {
    const nextClinicId = clinicId ?? request.clinicId ?? null;

    if (!nextClinicId) {
      toast.error(
        status === "Confirmed"
          ? "Please select a clinic before accepting this request."
          : "Please select a clinic before rejecting this request.",
      );
      return;
    }

    try {
      setUpdatingId(request.id);
      const response = await updateCorporateRequestStatus({
        id: request.id,
        clinicId: nextClinicId,
        status,
      }).unwrap();
      toast.success(response.message || `Corporate request ${status.toLowerCase()} successfully.`);
      setAssigningRequest(null);
      setAssigningStatus("Confirmed");
      setSelectedClinicId("");
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        `Failed to ${status === "Confirmed" ? "approve" : "reject"} corporate request.`;
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleConfirmAssignClinic = (event: React.FormEvent) => {
    event.preventDefault();
    if (!assigningRequest) return;
    handleStatusUpdate(assigningRequest, assigningStatus, selectedClinicId);
  };

  return (
    <div className="min-h-screen space-y-8 bg-[#F8FAFC]/30 p-4 md:p-6 lg:p-8">
      <h1 className="font-poppins text-2xl font-extrabold tracking-tight text-[#0F2E4A] sm:text-3xl">
        Corporate
      </h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Users size={20} className="stroke-[2.5]" />}
          label="Corporate Clients"
          value={meta?.corporateClients || 0}
          isLoading={isBusy}
        />
        <MetricCard
          icon={<Check size={20} className="stroke-[3]" />}
          label="Active Corporate"
          value={meta?.activeCorporate || 0}
          accent="green"
          isLoading={isBusy}
        />
        <MetricCard
          icon={<Calendar size={20} className="stroke-[2.5]" />}
          label="Monthly Bookings"
          value={meta?.monthlyBookings || 0}
          isLoading={isBusy}
        />
        <MetricCard
          icon={<FileText size={20} className="stroke-[2.5]" />}
          label="Request Corporate"
          value={meta?.reqCorporates || 0}
          isLoading={isBusy}
        />
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="font-poppins text-xl font-bold text-[#0F2E4A]">
          Corporate Request
        </h2>

        <div className="overflow-x-auto rounded-3xl border border-slate-100 bg-white shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="border-b-2 border-[#00B2D6] text-left">
                <th className="px-6 py-4 font-sans text-sm font-bold text-[#0F2E4A]">
                  Company name
                </th>
                <th className="px-6 py-4 font-sans text-sm font-bold text-[#0F2E4A]">
                  Company email
                </th>
                <th className="px-6 py-4 font-sans text-sm font-bold text-[#0F2E4A]">
                  Number of driver
                </th>
                <th className="px-6 py-4 font-sans text-sm font-bold text-[#0F2E4A]">
                  Services
                </th>
                <th className="px-6 py-4 text-center font-sans text-sm font-bold text-[#0F2E4A]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isBusy ? (
                <CorporateTableSkeleton />
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <p className="text-sm font-semibold text-red-500">
                      Failed to load corporate requests.
                    </p>
                    <button
                      type="button"
                      onClick={() => refetch()}
                      className="mt-4 rounded-full bg-[#00B2D6] px-5 py-2 text-xs font-bold text-white hover:bg-[#009cb9]"
                    >
                      Try Again
                    </button>
                  </td>
                </tr>
              ) : requests.length > 0 ? (
                requests.map((request) => {
                  const isCompleted = isCompletedStatus(request.status);

                  return (
                    <tr
                      key={request.id}
                      className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50/50"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-slate-500">
                        {request.companyName}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-500">
                        {request.email}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-500">
                        {request.totalDriver}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-500">
                        {request.service?.title || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {isCompleted ? (
                          <span className={`inline-block rounded-full px-4 py-1.5 text-xs font-bold ${getStatusClassName(request.status)}`}>
                            {request.status}
                          </span>
                        ) : (
                          <div className="flex items-center justify-center gap-3">
                            <button
                              type="button"
                              disabled={updatingId === request.id}
                              onClick={() => openAssignClinicModal(request, "Canceled")}
                              className="rounded-full bg-[#FFEBEB] px-5 py-1.5 text-xs font-bold text-[#FF4D4F] transition-all hover:bg-[#FFD6D6] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Reject
                            </button>
                            <button
                              type="button"
                              disabled={updatingId === request.id}
                              onClick={() => openAssignClinicModal(request, "Confirmed")}
                              className="rounded-full bg-[#E6FDF5] px-5 py-1.5 text-xs font-bold text-[#10B981] transition-all hover:bg-[#D1FAE5] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Accept
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center font-semibold text-slate-500">
                    No corporate requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!isBusy && !isError && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {assigningRequest && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close assign clinic dialog"
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={closeAssignClinicModal}
          />

          <form
            onSubmit={handleConfirmAssignClinic}
            className="relative z-10 w-full max-w-[520px] rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] sm:p-7"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-poppins text-xl font-extrabold text-[#0F2E4A]">
                  {assigningStatus === "Confirmed" ? "Assign Clinic" : "Reject Request"}
                </h2>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {assigningRequest.companyName}
                </p>
              </div>
              <button
                type="button"
                onClick={closeAssignClinicModal}
                disabled={Boolean(updatingId)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E6FAFF] text-[#00B2D6] hover:bg-[#D0F3FC] disabled:opacity-60"
                aria-label="Close assign clinic dialog"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4 text-xs font-semibold text-slate-500">
                <div className="flex justify-between gap-4">
                  <span>Service</span>
                  <span className="text-right font-bold text-[#0F2E4A]">
                    {assigningRequest.service?.title || "N/A"}
                  </span>
                </div>
                <div className="mt-2 flex justify-between gap-4">
                  <span>Drivers</span>
                  <span className="font-bold text-[#0F2E4A]">
                    {assigningRequest.totalDriver}
                  </span>
                </div>
                {assigningStatus === "Canceled" && (
                  <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-[11px] font-bold text-red-500">
                    Backend requires a clinic id before this request can be rejected.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-[#0F2E4A]">
                  Clinic
                </label>
                <select
                  value={selectedClinicId}
                  onChange={(event) => setSelectedClinicId(event.target.value)}
                  disabled={isClinicOptionsLoading || Boolean(updatingId)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#0F2E4A] focus:border-[#00B2D6] focus:outline-none focus:ring-1 focus:ring-[#00B2D6] disabled:opacity-60"
                >
                  <option value="">
                    {isClinicOptionsLoading ? "Loading clinics..." : "Select clinic"}
                  </option>
                  {clinics.map((clinic) => (
                    <option key={clinic.id} value={clinic.id}>
                      {clinic.fullName}
                      {clinic.location?.locationName ? ` - ${clinic.location.locationName}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {isClinicsError && (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-3 text-xs font-semibold text-red-500">
                  Failed to load clinics.
                  <button
                    type="button"
                    onClick={() => refetchClinics()}
                    className="ml-2 font-bold underline underline-offset-2"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!isClinicOptionsLoading && !isClinicsError && clinics.length === 0 && (
                <p className="text-xs font-bold text-slate-400">
                  No clinics available to assign.
                </p>
              )}
            </div>

            <div className="mt-7 flex justify-start gap-3">
              <button
                type="button"
                onClick={closeAssignClinicModal}
                disabled={Boolean(updatingId)}
                className="rounded-full border border-slate-200 px-6 py-2.5 text-xs font-bold text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  Boolean(updatingId) ||
                  isClinicOptionsLoading ||
                  !selectedClinicId ||
                  isClinicsError
                }
                className="rounded-full bg-[#00B2D6] px-7 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#009cb9] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updatingId === assigningRequest.id
                  ? assigningStatus === "Confirmed"
                    ? "Accepting..."
                    : "Rejecting..."
                  : assigningStatus === "Confirmed"
                    ? "Accept Request"
                    : "Reject Request"}
              </button>
            </div>
          </form>
        </div>,
        document.body,
      )}
    </div>
  );
}
