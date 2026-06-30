"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import { clinicPatientsData, ClinicPatient } from "@/app/data/ClinicDashboardData";

export default function ClinicPatientsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients] = useState<ClinicPatient[]>(clinicPatientsData);
  const [viewingPatient, setViewingPatient] = useState<ClinicPatient | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredPatients = patients.filter(
    (p) =>
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          My Patients
        </h1>
      </div>

      {/* Search Bar */}
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Patient"
          className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-xs sm:text-sm text-[#0F2E4A] placeholder-slate-400 font-semibold transition-all shadow-[0_2px_10px_rgba(0,0,0,0.005)]"
        />
      </div>

      {/* Patients Log List */}
      <div className="space-y-4 pt-2">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          All Patients
        </h2>

        <div className="bg-white rounded-[24px] border border-slate-100/90 shadow-[0_4px_25px_rgba(0,0,0,0.01)] overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[1050px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#00B2D6] bg-white">
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[18%]">
                    Client Name
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[22%]">
                    Client Email
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[18%]">
                    Service Type
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[18%]">
                    Appointment Time
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[14%]">
                    Location
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[5%]">
                    Status
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins text-center w-[10%]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {filteredPatients.map((pat) => {
                  let badgeStyle = "";
                  if (pat.status === "Completed") {
                    badgeStyle = "bg-[#E8F8F5] text-[#10B981]";
                  } else if (pat.status === "Canceled") {
                    badgeStyle = "bg-[#FDE8E8] text-[#E53E3E]";
                  } else {
                    badgeStyle = "bg-[#FEF9E7] text-[#D9A700]";
                  }

                  return (
                    <tr
                      key={pat.id}
                      onClick={() => setViewingPatient(pat)}
                      className="hover:bg-slate-50/40 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-6 text-xs sm:text-sm text-[#0F2E4A] font-bold font-sans">
                        {pat.clientName}
                      </td>
                      <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                        {pat.clientEmail}
                      </td>
                      <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                        {pat.serviceType}
                      </td>
                      <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                        {pat.appointmentTime}
                      </td>
                      <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                        {pat.location}
                      </td>
                      <td className="py-3.5 px-6 w-[5%]"></td>
                      <td className="py-3.5 px-6 text-center w-[10%]">
                        <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${badgeStyle}`}>
                          {pat.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
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

      {/* Patient Detail Modal (rendered via React Portal) */}
      {viewingPatient && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setViewingPatient(null)}
          />

          <div className="bg-white w-full max-w-[480px] rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-6 sm:p-8 relative z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2E4A] font-poppins">
                Patient Details
              </h2>
              <button
                onClick={() => setViewingPatient(null)}
                className="w-9 h-9 rounded-full bg-[#E6FAFF] text-[#00B2D6] hover:bg-[#D0F3FC] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer border-none outline-none"
              >
                <X size={18} className="stroke-[2.5]" />
              </button>
            </div>

            {/* Details Fields */}
            <div className="space-y-4 text-sm sm:text-base text-[#0F2E4A] font-sans mt-6">
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Patient Name:</span>
                <span className="font-semibold text-slate-500">{viewingPatient.clientName}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Patient Email:</span>
                <span className="font-semibold text-slate-500">{viewingPatient.clientEmail}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Service Type:</span>
                <span className="font-semibold text-slate-500">{viewingPatient.serviceType}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Appointment:</span>
                <span className="font-semibold text-slate-500">{viewingPatient.appointmentTime}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Location:</span>
                <span className="font-semibold text-slate-500">{viewingPatient.location}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  viewingPatient.status === "Completed" ? "bg-[#E8F8F5] text-[#10B981]" :
                  viewingPatient.status === "Canceled" ? "bg-[#FDE8E8] text-[#E53E3E]" : "bg-[#FEF9E7] text-[#D9A700]"
                }`}>
                  {viewingPatient.status}
                </span>
              </div>
            </div>

            {/* Action Footer */}
            <div className="mt-8">
              <button
                onClick={() => setViewingPatient(null)}
                className="w-full py-3 bg-[#00B2D6] hover:bg-[#009cb9] rounded-2xl text-white font-bold text-sm tracking-wide transition-all active:scale-[0.99] shadow-md shadow-cyan-100"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
