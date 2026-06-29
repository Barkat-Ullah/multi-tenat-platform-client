"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { city: string; address: string; bookingsCount: number; cliniciansCount: number }) => void;
}

export default function AddLocationModal({
  isOpen,
  onClose,
  onSave,
}: AddLocationModalProps) {
  const [mounted, setMounted] = useState(false);
  const [city, setCity] = useState("");
  const [debouncedCity, setDebouncedCity] = useState("London");
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCity("");
      setDebouncedCity("London");
      setError("");
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Debounce the map update so it doesn't reload on every single keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      if (city.trim()) {
        setDebouncedCity(city.trim());
      } else {
        setDebouncedCity("London");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [city]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!city.trim()) {
      setError("Location name is required.");
      return;
    }

    onSave({
      city: city.trim(),
      address: `${city.trim()} Clinic, United Kingdom`,
      bookingsCount: Math.floor(Math.random() * 15) + 5, // Simulated random bookings count
      cliniciansCount: Math.floor(Math.random() * 3) + 1, // Simulated random clinicians count
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
        className="bg-white w-full max-w-[500px] rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-6 sm:p-8 relative z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100/80">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2E4A] font-poppins">
            Add New Location
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

        {/* Inputs & Real Google Map */}
        <div className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-bold text-[#0F2E4A] mb-2 font-sans">
              Location Name
            </label>
            <input
              type="text"
              placeholder="e.g., London"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                if (error) setError("");
              }}
              className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-sm text-[#0F2E4A] placeholder-slate-400 font-semibold transition-all"
            />
            {error && <p className="text-red-500 text-xs font-bold mt-1.5">{error}</p>}
          </div>

          {/* Real Google Map Embed Container */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-sm mt-4 h-[240px] bg-slate-100">
            <iframe
              title="Interactive Google Map"
              width="100%"
              height="100%"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(debouncedCity)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              className="border-none w-full h-full"
              allowFullScreen
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-start">
          <button
            type="submit"
            className="px-8 py-3 bg-[#00B2D6] hover:bg-[#009cb9] rounded-full text-white font-bold text-sm tracking-wide transition-all active:scale-[0.98] shadow-md shadow-cyan-100/50 cursor-pointer border-none outline-none"
          >
            Save
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
}
