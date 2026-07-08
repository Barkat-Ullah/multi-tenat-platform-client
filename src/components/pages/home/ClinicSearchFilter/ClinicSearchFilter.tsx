"use client";

import { useState } from "react";
import { Search, Compass, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ClinicSearchFilter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.warning("Please enter a town or postcode first.");
      return;
    }
    toast.success(`Searching for clinics near: "${searchQuery}"`);
    window.location.href = `/locations?search=${encodeURIComponent(searchQuery.trim())}`;
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    toast.loading("Retrieving your current location...", { id: "geolocation-toast" });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        toast.success("Location resolved successfully!", { id: "geolocation-toast" });
        setIsLocating(false);
        window.location.href = `/locations?lat=${latitude}&lng=${longitude}`;
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Unable to retrieve location. Please type your postcode manually.", {
          id: "geolocation-toast",
        });
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  return (
    <div className="relative z-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-16 md:-mt-24 poppins">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-[0_15px_50px_rgba(0,0,0,0.06)] p-4 sm:p-6 md:p-8 lg:p-10">

        {/* Title Block */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-[#0F2E4A] tracking-tight">
            Find Your Nearest Clinic
          </h2>
          <p className="text-[#55697A] text-sm md:text-base font-medium mt-1">
            Enter your town or postcode to find a clinic near you.
          </p>
        </div>

        {/* Input & Action buttons Form */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4 lg:gap-6"
        >
          {/* Input field */}
          <div className="relative flex items-center flex-1 bg-white rounded-2xl sm:rounded-full border border-slate-200 focus-within:border-[#00B2D6] focus-within:shadow-[0_0_0_1px_#00B2D6] transition-all duration-300 px-4 sm:px-5 py-3.5 md:py-4 group">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-[#00B2D6] transition-colors flex-shrink-0" />
            <input
              type="text"
              placeholder="Enter Town & Postcode"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none pl-3 text-[#0F2E4A] font-semibold placeholder-slate-400 text-sm md:text-base"
            />
          </div>

          {/* Find Clinic Button */}
          <button
            type="submit"
            className="w-full sm:w-auto rounded-full bg-[#00B2D6] hover:bg-[#0092B3] text-white font-bold px-8 py-3.5 md:py-4 transition-all duration-300 shadow-sm hover:shadow text-sm md:text-base flex-shrink-0 text-center"
          >
            Find Clinic
          </button>

          {/* Desktop Divider */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0 self-stretch py-2">
            <div className="w-[1px] bg-slate-200 flex-1" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Or</span>
            <div className="w-[1px] bg-slate-200 flex-1" />
          </div>

          {/* Mobile Divider */}
          <div className="flex lg:hidden items-center justify-center gap-4 my-1 flex-shrink-0">
            <div className="h-[1px] flex-1 bg-slate-200" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Or</span>
            <div className="h-[1px] flex-1 bg-slate-200" />
          </div>

          {/* Use My Location Pill */}
          <button
            type="button"
            onClick={handleGetLocation}
            disabled={isLocating}
            className="flex w-full sm:w-auto items-center justify-center sm:justify-start gap-3 px-5 sm:px-6 py-3 bg-[#E6F8FC] rounded-2xl hover:bg-[#D5F3FA] disabled:opacity-75 transition-all duration-300 cursor-pointer flex-shrink-0 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#00B2D6] flex-shrink-0 shadow-sm">
              {isLocating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Compass className="h-5 w-5" />
              )}
            </div>
            <div className="min-w-0">
              <span className="block text-sm font-extrabold text-[#0F2E4A]">
                Use My Location
              </span>
              <span className="block text-[11px] text-[#55697A] font-semibold leading-tight mt-0.5">
                Find clinic near you
              </span>
            </div>
          </button>

        </form>

      </div>
    </div>
  );
}
