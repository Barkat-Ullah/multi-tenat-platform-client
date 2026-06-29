"use client";

import React, { useState, useMemo } from "react";
import { Users, Check, Calendar, FileText } from "lucide-react";
import { adminCorporateRequests, CorporateRequestItem } from "@/app/data/AdminDashboardData";
import Pagination from "./Pagination";
import { toast } from "sonner";

export default function CorporateView() {
  const [requests, setRequests] = useState<CorporateRequestItem[]>(adminCorporateRequests);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // Display 7 items per page to perfectly match the mockup

  // Only display Pending corporate requests in the queue
  const pendingRequests = useMemo(() => {
    return requests.filter((r) => r.status === "Pending");
  }, [requests]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(pendingRequests.length / itemsPerPage));
  }, [pendingRequests]);

  // Paginated slice
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return pendingRequests.slice(start, start + itemsPerPage);
  }, [pendingRequests, currentPage]);

  const handleApprove = (id: string, name: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Approved" } : r))
    );
    toast.success(`Approved corporate request for "${name}" successfully!`);
  };

  const handleReject = (id: string, name: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Rejected" } : r))
    );
    toast.error(`Rejected corporate request for "${name}".`);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 bg-[#F8FAFC]/30 min-h-screen">
      {/* Top Header */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
        Corporate
      </h1>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="bg-white rounded-[24px] border border-slate-100/80 p-6 flex flex-col justify-between min-h-[140px] shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6FAFF] text-[#00B2D6] flex items-center justify-center">
              <Users size={20} className="stroke-[2.5]" />
            </div>
            <span className="text-[13px] sm:text-[14px] font-bold text-[#0F2E4A] font-sans">
              Corporate Clients
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins mt-4">
            12
          </span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-[24px] border border-slate-100/80 p-6 flex flex-col justify-between min-h-[140px] shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6FDF5] text-[#10B981] flex items-center justify-center">
              <Check size={20} className="stroke-[3]" />
            </div>
            <span className="text-[13px] sm:text-[14px] font-bold text-[#0F2E4A] font-sans">
              Active Users
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins mt-4">
            180
          </span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-[24px] border border-slate-100/80 p-6 flex flex-col justify-between min-h-[140px] shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6FAFF] text-[#00B2D6] flex items-center justify-center">
              <Calendar size={20} className="stroke-[2.5]" />
            </div>
            <span className="text-[13px] sm:text-[14px] font-bold text-[#0F2E4A] font-sans">
              Monthly Bookings
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins mt-4">
            342
          </span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-[24px] border border-slate-100/80 p-6 flex flex-col justify-between min-h-[140px] shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6FAFF] text-[#00B2D6] flex items-center justify-center">
              <FileText size={20} className="stroke-[2.5]" />
            </div>
            <span className="text-[13px] sm:text-[14px] font-bold text-[#0F2E4A] font-sans">
              Request Corporate
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins mt-4">
            {pendingRequests.length}
          </span>
        </div>
      </div>

      {/* Corporate Request Table Section */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-bold text-[#0F2E4A] font-poppins">
          Corporate Request
        </h2>

        {/* Data Table */}
        <div className="overflow-x-auto bg-white rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              {/* Thin solid cyan border separator bottom border */}
              <tr className="border-b-2 border-[#00B2D6] text-left">
                <th className="py-4 px-6 text-sm font-bold text-[#0F2E4A] font-sans">
                  Company name
                </th>
                <th className="py-4 px-6 text-sm font-bold text-[#0F2E4A] font-sans">
                  Company email
                </th>
                <th className="py-4 px-6 text-sm font-bold text-[#0F2E4A] font-sans">
                  Number of driver
                </th>
                <th className="py-4 px-6 text-sm font-bold text-[#0F2E4A] font-sans">
                  Services
                </th>
                <th className="py-4 px-6 text-sm font-bold text-[#0F2E4A] font-sans text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.length > 0 ? (
                paginatedRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors last:border-b-0"
                  >
                    <td className="py-4 px-6 text-sm font-semibold text-slate-500">
                      {req.companyName}
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-slate-500">
                      {req.companyEmail}
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-slate-500">
                      {req.driverCount}
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-slate-500">
                      {req.services}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-3">
                        {/* Reject button - light red pill */}
                        <button
                          onClick={() => handleReject(req.id, req.companyName)}
                          className="bg-[#FFEBEB] text-[#FF4D4F] hover:bg-[#FFD6D6] px-5 py-1.5 rounded-full text-xs font-bold transition-all border-none outline-none cursor-pointer active:scale-95"
                        >
                          Reject
                        </button>
                        {/* Approved button - light green pill */}
                        <button
                          onClick={() => handleApprove(req.id, req.companyName)}
                          className="bg-[#E6FDF5] text-[#10B981] hover:bg-[#D1FAE5] px-5 py-1.5 rounded-full text-xs font-bold transition-all border-none outline-none cursor-pointer active:scale-95"
                        >
                          Approved
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 font-semibold">
                    No pending corporate requests in the queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination panel */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
