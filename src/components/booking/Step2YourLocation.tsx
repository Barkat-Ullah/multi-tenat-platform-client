"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Search, MapPin, Calendar, Car, ArrowRight } from "lucide-react";
import { clinicLocations } from "@/app/data/LocationsData";

// Dynamically import BookingMap with SSR disabled
const BookingMap = dynamic(
  () => import("./BookingMap"),
  { 
    ssr: false, 
    loading: () => (
      <div className="h-[350px] md:h-[500px] bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-400">
        Loading interactive map...
      </div>
    ) 
  }
);

interface Step2YourLocationProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedClinicId: string | null;
  setSelectedClinicId: (id: string | null) => void;
  visibleCount: number;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
  enrichedClinics: any[];
  onBookClinic: (clinicId: string) => void;
}

export default function Step2YourLocation({
  searchQuery,
  setSearchQuery,
  selectedClinicId,
  setSelectedClinicId,
  visibleCount,
  setVisibleCount,
  enrichedClinics,
  onBookClinic
}: Step2YourLocationProps) {
  return (
    <div className="w-full">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] tracking-tight leading-tight mb-4">
        Your Location
      </h2>

      {/* Postcode Search Input */}
      <div className="relative w-full mb-8 shadow-sm">
        <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter Town & Postcode"
          className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00B2D6]/40 focus:border-[#00B2D6] font-semibold text-sm sm:text-base text-[#0F2E4A] placeholder-slate-400 bg-white"
        />
      </div>

      {/* Split map & list pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Pane - Interactive map */}
        <div className="lg:col-span-4 h-[400px] lg:h-[520px]">
          <BookingMap 
            clinics={clinicLocations}
            selectedClinicId={selectedClinicId}
            onSelectClinic={(id) => setSelectedClinicId(id)}
          />
        </div>

        {/* Right Pane - Clinic listing */}
        <div className="lg:col-span-8 h-[400px] lg:h-[520px] flex flex-col">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm h-full flex flex-col justify-between overflow-hidden">
            
            <div className="divide-y divide-slate-100 flex-1 overflow-y-auto overflow-x-hidden pr-1">
              {enrichedClinics.slice(0, visibleCount).map((clinic, index) => {
                const isSelected = selectedClinicId === clinic.id;
                return (
                  <div 
                    key={clinic.id} 
                    onClick={() => setSelectedClinicId(clinic.id)}
                    className={`py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 cursor-pointer transition-all duration-200 ${
                      index === 0 ? "pt-0" : ""
                    } ${
                      isSelected ? "bg-[#E6FAFF]/10 px-2 rounded-2xl" : "hover:bg-slate-50/50 px-2 rounded-2xl"
                    }`}
                  >
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Green Dot Online Tag */}
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#00B2D6] uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                        <span>Online</span>
                      </div>

                      {/* Clinic Name */}
                      <h4 className="text-base sm:text-lg font-extrabold text-[#0F2E4A] leading-tight pr-2">
                        {clinic.name}
                      </h4>

                      {/* Card Details stats */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2">
                        {/* Distance */}
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-[#A3B3C2] shrink-0" />
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 leading-tight">Distance</span>
                            <span className="text-xs sm:text-sm font-extrabold text-[#0F2E4A] leading-tight truncate">{clinic.distanceStr}</span>
                          </div>
                        </div>
                        {/* Earliest Appointment */}
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-[#A3B3C2] shrink-0" />
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 leading-tight">Earliest Appointment</span>
                            <span className="text-xs sm:text-sm font-extrabold text-[#0F2E4A] leading-tight truncate">{clinic.earliestDate}</span>
                          </div>
                        </div>
                        {/* Car Parking */}
                        <div className="flex items-center gap-2">
                          <Car size={16} className="text-[#A3B3C2] shrink-0" />
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 leading-tight">Car Parking</span>
                            <span className="text-xs sm:text-sm font-extrabold text-[#0F2E4A] leading-tight truncate">{clinic.parkingStr}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Book Now Button inside card */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookClinic(clinic.id);
                      }}
                      className="bg-[#00B2D6] hover:bg-[#0092B3] text-white rounded-full pl-6 pr-2 py-2.5 font-poppins font-extrabold text-sm transition-all duration-300 flex items-center justify-between gap-3 shadow-md shadow-[#00B2D6]/10 shrink-0 hover:scale-[1.02]"
                    >
                      <span>Book Now</span>
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#00B2D6] shrink-0">
                        <ArrowRight size={12} strokeWidth={3} />
                      </div>
                    </button>
                  </div>
                );
              })}

              {/* Empty state clinic fallbacks */}
              {enrichedClinics.length === 0 && (
                <div className="text-center py-10">
                  <MapPin className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <h4 className="text-[#0F2E4A] font-extrabold text-sm sm:text-base">No clinics found</h4>
                  <p className="text-[#55697A] text-xs font-medium mt-1">Try another town or postcode search.</p>
                </div>
              )}
            </div>

            {/* Show More link button */}
            {enrichedClinics.length > visibleCount && (
              <div className="flex justify-end pt-4 border-t border-slate-100 mt-4">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 3)}
                  className="text-[#00B2D6] hover:text-[#0092B3] text-xs sm:text-sm font-extrabold transition-all hover:underline"
                >
                  Show More
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
