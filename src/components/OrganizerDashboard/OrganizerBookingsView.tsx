"use client";

import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, CheckCircle2, Clock, Calendar, X, ShieldAlert } from "lucide-react";
import { 
  organizerBookingsData, 
  organizerDriversData, 
  OrganizerBooking, 
  OrganizerDriver 
} from "@/app/data/OrganizerDashboardData";
import { toast } from "sonner";

export default function OrganizerBookingsView() {
  const [bookings, setBookings] = useState<OrganizerBooking[]>(organizerBookingsData);
  const [drivers] = useState<OrganizerDriver[]>(organizerDriversData);
  const [searchTerm, setSearchTerm] = useState("");
  const [assigningBooking, setAssigningBooking] = useState<OrganizerBooking | null>(null);
  
  // Multi-select tags state matching mockup exactly
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([
    "John Smith", "Alex", "Watson", "Chris", "Shane", "Tony", "Peter", "Maxson", "Ricky", "Maddy", "Nelson"
  ]);
  const [driverSearchQuery, setDriverSearchQuery] = useState("Alex");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Suggestions dynamic list filter
  const suggestionsList = useMemo(() => {
    const list = ["Alex John", "Alabama", "Alaska", "Arkansas", "Albert", "Alan"];
    if (!driverSearchQuery.trim()) return [];
    return list.filter(
      (item) =>
        item.toLowerCase().includes(driverSearchQuery.toLowerCase()) &&
        !selectedDrivers.includes(item)
    );
  }, [driverSearchQuery, selectedDrivers]);

  // Filter logic for table search
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const search = searchTerm.toLowerCase();
      return (
        b.srvName.toLowerCase().includes(search) ||
        b.clinicianName.toLowerCase().includes(search) ||
        (b.assignedDriverName && b.assignedDriverName.toLowerCase().includes(search))
      );
    });
  }, [bookings, searchTerm]);

  // Form submission: assigning driver list
  const handleAssignDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningBooking) return;
    if (selectedDrivers.length === 0) {
      toast.error("Please select at least one driver to assign.");
      return;
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.id === assigningBooking.id
          ? { ...b, assignedDriverName: selectedDrivers.join(", ") }
          : b
      )
    );

    toast.success("Drivers assigned to booking successfully!");
    setAssigningBooking(null);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">
      {/* Header title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          All Bookings
        </h1>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Completed Card */}
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
            48
          </span>
        </div>

        {/* Pending Card */}
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
            12
          </span>
        </div>

        {/* Upcoming Card */}
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
            12
          </span>
        </div>
      </div>

      {/* Search Input Bar */}
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

      {/* Bookings log container */}
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
                    Last Medical
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[14%]">
                    Expiry Date
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins text-center w-[12%]">
                    Srv.request
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins text-center w-[8%]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/40 transition-colors">
                    {/* Srv. Name */}
                    <td className="py-4 px-6 text-xs sm:text-sm text-[#0F2E4A] font-bold font-sans">
                      {booking.srvName}
                    </td>
                    {/* Num. of Driver */}
                    <td className="py-4 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                      {booking.numDrivers}
                    </td>
                    {/* Clinician Name */}
                    <td className="py-4 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                      <div>{booking.clinicianName}</div>
                      {booking.assignedDriverName && (
                        <div className="text-[10px] text-[#00B2D6] font-bold mt-0.5">
                          Assigned: {booking.assignedDriverName}
                        </div>
                      )}
                    </td>
                    {/* Last Medical */}
                    <td className="py-4 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                      {booking.lastMedical}
                    </td>
                    {/* Expiry Date */}
                    <td className="py-4 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                      {booking.expiryDate}
                    </td>
                    {/* Srv.request (Status badges) */}
                    <td className="py-4 px-6 text-center">
                      {booking.status === "Confirm" ? (
                        <span className="inline-flex items-center justify-center px-4 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-[#E8F8F5] text-[#10B981] border border-[#A3E4D7]/20">
                          Confirm
                        </span>
                      ) : booking.status === "Pending" ? (
                        <span className="inline-flex items-center justify-center px-4 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-[#FEF9E7] text-[#D9A700] border border-[#F9E79F]/20">
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center px-4 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-red-50 text-red-600 border border-red-100">
                          Canceled
                        </span>
                      )}
                    </td>
                    {/* Action Button: Assign Driver */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => setAssigningBooking(booking)}
                        disabled={booking.status === "Canceled"}
                        className="px-4 py-1.5 rounded-full bg-[#00A88F] hover:bg-[#008f79] disabled:bg-slate-100 disabled:text-slate-400 text-white text-[11px] sm:text-xs font-bold transition-all border-none outline-none cursor-pointer active:scale-95 whitespace-nowrap"
                      >
                        Assign Driver
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-sm font-bold text-slate-400 font-sans">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Assign Driver Overlay Modal (rendered via React Portal) */}
      {assigningBooking && mounted && createPortal(
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

            {/* Assign Driver Form */}
            <form onSubmit={handleAssignDriver} className="space-y-5 text-xs sm:text-sm text-[#0F2E4A] font-sans mt-6">
              <div>
                <label className="block text-xs font-bold text-[#0F2E4A] mb-3 font-sans">
                  Driver
                </label>
                
                {/* Selected tags layout container */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedDrivers.map((driverName) => (
                    <span
                      key={driverName}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-bold text-slate-600 font-sans border border-slate-200/40"
                    >
                      <span>{driverName}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedDrivers((prev) => prev.filter((n) => n !== driverName))
                        }
                        className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors border-none bg-transparent p-0 cursor-pointer"
                      >
                        <X size={10} className="stroke-[3]" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Input query field */}
                <input
                  type="text"
                  placeholder="Type to search..."
                  value={driverSearchQuery}
                  onChange={(e) => setDriverSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B2D6] text-xs sm:text-sm font-semibold text-[#0F2E4A]"
                />

                {/* Suggestions Vertical Pill Options */}
                {suggestionsList.length > 0 && (
                  <div className="flex flex-col items-start gap-2 mt-3 pl-1">
                    {suggestionsList.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => {
                          setSelectedDrivers((prev) => [...prev, suggestion]);
                          setDriverSearchQuery("");
                        }}
                        className="inline-flex items-center px-4 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-full text-xs font-bold text-slate-600 border border-slate-200/50 cursor-pointer transition-colors active:scale-95"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Warning note */}
              <div className="text-[11px] text-[#00B2D6] font-bold tracking-wide">
                Note :Only 30 drivers can be registered in this account.
              </div>

              {/* Submit Button Left-Aligned */}
              <div className="pt-2 flex justify-start">
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-[#00B2D6] hover:bg-[#009cb9] rounded-full text-white font-extrabold text-xs sm:text-sm tracking-wide transition-all active:scale-[0.98] shadow-md shadow-cyan-100/50 cursor-pointer border-none outline-none"
                >
                  Submit
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
