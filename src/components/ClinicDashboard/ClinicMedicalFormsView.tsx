"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, Eye, Download, X } from "lucide-react";
import { clinicMedicalFormsData, ClinicMedicalForm } from "@/app/data/ClinicDashboardData";
import { toast } from "sonner";

export default function ClinicMedicalFormsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [medicalForms] = useState<ClinicMedicalForm[]>(clinicMedicalFormsData);
  const [viewingForm, setViewingForm] = useState<ClinicMedicalForm | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredForms = medicalForms.filter(
    (f) =>
      f.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.clinicianName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = (form: ClinicMedicalForm) => {
    toast.success(`Downloading medical form pdf for ${form.clientName}...`);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          Medical Forms
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
          placeholder="Search Patient Name"
          className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-xs sm:text-sm text-[#0F2E4A] placeholder-slate-400 font-semibold transition-all shadow-[0_2px_10px_rgba(0,0,0,0.005)]"
        />
      </div>

      {/* Medical Forms Log List */}
      <div className="space-y-4 pt-2">
        <div className="bg-white rounded-[24px] border border-slate-100/90 shadow-[0_4px_25px_rgba(0,0,0,0.01)] overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[1000px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#00B2D6] bg-white">
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[20%]">
                    Client Name
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[20%]">
                    Service Type
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[20%]">
                    Appointment Date
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[20%]">
                    Clinician Name
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[12%]">
                    Form Status
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins text-center w-[8%]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {filteredForms.map((form) => {
                  let badgeStyle = "";
                  if (form.formStatus === "Submited") {
                    badgeStyle = "bg-[#E8F8F5] text-[#10B981]";
                  } else {
                    badgeStyle = "bg-[#FEF9E7] text-[#D9A700]";
                  }

                  return (
                    <tr
                      key={form.id}
                      className="hover:bg-slate-50/40 transition-colors"
                    >
                      <td className="py-3.5 px-6 text-xs sm:text-sm text-[#0F2E4A] font-bold font-sans">
                        {form.clientName}
                      </td>
                      <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                        {form.serviceType}
                      </td>
                      <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                        {form.appointmentDate}
                      </td>
                      <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                        {form.clinicianName}
                      </td>
                      <td className="py-3.5 px-6">
                        <span className={`inline-flex items-center justify-center px-4 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${badgeStyle}`}>
                          {form.formStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-6">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            type="button"
                            onClick={() => setViewingForm(form)}
                            className="text-[#00B2D6] hover:text-[#009cb9] hover:scale-110 active:scale-95 transition-all outline-none border-none bg-transparent cursor-pointer"
                            title="View Form details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownload(form)}
                            className="text-[#00B2D6] hover:text-[#009cb9] hover:scale-110 active:scale-95 transition-all outline-none border-none bg-transparent cursor-pointer"
                            title="Download Form PDF"
                          >
                            <Download size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Form Details Viewer Modal Overlay */}
      {viewingForm && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setViewingForm(null)}
          />

          <div className="bg-white w-full max-w-[480px] rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-6 sm:p-8 relative z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2E4A] font-poppins">
                Medical Form Details
              </h2>
              <button
                onClick={() => setViewingForm(null)}
                className="w-9 h-9 rounded-full bg-[#E6FAFF] text-[#00B2D6] hover:bg-[#D0F3FC] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer border-none outline-none"
              >
                <X size={18} className="stroke-[2.5]" />
              </button>
            </div>

            {/* Details Fields */}
            <div className="space-y-4 text-sm sm:text-base text-[#0F2E4A] font-sans mt-6">
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Patient Name:</span>
                <span className="font-semibold text-slate-500">{viewingForm.clientName}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Service Type:</span>
                <span className="font-semibold text-slate-500">{viewingForm.serviceType}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Appointment Date:</span>
                <span className="font-semibold text-slate-500">{viewingForm.appointmentDate}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Clinician Name:</span>
                <span className="font-semibold text-slate-500">{viewingForm.clinicianName}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Form Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  viewingForm.formStatus === "Submited" ? "bg-[#E8F8F5] text-[#10B981]" : "bg-[#FEF9E7] text-[#D9A700]"
                }`}>
                  {viewingForm.formStatus}
                </span>
              </div>
            </div>

            {/* Action Footer */}
            <div className="mt-8">
              <button
                onClick={() => setViewingForm(null)}
                className="w-full py-3 bg-[#00B2D6] hover:bg-[#009cb9] rounded-2xl text-white font-bold text-sm tracking-wide transition-all active:scale-[0.99] shadow-md shadow-cyan-100"
              >
                Close Form
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
