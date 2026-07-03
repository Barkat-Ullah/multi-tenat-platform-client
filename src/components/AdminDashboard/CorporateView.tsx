"use client";

import React, { useMemo, useState } from "react";
import { Users, Check, Calendar, FileText } from "lucide-react";
import Pagination from "./Pagination";
import {
  AdminCorporateRequest,
  useGetAdminCorporateRequestsQuery,
  useUpdateCorporateRequestStatusMutation,
} from "@/redux/service/admin/corporateApi";
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

export default function CorporateView() {
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
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
  const [updateCorporateRequestStatus] = useUpdateCorporateRequestStatusMutation();

  const requests = data?.data || [];
  const meta = data?.meta;
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil((meta?.total || 0) / PAGE_LIMIT));
  }, [meta?.total]);
  const isBusy = isLoading || isFetching;

  const handleStatusUpdate = async (
    request: AdminCorporateRequest,
    status: "Confirmed" | "Canceled",
  ) => {
    if (status === "Confirmed" && !request.clinicId) {
      toast.error("This request does not have an assigned clinic.");
      return;
    }

    try {
      setUpdatingId(request.id);
      const response = await updateCorporateRequestStatus({
        id: request.id,
        clinicId: status === "Confirmed" ? request.clinicId as string : null,
        status,
      }).unwrap();
      toast.success(response.message || `Corporate request ${status.toLowerCase()} successfully.`);
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        `Failed to ${status === "Confirmed" ? "approve" : "reject"} corporate request.`;
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
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
                              onClick={() => handleStatusUpdate(request, "Canceled")}
                              className="rounded-full bg-[#FFEBEB] px-5 py-1.5 text-xs font-bold text-[#FF4D4F] transition-all hover:bg-[#FFD6D6] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Reject
                            </button>
                            <button
                              type="button"
                              disabled={updatingId === request.id}
                              onClick={() => handleStatusUpdate(request, "Confirmed")}
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
    </div>
  );
}
