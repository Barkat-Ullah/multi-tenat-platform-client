"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface AddClinicianModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    clinicianName: string;
    email: string;
    locations: string;
    speciality: string;
    status: "Active" | "Inactive";
    phone?: string;
    gmcNumber?: string;
  }) => void;
}

export default function AddClinicianModal({
  isOpen,
  onClose,
  onSave,
}: AddClinicianModalProps) {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gmcNumber, setGmcNumber] = useState("");
  const [location, setLocation] = useState("");
  const [selectedSpecialities, setSelectedSpecialities] = useState<string[]>(["Hgv/Bus Medical"]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset inputs when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setName("");
      setEmail("");
      setPhone("");
      setGmcNumber("");
      setLocation("");
      setSelectedSpecialities(["Hgv/Bus Medical"]);
      setErrors({});
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const specialitiesList = [
    "Hgv/Bus Medical",
    "Taxi & PCO Medical",
    "Ambulance Medical",
    "Forklift/Crane Medical",
    "Motorsport Medical",
    "Pre-Employment Medicals",
  ];

  const handleToggleSpeciality = (spec: string) => {
    setSelectedSpecialities((prev) =>
      prev.includes(spec) ? prev.filter((item) => item !== spec) : [...prev, spec]
    );
  };

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email.";
    }
    if (!phone.trim()) newErrors.phone = "Phone number is required.";
    if (!gmcNumber.trim()) newErrors.gmcNumber = "GMC Number is required.";
    if (!location.trim()) newErrors.location = "Location is required.";
    if (selectedSpecialities.length === 0) {
      newErrors.specialities = "Select at least one speciality.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Map speciality names cleanly for listing (e.g. "HGV/Bus Medical, Taxi & PCO Medical")
    const formattedSpeciality = selectedSpecialities
      .map((spec) => {
        if (spec === "Hgv/Bus Medical") return "HGV Medicals";
        if (spec === "Taxi & PCO Medical") return "Taxi Medicals";
        return spec.replace(" Medicals", "").replace(" Medical", "");
      })
      .join(", ");

    onSave({
      clinicianName: name.trim(),
      email: email.trim(),
      locations: location.trim(),
      speciality: formattedSpeciality || "General Staff",
      status: "Active",
      phone: phone.trim(),
      gmcNumber: gmcNumber.trim(),
    });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-[620px] rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-6 sm:p-8 relative z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100/80">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2E4A] font-poppins">
            Add New Clinician
          </h2>
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#E6FAFF] text-[#00B2D6] hover:bg-[#D0F3FC] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer border-none outline-none"
            aria-label="Close modal"
          >
            <X size={18} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Inputs Fields */}
        <div className="space-y-6 mt-6">
          {/* Group 1: Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm sm:text-base font-extrabold text-[#0F2E4A] font-poppins">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Raj"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-sm text-[#0F2E4A] placeholder-slate-400 font-semibold transition-all"
                />
                {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
                  Email Address
                </label>
                <input
                  type="text"
                  placeholder="raj.patel@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-sm text-[#0F2E4A] placeholder-slate-400 font-semibold transition-all"
                />
                {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="07700 900456"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                }}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-sm text-[#0F2E4A] placeholder-slate-400 font-semibold transition-all"
              />
              {errors.phone && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Group 2: Professional Information */}
          <div className="space-y-4 pt-2 border-t border-slate-100/60">
            <h3 className="text-sm sm:text-base font-extrabold text-[#0F2E4A] font-poppins">
              Professional Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
                  GMC Number
                </label>
                <input
                  type="text"
                  placeholder="e.g., 1234567"
                  value={gmcNumber}
                  onChange={(e) => {
                    setGmcNumber(e.target.value);
                    if (errors.gmcNumber) setErrors((prev) => ({ ...prev, gmcNumber: "" }));
                  }}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-sm text-[#0F2E4A] placeholder-slate-400 font-semibold transition-all"
                />
                {errors.gmcNumber && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.gmcNumber}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    if (errors.location) setErrors((prev) => ({ ...prev, location: "" }));
                  }}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-sm text-[#0F2E4A] placeholder-slate-400 font-semibold transition-all"
                />
                {errors.location && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.location}</p>}
              </div>
            </div>
          </div>

          {/* Group 3: Speciality Grid */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-[#0F2E4A] font-sans">
              Speciality
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3.5 gap-x-4">
              {specialitiesList.map((spec) => {
                const isChecked = selectedSpecialities.includes(spec);
                return (
                  <label key={spec} className="flex items-center gap-2.5 cursor-pointer select-none">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                        isChecked
                          ? "bg-[#00B2D6] border-[#00B2D6] text-white"
                          : "bg-white border-[#B2ECF7] hover:border-[#00B2D6]"
                      }`}
                    >
                      {isChecked && (
                        <svg className="w-3.5 h-3.5 stroke-[3] stroke-white fill-none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleSpeciality(spec)}
                      className="sr-only"
                    />
                    <span className="text-xs sm:text-sm font-semibold text-[#0F2E4A] truncate">
                      {spec}
                    </span>
                  </label>
                );
              })}
            </div>
            {errors.specialities && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.specialities}</p>}
          </div>
        </div>

        {/* Submit Button (Bottom Left aligned) */}
        <div className="mt-8 flex justify-start">
          <button
            type="submit"
            className="px-8 py-3 bg-[#00B2D6] hover:bg-[#009cb9] rounded-full text-white font-bold text-sm tracking-wide transition-all active:scale-[0.98] shadow-md shadow-cyan-100/50 cursor-pointer border-none outline-none"
          >
            Submit
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
}
