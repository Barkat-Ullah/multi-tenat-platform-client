"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Phone, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TaxiCouncilOption } from "@/app/data/TaxiMedicalData";

interface TaxiBookingSectionProps {
  councils: TaxiCouncilOption[];
}

export default function TaxiBookingSection({ councils }: TaxiBookingSectionProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCouncil, setSelectedCouncil] = useState<TaxiCouncilOption | null>(null);
  const [showError, setShowError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter councils based on user input
  const filteredCouncils = councils.filter((council) =>
    council.council.toLowerCase().includes(searchQuery.toLowerCase())
  );


  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle redirection to booking page
  const handleBookingRedirect = () => {
    if (!selectedCouncil) {
      setShowError(true);
      return;
    }
    setShowError(false);
    const params = new URLSearchParams({
      type: "taxi-pco",
      councilLng: String(selectedCouncil.longitude),
      councilLat: String(selectedCouncil.latitude),
    });
    router.push(`/booking?${params.toString()}`);
  };

  return (
    <section className="bg-[#FAFAFA] py-16 md:py-20 lg:py-24 poppins border-b border-slate-100">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Header Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F2E4A] text-center mb-4 tracking-tight">
          Book Your Taxi Medicals
        </h2>
        
        {/* Subtitle */}
        <p className="text-[15px] sm:text-base text-slate-600 text-center mb-10 max-w-lg leading-relaxed">
          Choose your local authority to get started
        </p>

        {/* Form Container (stacked dropdown & button) */}
        <div className="w-full max-w-[580px] space-y-4">
          
          {/* Custom Searchable Select Dropdown */}
          <div ref={dropdownRef} className="relative">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(!isOpen);
                  setShowError(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between rounded-full bg-white border px-6 py-4 text-left shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#00B2D6]/20",
                  selectedCouncil ? "pr-20" : "pr-14",
                  isOpen ? "border-[#00B2D6]" : "border-slate-200 hover:border-slate-300",
                  showError ? "border-red-500 bg-red-50/10 focus:ring-red-500/20" : ""
                )}
              >
                <span className={cn(
                  "text-[15px] truncate",
                  selectedCouncil ? "text-slate-800 font-medium" : "text-slate-400"
                )}>
                  {selectedCouncil?.council || "Choose your local Authority"}
                </span>

                <ChevronDown
                  size={20}
                  className={cn(
                    "absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 transition-transform duration-300",
                    isOpen ? "rotate-180 text-[#00B2D6]" : ""
                  )}
                />
              </button>

              {selectedCouncil && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCouncil(null);
                    setSearchQuery("");
                  }}
                  className="absolute right-12 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#00B2D6]/20"
                  aria-label="Clear selected local authority"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {showError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute left-2 -bottom-6 flex items-center gap-1.5 text-xs font-semibold text-red-500"
                >
                  <AlertCircle size={14} />
                  <span>Please select a local authority to continue</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dropdown Options List */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 4 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-50 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] overflow-hidden"
                >
                  {/* Search Input Box */}
                  <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
                    <Search size={18} className="text-slate-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Type to search your council..."
                      className="w-full bg-transparent text-[14px] text-slate-800 focus:outline-none placeholder-slate-400"
                      autoFocus
                    />
                  </div>

                  {/* List Container */}
                  <ul className="max-h-60 overflow-y-auto px-2 py-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    {filteredCouncils.length > 0 ? (
                      filteredCouncils.map((council) => (
                        <li key={council.council}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCouncil(council);
                              setIsOpen(false);
                              setSearchQuery("");
                              setShowError(false);
                            }}
                            className={cn(
                              "w-full text-left px-4 py-2.5 rounded-2xl text-[14px] transition-colors cursor-pointer focus:outline-none focus:bg-[#E6F8FC] focus:text-[#00B2D6]",
                              selectedCouncil?.council === council.council
                                ? "bg-[#E6F8FC] text-[#00B2D6] font-bold"
                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                            )}
                          >
                            {council.council}
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-6 text-center text-[14px] text-slate-400 font-medium">
                        No local authority found matching &quot;{searchQuery}&quot;
                      </li>
                    )}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Book Appointment CTA Button */}
          <button
            type="button"
            onClick={handleBookingRedirect}
            className="w-full py-4 text-center rounded-full bg-[#00B2D6] text-white text-base font-bold shadow-[0_4px_14px_rgba(0,178,214,0.15)] transition-all duration-300 hover:bg-[#0092B3] hover:shadow-[0_6px_20px_rgba(0,178,214,0.25)] focus:outline-none focus:ring-2 focus:ring-[#00B2D6]/20 active:scale-[0.98]"
          >
            Book Your Appointment
          </button>
          
        </div>

        {/* Footer Support Info */}
        <div className="mt-8 flex items-center justify-center gap-2 text-center text-sm md:text-base text-slate-500 font-medium">
          <Phone size={16} className="text-[#00B2D6]" />
          <span>
            Need Help? Call{" "}
            <a
              href="tel:02035855500"
              className="font-bold text-[#0F2E4A] hover:underline hover:text-[#00B2D6] transition-colors"
            >
              020 3585 5500
            </a>{" "}
            (Lines open 8am - 10pm, 7 days a week)
          </span>
        </div>

      </div>
    </section>
  );
}
