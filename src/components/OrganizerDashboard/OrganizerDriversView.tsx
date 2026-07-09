"use client";

import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, Plus, MoreVertical, X, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { useGetCorporateAllDriversQuery, CorporateDriver, useCreateCorporateDriverMutation, useDeleteCorporateDriverMutation } from "@/redux/service/corporate/corporateDashboardApi";

// Convert UTC ISO string → user's local timezone + system locale (dynamic for all countries)
function formatLocalDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Skeleton row — mirrors all 7 table columns with pulsing blocks
function displayValue(value: unknown): string {
  if (value === null || value === undefined) return "N/A";
  if (typeof value === "string" && value.trim() === "") return "N/A";
  return String(value);
}

function formatModalDate(iso: string | null | undefined): string {
  if (!iso) return "N/A";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "N/A" : formatLocalDate(iso);
}

function DriverRowSkeleton() {
  return (
    <tr className="border-b border-slate-100 animate-pulse">
      <td className="py-3.5 px-6"><div className="h-3.5 bg-slate-200 rounded-lg w-32" /></td>
      <td className="py-3.5 px-6"><div className="h-3 bg-slate-200 rounded-lg w-40" /></td>
      <td className="py-3.5 px-6"><div className="h-3 bg-slate-200 rounded-lg w-24" /></td>
      <td className="py-3.5 px-6"><div className="h-3 bg-slate-200 rounded-lg w-28" /></td>
      <td className="py-3.5 px-6"><div className="h-3 bg-slate-200 rounded-lg w-28" /></td>
      <td className="py-3.5 px-6 text-center"><div className="h-6 bg-slate-200 rounded-full w-20 mx-auto" /></td>
      <td className="py-3.5 px-6 text-center"><div className="h-7 w-7 bg-slate-200 rounded-full mx-auto" /></td>
    </tr>
  );
}

export default function OrganizerDriversView() {
  const { data, isLoading } = useGetCorporateAllDriversQuery();
  const [createCorporateDriver, { isLoading: isCreating }] = useCreateCorporateDriverMutation();
  const [deleteCorporateDriver] = useDeleteCorporateDriverMutation();
  const [drivers, setDrivers] = useState<CorporateDriver[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingDriver, setViewingDriver] = useState<CorporateDriver | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (data?.data) {
      setDrivers(data.data);
    }
  }, [data]);

  // New Driver Form States
  const [newDriverName, setNewDriverName] = useState("");
  const [newDriverEmail, setNewDriverEmail] = useState("");
  const [newDriverPhone, setNewDriverPhone] = useState("");
  const [newDriverService, setNewDriverService] = useState("Taxi Medicals");
  const [newDriverLastMedical, setNewDriverLastMedical] = useState("02 Jun 2025");
  const [newDriverExpiryDate, setNewDriverExpiryDate] = useState("02 Jun 2026");
  const [newDriverStatus, setNewDriverStatus] = useState<"Completed" | "Pending">("Completed");

  // Dropdown/Popover State
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // Filter list
  const filteredDrivers = useMemo(() => {
    return drivers?.filter((d) => {
      const search = searchTerm.toLowerCase();
      return (
        d.fullName.toLowerCase().includes(search) ||
        d.email.toLowerCase().includes(search) ||
        d.service?.toLowerCase().includes(search)
      );
    });
  }, [drivers, searchTerm]);

  // Form submit handler
  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriverName.trim() || !newDriverEmail.trim()) {
      toast.error("Driver Name and Email are required.");
      return;
    }

    try {
      const response = await createCorporateDriver({
        fullName: newDriverName,
        email: newDriverEmail,
        phoneNumber: newDriverPhone,
      }).unwrap();

      if (response?.success) {
        toast.success(`Driver ${newDriverName} added successfully!`);
      } else {
        toast.success(`Driver ${newDriverName} added successfully!`);
      }

      // Reset and close
      setNewDriverName("");
      setNewDriverEmail("");
      setNewDriverPhone("");
      setIsAddModalOpen(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to add driver.");
    }
  };

  // Toggle status handler
  const handleToggleStatus = (id: string) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, medicalResult: d.medicalResult === "Completed" ? "Pending" : "Completed" } : d
      )
    );
    toast.success("Driver medical status updated.");
    setActiveDropdownId(null);
  };

  // Delete driver handler
  const handleDeleteDriver = async (id: string, name: string) => {
    try {
      const promise = deleteCorporateDriver(id).unwrap();
      toast.promise(promise, {
        loading: `Deleting driver ${name}...`,
        success: `Driver ${name} deleted successfully!`,
        error: (err: any) => err?.data?.message || `Failed to delete driver ${name}.`,
      });
      await promise;
    } catch (error) {
      console.error(error);
    }
    setActiveDropdownId(null);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">
      {/* Header section */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          My Drivers
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 pl-5 pr-4 py-2.5 rounded-full bg-[#00B2D6] hover:bg-[#009cb9] text-white text-xs sm:text-sm font-bold tracking-wide transition-all active:scale-[0.98] shadow-md shadow-cyan-100/50 cursor-pointer border-none outline-none"
        >
          <span>Add Driver</span>
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Plus size={14} className="stroke-[3]" />
          </div>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-4.5 w-4.5 text-[#00B2D6]" />
        </span>
        <input
          type="text"
          placeholder="Search Driver"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-xs sm:text-sm text-[#0F2E4A] placeholder-slate-400 font-semibold transition-all shadow-[0_2px_8px_rgba(0,0,0,0.005)]"
        />
      </div>

      {/* Table log container */}
      <div className="bg-white rounded-[24px] border border-slate-100/90 shadow-[0_4px_25px_rgba(0,0,0,0.01)] overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[1000px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#00B2D6] bg-white">
                <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[18%]">
                  Driver Name
                </th>
                <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[18%]">
                  Email
                </th>
                <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[18%]">
                  Service
                </th>
                <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[14%]">
                  Last Medical
                </th>
                <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[14%]">
                  Expiry Date
                </th>
                <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins text-center w-[12%]">
                  Medical Status
                </th>
                <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins text-center w-[6%]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {isLoading ? (
                <>{[...Array(6)].map((_, i) => <DriverRowSkeleton key={i} />)}</>
              ) : (
                <>
                  {filteredDrivers?.map((driver) => (
                <tr key={driver.id} className="hover:bg-slate-50/40 transition-colors">
                  {/* Driver Name */}
                  <td className="py-3.5 px-6 text-xs sm:text-sm text-[#0F2E4A] font-bold font-sans">
                    {displayValue(driver.fullName)}
                  </td>
                  {/* Email */}
                  <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                    {displayValue(driver.email)}
                  </td>
                  {/* Service */}
                  <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                    {displayValue(driver.service)}
                  </td>
                  {/* Last Medical */}
                  <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                    {formatModalDate(driver.lastMedical)}
                  </td>
                  {/* Expiry Date */}
                  <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                    {formatModalDate(driver.expiryDate)}
                  </td>
                  {/* Medical Status */}
                  <td className="py-3.5 px-6 text-center">
                    {!driver.medicalResult?.trim() ? (
                      <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:text-xs">
                        N/A
                      </span>
                    ) : driver.medicalResult === "Completed" ? (
                      <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-[#E8F8F5] text-[#10B981] border border-[#A3E4D7]/20 uppercase tracking-wider">
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-[#FEF9E7] text-[#D9A700] border border-[#F9E79F]/20 uppercase tracking-wider">
                        Pending
                      </span>
                    )}
                  </td>
                  {/* Action Ellipsis Dropdown */}
                  <td className="py-3.5 px-6 text-center relative">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveDropdownId(activeDropdownId === driver.id ? null : driver.id)
                      }
                      className="w-7 h-7 rounded-full bg-[#EAF8FC] hover:bg-[#D0F3FC] text-[#00B2D6] transition-all flex items-center justify-center cursor-pointer border-none outline-none active:scale-95"
                    >
                      <MoreVertical size={15} className="stroke-[2.5]" />
                    </button>

                     {/* Popover actions card */}
                    {activeDropdownId === driver.id && (
                      <div className="absolute right-6 mt-1.5 w-40 bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] py-2 z-10 text-left animate-in fade-in slide-in-from-top-1 duration-150">
                        <button
                          onClick={() => {
                            setViewingDriver(driver);
                            setActiveDropdownId(null);
                          }}
                          className="w-full px-4 py-2 hover:bg-slate-50 text-xs font-bold text-[#0F2E4A] flex items-center gap-2 border-none bg-transparent outline-none cursor-pointer"
                        >
                          <Eye size={13} className="text-slate-400" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleDeleteDriver(driver.id, driver.fullName)}
                          className="w-full px-4 py-2 hover:bg-red-50 text-xs font-bold text-red-600 flex items-center gap-2 border-none bg-transparent outline-none cursor-pointer"
                        >
                          <Trash2 size={13} className="text-red-400" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
                  ))}
                  {filteredDrivers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-sm font-bold text-slate-400 font-sans">
                        No registered drivers found.
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Driver Overlay Modal */}
      {isAddModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setIsAddModalOpen(false)}
          />

          <div className="bg-white w-full max-w-[480px] rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-6 sm:p-8 relative z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2E4A] font-poppins">
                Add New Driver
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-9 h-9 rounded-full bg-[#E6FAFF] text-[#00B2D6] hover:bg-[#D0F3FC] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer border-none outline-none"
              >
                <X size={18} className="stroke-[2.5]" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddDriver} className="space-y-5 text-xs sm:text-sm text-[#0F2E4A] font-sans mt-6">
              {/* Section Subheading */}
              <h3 className="text-sm sm:text-base font-extrabold text-[#0F2E4A] font-poppins mt-2">
                Personal Information
              </h3>

              {/* Grid: Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newDriverName}
                    onChange={(e) => setNewDriverName(e.target.value)}
                    placeholder="e.g., Raj"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B2D6] text-xs sm:text-sm font-semibold text-[#0F2E4A] placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newDriverEmail}
                    onChange={(e) => setNewDriverEmail(e.target.value)}
                    placeholder="raj.patel@email.com"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B2D6] text-xs sm:text-sm font-semibold text-[#0F2E4A] placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Full Width: Phone */}
              <div>
                <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
                  Phone
                </label>
                <input
                  type="text"
                  value={newDriverPhone}
                  onChange={(e) => setNewDriverPhone(e.target.value)}
                  placeholder="02839490"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B2D6] text-xs sm:text-sm font-semibold text-[#0F2E4A] placeholder-slate-400"
                />
              </div>

              {/* Submit Button Left-Aligned */}
              <div className="pt-2 flex justify-start">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-8 py-2.5 bg-[#00B2D6] hover:bg-[#009cb9] rounded-full text-white font-extrabold text-xs sm:text-sm tracking-wide transition-all active:scale-[0.98] shadow-md shadow-cyan-100/50 cursor-pointer border-none outline-none disabled:opacity-50"
                >
                  {isCreating ? "Adding..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* View Driver Details Overlay Modal */}
      {viewingDriver && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setViewingDriver(null)}
          />

          <div className="bg-white w-full max-w-[480px] rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-6 sm:p-8 relative z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2E4A] font-poppins">
                Driver Details
              </h2>
              <button
                onClick={() => setViewingDriver(null)}
                className="w-9 h-9 rounded-full bg-[#E6FAFF] text-[#00B2D6] hover:bg-[#D0F3FC] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer border-none outline-none"
              >
                <X size={18} className="stroke-[2.5]" />
              </button>
            </div>

            {/* Details Fields */}
            <div className="space-y-4 text-sm sm:text-base text-[#0F2E4A] font-sans mt-6">
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Driver Name:</span>
                <span className="font-semibold text-slate-500">{displayValue(viewingDriver.fullName)}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Email Address:</span>
                <span className="font-semibold text-slate-500">{displayValue(viewingDriver.email)}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Service Type:</span>
                <span className="font-semibold text-slate-500">{displayValue(viewingDriver.service)}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Last Medical:</span>
                <span className="font-semibold text-slate-500">{formatModalDate(viewingDriver.lastMedical)}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Expiry Date:</span>
                <span className="font-semibold text-slate-500">{formatModalDate(viewingDriver.expiryDate)}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-extrabold whitespace-nowrap">Medical Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  !viewingDriver.medicalResult
                    ? "bg-slate-100 text-slate-500"
                    : viewingDriver.medicalResult === "Completed"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-amber-50 text-amber-600"
                }`}>
                  {displayValue(viewingDriver.medicalResult)}
                </span>
              </div>
            </div>

            {/* Action Footer */}
            <div className="mt-8">
              <button
                onClick={() => setViewingDriver(null)}
                className="w-full py-3 bg-[#00B2D6] hover:bg-[#009cb9] rounded-2xl text-white font-bold text-sm tracking-wide transition-all active:scale-[0.99] shadow-md shadow-cyan-100"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
