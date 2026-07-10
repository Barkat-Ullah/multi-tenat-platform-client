"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { AdminLocation } from "@/redux/service/admin/locationsApi";
import type { AdminService } from "@/redux/service/admin/servicesApi";
import type { CreateAdminClinicRequest } from "@/redux/service/admin/cliniciansApi";

interface AddClinicianModalProps {
  isOpen: boolean;
  isSaving: boolean;
  locations: AdminLocation[];
  services: AdminService[];
  isOptionsLoading: boolean;
  onClose: () => void;
  onSave: (data: CreateAdminClinicRequest) => Promise<boolean>;
}

export default function AddClinicianModal({
  isOpen,
  isSaving,
  locations,
  services,
  isOptionsLoading,
  onClose,
  onSave,
}: AddClinicianModalProps) {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gmcNumber, setGmcNumber] = useState("");
  const [locationId, setLocationId] = useState("");
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [isParking, setIsParking] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setName("");
    setEmail("");
    setPhone("");
    setGmcNumber("");
    setLocationId("");
    setSelectedServiceIds([]);
    setIsParking(false);
    setErrors({});

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleToggleService = (serviceId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((item) => item !== serviceId)
        : [...prev, serviceId],
    );
    setErrors((prev) => ({ ...prev, services: "" }));
  };

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email.";
    }
    if (!phone.trim()) newErrors.phone = "Phone number is required.";
    if (!gmcNumber.trim()) newErrors.gmcNumber = "GMC Number is required.";
    if (!locationId) newErrors.location = "Location is required.";
    if (selectedServiceIds.length === 0) {
      newErrors.services = "Select at least one service.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const saved = await onSave({
      email: email.trim(),
      fullName: name.trim(),
      phoneNumber: phone.trim(),
      clinicGmcNumber: gmcNumber.trim(),
      serviceId: selectedServiceIds,
      locationId,
      isParking,
    });

    if (saved) onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close add clinician dialog"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 max-h-[92vh] w-full max-w-[620px] overflow-y-auto rounded-[32px] border border-slate-100 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] animate-in fade-in zoom-in-95 sm:p-8"
      >
        <div className="flex items-center justify-between border-b border-slate-100/80 pb-4">
          <h2 className="font-poppins text-xl font-extrabold text-[#0F2E4A] sm:text-2xl">
            Add New Clinician
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E6FAFF] text-[#00B2D6] hover:bg-[#D0F3FC]"
            aria-label="Close add clinician dialog"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-poppins text-sm font-extrabold text-[#0F2E4A] sm:text-base">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-[#0F2E4A]">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Medical Clinic"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#0F2E4A] placeholder:text-slate-400 focus:border-[#00B2D6] focus:outline-none focus:ring-1 focus:ring-[#00B2D6]"
                />
                {errors.name && <p className="mt-1 text-[10px] font-bold text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-[#0F2E4A]">
                  Email Address
                </label>
                <input
                  type="text"
                  placeholder="clinic@email.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#0F2E4A] placeholder:text-slate-400 focus:border-[#00B2D6] focus:outline-none focus:ring-1 focus:ring-[#00B2D6]"
                />
                {errors.email && <p className="mt-1 text-[10px] font-bold text-red-500">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-[#0F2E4A]">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+44 7700 900000"
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value);
                    setErrors((prev) => ({ ...prev, phone: "" }));
                  }}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#0F2E4A] placeholder:text-slate-400 focus:border-[#00B2D6] focus:outline-none focus:ring-1 focus:ring-[#00B2D6]"
                />
                {errors.phone && <p className="mt-1 text-[10px] font-bold text-red-500">{errors.phone}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-[#0F2E4A]">
                  GMC Number
                </label>
                <input
                  type="text"
                  placeholder="e.g.,1234567"
                  value={gmcNumber}
                  onChange={(event) => {
                    setGmcNumber(event.target.value);
                    setErrors((prev) => ({ ...prev, gmcNumber: "" }));
                  }}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#0F2E4A] placeholder:text-slate-400 focus:border-[#00B2D6] focus:outline-none focus:ring-1 focus:ring-[#00B2D6]"
                />
                {errors.gmcNumber && <p className="mt-1 text-[10px] font-bold text-red-500">{errors.gmcNumber}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100/60 pt-2">
            <h3 className="font-poppins text-sm font-extrabold text-[#0F2E4A] sm:text-base">
              Professional Information
            </h3>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#0F2E4A]">
                Location
              </label>
              <select
                value={locationId}
                onChange={(event) => {
                  setLocationId(event.target.value);
                  setErrors((prev) => ({ ...prev, location: "" }));
                }}
                disabled={isOptionsLoading}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#0F2E4A] focus:border-[#00B2D6] focus:outline-none focus:ring-1 focus:ring-[#00B2D6] disabled:opacity-60"
              >
                <option value="">Select location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.locationName}
                  </option>
                ))}
              </select>
              {errors.location && <p className="mt-1 text-[10px] font-bold text-red-500">{errors.location}</p>}
            </div>

            <label className="flex items-center gap-2.5 text-sm font-bold text-[#0F2E4A]">
              <input
                type="checkbox"
                checked={isParking}
                onChange={(event) => setIsParking(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 accent-[#00B2D6]"
              />
              Parking Available
            </label>
          </div>

          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-[#0F2E4A]">
              Services
            </label>
            <div className="grid grid-cols-1 gap-x-4 gap-y-3.5 sm:grid-cols-2">
              {services.map((service) => {
                const isChecked = selectedServiceIds.includes(service.id);
                return (
                  <label key={service.id} className="flex cursor-pointer select-none items-center gap-2.5">
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                        isChecked
                          ? "border-[#00B2D6] bg-[#00B2D6] text-white"
                          : "border-[#B2ECF7] bg-white hover:border-[#00B2D6]"
                      }`}
                    >
                      {isChecked && (
                        <svg className="h-3.5 w-3.5 fill-none stroke-[3] stroke-white" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleService(service.id)}
                      className="sr-only"
                    />
                    <span className="truncate text-xs font-semibold text-[#0F2E4A] sm:text-sm">
                      {service.title}
                    </span>
                  </label>
                );
              })}
            </div>
            {isOptionsLoading && <div className="h-10 animate-pulse rounded-2xl bg-slate-100" />}
            {!isOptionsLoading && services.length === 0 && (
              <p className="text-xs font-bold text-slate-400">No services available.</p>
            )}
            {errors.services && <p className="mt-1 text-[10px] font-bold text-red-500">{errors.services}</p>}
          </div>
        </div>

        <div className="mt-8 flex justify-start">
          <button
            type="submit"
            disabled={isSaving || isOptionsLoading}
            className="rounded-full bg-[#00B2D6] px-8 py-3 text-sm font-bold text-white shadow-md shadow-cyan-100/50 transition-all hover:bg-[#009cb9] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
}
