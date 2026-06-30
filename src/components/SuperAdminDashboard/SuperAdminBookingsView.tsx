"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import { superAdminBookingsData, SuperAdminBooking } from "@/app/data/SuperAdminDashboardData";

export default function SuperAdminBookingsView() {
  const [bookings] = useState<SuperAdminBooking[]>(superAdminBookingsData);
  const [viewingBooking, setViewingBooking] = useState<SuperAdminBooking | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 w-full">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          Bookings
        </h1>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Today's Bookings */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col justify-between min-h-[140px] shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins">
              Today&apos;s Bookings
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#E6FAFF] text-[#00B2D6] flex items-center justify-center shrink-0">
              <Calendar size={18} className="stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins pt-4">
            240
          </div>
        </div>

        {/* Confirmed */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col justify-between min-h-[140px] shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins">
              Confirmed
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#E8F8F5] text-[#10B981] flex items-center justify-center shrink-0">
              <CheckCircle size={18} className="stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins pt-4">
            189
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col justify-between min-h-[140px] shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins">
              Pending
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#FEF9E7] text-[#D9A700] flex items-center justify-center shrink-0">
              <Clock size={18} className="stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins pt-4">
            13
          </div>
        </div>

        {/* Cancelled */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col justify-between min-h-[140px] shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins">
              Cancelled
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#FDF2F2] text-[#E53E3E] flex items-center justify-center shrink-0">
              <XCircle size={18} className="stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins pt-4">
            65
          </div>
        </div>
      </div>

      {/* Bookings List Table */}
      <div className="space-y-4 pt-2">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          All booking
        </h2>

        <div className="bg-white rounded-[24px] border border-slate-100/90 shadow-[0_4px_25px_rgba(0,0,0,0.01)] overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[1000px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#00B2D6] bg-white">
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[18%]">
                    Client Name
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[22%]">
                    Email
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[16%]">
                    Service
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[16%]">
                    Council
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[16%]">
                    Clinician
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[14%]">
                    Date & Time
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins text-center w-[8%]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3.5 px-6 text-xs sm:text-sm text-[#0F2E4A] font-bold font-sans">
                      {booking.clientName}
                    </td>
                    <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                      {booking.email}
                    </td>
                    <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                      {booking.service}
                    </td>
                    <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                      {booking.council}
                    </td>
                    <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                      {booking.clinician}
                    </td>
                    <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                      {booking.dateTime}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <button
                        type="button"
                        onClick={() => setViewingBooking(booking)}
                        className="text-[#00B2D6] hover:text-[#009cb9] hover:scale-110 active:scale-95 transition-all outline-none border-none bg-transparent cursor-pointer"
                        title="View Booking details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Pagination Control Section */}
        <div className="flex items-center justify-end gap-2 pt-4">
          <button
            type="button"
            className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-400 font-bold text-xs sm:text-sm flex items-center gap-1 transition-all outline-none cursor-pointer"
          >
            <ChevronLeft size={14} />
            <span>Previous</span>
          </button>
          
          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-[#00B2D6] text-white flex items-center justify-center font-bold text-xs sm:text-sm border border-[#00B2D6] shadow-sm cursor-pointer"
          >
            1
          </button>
          
          <button
            type="button"
            className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center font-bold text-xs sm:text-sm cursor-pointer"
          >
            2
          </button>

          <button
            type="button"
            className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center font-bold text-xs sm:text-sm cursor-pointer"
          >
            3
          </button>

          <button
            type="button"
            className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-500 font-bold text-xs sm:text-sm flex items-center gap-1 transition-all outline-none cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Booking Detail Modal (rendered via React Portal) */}
      {viewingBooking && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setViewingBooking(null)}
          />

          <div className="bg-white w-full max-w-[480px] rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-8 sm:p-10 relative z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2E4A] font-poppins">
                Booking Details
              </h2>
              <button
                onClick={() => setViewingBooking(null)}
                className="w-8 h-8 rounded-full bg-[#E6FAFF] text-[#00B2D6] hover:bg-[#D0F3FC] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer border-none outline-none"
              >
                <X size={15} className="stroke-[2.5]" />
              </button>
            </div>

            {/* Details Fields */}
            <div className="space-y-4 text-sm sm:text-base text-[#0F2E4A] font-sans mt-6">
              <div className="flex items-start gap-1">
                <span className="font-extrabold whitespace-nowrap">Client Name :</span>
                <span className="font-semibold text-slate-500">{viewingBooking.clientName}</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="font-extrabold whitespace-nowrap">Email :</span>
                <span className="font-semibold text-slate-500">{viewingBooking.email}</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="font-extrabold whitespace-nowrap">Client ID :</span>
                <span className="font-semibold text-slate-500">{viewingBooking.clientId}</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="font-extrabold whitespace-nowrap">Service :</span>
                <span className="font-semibold text-slate-500">{viewingBooking.service}</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="font-extrabold whitespace-nowrap">Location :</span>
                <span className="font-semibold text-slate-500">{viewingBooking.location}</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="font-extrabold whitespace-nowrap">Council :</span>
                <span className="font-semibold text-slate-500">{viewingBooking.council}</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="font-extrabold whitespace-nowrap">Clinician :</span>
                <span className="font-semibold text-slate-500">{viewingBooking.clinician}</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="font-extrabold whitespace-nowrap">Date & Time :</span>
                <span className="font-semibold text-slate-500">{viewingBooking.dateTime}</span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
