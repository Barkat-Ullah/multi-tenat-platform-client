"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, ChevronLeft, ChevronRight, ArrowLeft, Upload, X } from "lucide-react";
import { clinicCorporatesData, ClinicCorporate } from "@/app/data/ClinicDashboardData";
import { toast } from "sonner";

interface MockDriver {
  id: string;
  clientName: string;
  clientEmail: string;
  servicesName: string;
  appointmentTime: string;
  location: string;
}

export default function ClinicCorporatesView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [corporates] = useState<ClinicCorporate[]>(clinicCorporatesData);
  
  // State to track if we clicked on "View All Driver" for a company
  const [selectedCorp, setSelectedCorp] = useState<ClinicCorporate | null>(null);
  
  // Driver search state
  const [driverSearch, setDriverSearch] = useState("");
  
  // File upload state
  const [uploadingDriver, setUploadingDriver] = useState<MockDriver | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock list of drivers inside the selected company
  const mockDrivers: MockDriver[] = [
    { id: "drv-1", clientName: "Sarah Gomez", clientEmail: "emap@gmail.com", servicesName: "Taxi Medicals", appointmentTime: "Today, 9:00 AM", location: "Manchester" },
    { id: "drv-2", clientName: "Sarah Gomez", clientEmail: "emap@gmail.com", servicesName: "Taxi Medicals", appointmentTime: "Today, 9:00 AM", location: "Manchester" },
    { id: "drv-3", clientName: "Sarah Gomez", clientEmail: "emap@gmail.com", servicesName: "Taxi Medicals", appointmentTime: "Today, 9:00 AM", location: "Manchester" },
    { id: "drv-4", clientName: "Sarah Gomez", clientEmail: "emap@gmail.com", servicesName: "Taxi Medicals", appointmentTime: "Today, 9:00 AM", location: "Manchester" },
    { id: "drv-5", clientName: "Sarah Gomez", clientEmail: "emap@gmail.com", servicesName: "Taxi Medicals", appointmentTime: "Today, 9:00 AM", location: "Manchester" },
    { id: "drv-6", clientName: "Sarah Gomez", clientEmail: "emap@gmail.com", servicesName: "Taxi Medicals", appointmentTime: "Today, 9:00 AM", location: "Manchester" },
    { id: "drv-7", clientName: "Sarah Gomez", clientEmail: "emap@gmail.com", servicesName: "Taxi Medicals", appointmentTime: "Today, 9:00 AM", location: "Manchester" },
    { id: "drv-8", clientName: "Sarah Gomez", clientEmail: "emap@gmail.com", servicesName: "Taxi Medicals", appointmentTime: "Today, 9:00 AM", location: "Manchester" },
    { id: "drv-9", clientName: "Sarah Gomez", clientEmail: "emap@gmail.com", servicesName: "Taxi Medicals", appointmentTime: "Today, 9:00 AM", location: "Manchester" },
  ];

  // Filtering Logic
  const filteredCorporates = corporates.filter(
    (c) =>
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.companyEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.services.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDrivers = mockDrivers.filter(
    (d) =>
      d.clientName.toLowerCase().includes(driverSearch.toLowerCase()) ||
      d.clientEmail.toLowerCase().includes(driverSearch.toLowerCase()) ||
      d.servicesName.toLowerCase().includes(driverSearch.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadingDriver) {
      toast.success(`Successfully uploaded medical certificate "${file.name}" for ${uploadingDriver.clientName}!`);
      setUploadingDriver(null);
    }
  };

  // If a company is selected, render the Driver List view instead of the Corporate List
  if (selectedCorp) {
    return (
      <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full animate-in fade-in duration-200">
        {/* Header with Back Arrow and Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedCorp(null);
              setDriverSearch("");
            }}
            className="w-10 h-10 rounded-full border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center cursor-pointer text-[#0F2E4A] outline-none"
            aria-label="Back to corporate list"
          >
            <ArrowLeft size={18} className="stroke-[2.5]" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
            Driver List
          </h1>
        </div>

        {/* Search Bar for Driver Name */}
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            value={driverSearch}
            onChange={(e) => setDriverSearch(e.target.value)}
            placeholder="Search driver Name"
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-xs sm:text-sm text-[#0F2E4A] placeholder-slate-400 font-semibold transition-all shadow-[0_2px_10px_rgba(0,0,0,0.005)]"
          />
        </div>

        {/* Drivers table container */}
        <div className="bg-white rounded-[24px] border border-slate-100/90 shadow-[0_4px_25px_rgba(0,0,0,0.01)] overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[1000px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#00B2D6] bg-white">
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[18%]">
                    Client Name
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[22%]">
                    Client Email
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[18%]">
                    Services Name
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[18%]">
                    Appointment Time
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[14%]">
                    Location
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins text-center w-[10%]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {filteredDrivers.map((drv) => (
                  <tr key={drv.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3.5 px-6 text-xs sm:text-sm text-[#0F2E4A] font-bold font-sans">
                      {drv.clientName}
                    </td>
                    <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                      {drv.clientEmail}
                    </td>
                    <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                      {drv.servicesName}
                    </td>
                    <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                      {drv.appointmentTime}
                    </td>
                    <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                      {drv.location}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <button
                        type="button"
                        onClick={() => setUploadingDriver(drv)}
                        className="px-5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-[#FEF9E7] text-[#D9A700] hover:bg-[#FDF2D0] hover:scale-105 active:scale-95 transition-all outline-none border-none cursor-pointer tracking-wider"
                      >
                        Upload
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

        {/* Global File Upload Dialog */}
        {uploadingDriver && mounted && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
              onClick={() => {
                setUploadingDriver(null);
                setSelectedFile(null);
              }}
            />

            <div className="bg-white w-full max-w-[580px] rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 sm:p-10 relative z-10 animate-in fade-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="flex items-center justify-between pb-4">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2E4A] font-poppins">
                  Upload Docoment
                </h2>
                <button
                  onClick={() => {
                    setUploadingDriver(null);
                    setSelectedFile(null);
                  }}
                  className="w-7 h-7 rounded-full bg-[#FDF2F2] text-[#E53E3E] hover:bg-[#FDE8E8] transition-all flex items-center justify-center cursor-pointer border-none outline-none"
                >
                  <X size={14} className="stroke-[2.5]" />
                </button>
              </div>

              {/* Uploader Box */}
              <div className="space-y-6">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-slate-400 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors bg-[#FAFCFD]/30 hover:bg-[#FAFCFD]"
                >
                  <span className="text-sm font-bold text-[#0F2E4A] font-sans">
                    Upload Docoment
                  </span>

                  <div className="text-slate-400">
                    <svg
                      width="54"
                      height="54"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-slate-400"
                    >
                      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                      <path d="M12 12v9" />
                      <path d="m9 15 3-3 3 3" />
                    </svg>
                  </div>

                  {selectedFile ? (
                    <span className="text-xs font-bold text-[#00B2D6] bg-[#E6FAFF] px-3.5 py-1 rounded-full truncate max-w-[300px]">
                      Selected: {selectedFile.name}
                    </span>
                  ) : (
                    <span className="text-[10px] sm:text-xs text-slate-400 font-bold font-sans tracking-wide">
                      Formats: JPG, PNG, JPEG – Max 5MB each
                    </span>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          toast.error("File is too large. Max size is 5MB.");
                          return;
                        }
                        setSelectedFile(file);
                      }
                    }}
                    className="hidden"
                    accept="image/jpeg,image/png,image/jpg"
                  />
                </div>

                {/* Footer Submit Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedFile) {
                        toast.error("Please select a document file to upload.");
                        return;
                      }
                      toast.success(`Successfully uploaded medical certificate "${selectedFile.name}" for ${uploadingDriver.clientName}!`);
                      setUploadingDriver(null);
                      setSelectedFile(null);
                    }}
                    className="w-full py-4 bg-[#00B2D6] hover:bg-[#009cb9] text-white rounded-full font-bold text-sm tracking-wide transition-all shadow-md shadow-cyan-100/50 cursor-pointer border-none outline-none active:scale-[0.99]"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    );
  }

  // Otherwise, render Corporate List
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          Corporate List
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
          placeholder="Search Company Name"
          className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-xs sm:text-sm text-[#0F2E4A] placeholder-slate-400 font-semibold transition-all shadow-[0_2px_10px_rgba(0,0,0,0.005)]"
        />
      </div>

      {/* Corporates Log List */}
      <div className="space-y-4 pt-2">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          Corporate List
        </h2>

        <div className="bg-white rounded-[24px] border border-slate-100/90 shadow-[0_4px_25px_rgba(0,0,0,0.01)] overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[1000px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#00B2D6] bg-white">
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[20%]">
                    Company name
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[25%]">
                    Company email
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[15%]">
                    Num. of driver
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[15%]">
                    Services
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[15%]">
                    Location
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins text-center w-[10%]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {filteredCorporates.map((corp) => (
                  <tr
                    key={corp.id}
                    className="hover:bg-slate-50/40 transition-colors"
                  >
                    <td className="py-3.5 px-6 text-xs sm:text-sm text-[#0F2E4A] font-bold font-sans">
                      {corp.companyName}
                    </td>
                    <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                      {corp.companyEmail}
                    </td>
                    <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                      {corp.numOfDriver}
                    </td>
                    <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                      {corp.services}
                    </td>
                    <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                      {corp.location}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedCorp(corp)}
                        className="px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-[#E6FAFF] text-[#00B2D6] hover:bg-[#D0F3FC] hover:scale-105 active:scale-95 transition-all outline-none border-none cursor-pointer tracking-wider"
                      >
                        View All Driver
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
    </div>
  );
}
