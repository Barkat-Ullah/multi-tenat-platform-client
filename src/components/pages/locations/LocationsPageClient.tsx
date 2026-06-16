"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Phone, Sparkles, Navigation, X, ArrowRight } from "lucide-react";
import { clinicLocations, ClinicLocation } from "@/app/data/LocationsData";
import BookingCTASection from "@/components/pages/home/BookingCTASection/BookingCTASection";

// Haversine formula to calculate distance in miles
function getDistanceInMiles(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function LocationsPageClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Use browser geolocation to sort clinics
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationError("Could not retrieve your location. Check browser settings.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Reset geolocation sorting
  const handleResetLocation = () => {
    setUserCoords(null);
    setLocationError(null);
  };

  // Process and sort clinics
  const displayedClinics = useMemo(() => {
    // 1. Filter clinics by searchQuery
    const filtered = clinicLocations.filter((clinic) => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      return (
        clinic.name.toLowerCase().includes(query) ||
        clinic.city.toLowerCase().includes(query) ||
        clinic.address.toLowerCase().includes(query)
      );
    });

    // 2. Add distance calculations if user location is available
    let mapped = filtered.map((clinic) => {
      if (userCoords) {
        const distance = getDistanceInMiles(
          userCoords.lat,
          userCoords.lng,
          clinic.lat,
          clinic.lng
        );
        return { ...clinic, distance };
      }
      return clinic;
    });

    // 3. Sort by distance if location available, otherwise alphabetical
    if (userCoords) {
      mapped.sort((a, b) => ((a as any).distance || 0) - ((b as any).distance || 0));
    } else {
      mapped.sort((a, b) => a.city.localeCompare(b.city));
    }

    return mapped;
  }, [searchQuery, userCoords]);

  return (
    <div className="bg-[#FCFDFE] poppins min-h-screen">
      
      {/* Hero Header block */}
      <section className="bg-white border-b border-slate-100 py-12 md:py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center flex-wrap gap-1 text-[13px] sm:text-[14px] font-bold text-[#1F2937] tracking-wide"
          >
            <Link href="/" className="transition-colors hover:text-[#00B2D6] font-extrabold text-[#1F2937]">
              Home
            </Link>
            <span className="text-[#1F2937] mx-1 opacity-80 select-none">»</span>
            <span className="font-extrabold text-[#1F2937] opacity-90">Locations</span>
          </nav>

          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex items-center gap-0">
                <div className="h-1.5 w-1.5 rounded-full bg-[#00B2D6]" />
                <div className="h-[1.5px] w-8 sm:w-16 bg-gradient-to-r from-[#00B2D6] to-[#00B2D6]/20" />
              </div>
              <div className="flex items-center gap-1.5 text-[#00B2D6] font-bold text-xs sm:text-sm uppercase tracking-widest">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Our Clinics</span>
              </div>
              <div className="flex items-center gap-0">
                <div className="h-[1.5px] w-8 sm:w-16 bg-gradient-to-l from-[#00B2D6] to-[#00B2D6]/20" />
                <div className="h-1.5 w-1.5 rounded-full bg-[#00B2D6]" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F2E4A] tracking-tight leading-tight">
              Find Your Nearest Clinic
            </h1>
            <p className="text-[#55697A] text-sm sm:text-base font-medium mt-3 leading-relaxed">
              Enter your town or postcode to find a clinic near you.
            </p>
          </div>

          {/* Search Panel Container */}
          <div className="mt-10 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white rounded-2xl md:rounded-full border border-slate-200/80 p-3 shadow-[0_12px_40px_rgba(15,46,74,0.04)]">
              
              {/* Text Search Input */}
              <div className="flex items-center gap-3 w-full md:flex-1 px-4 py-2">
                <Search className="h-5 w-5 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Town & Postcode"
                  className="w-full bg-transparent text-[#0F2E4A] placeholder-slate-400 focus:outline-none font-semibold text-sm sm:text-base"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Find Clinic Button */}
              <button 
                className="w-full md:w-auto px-8 py-3.5 rounded-xl md:rounded-full bg-[#00B2D6] hover:bg-[#0092B3] text-white font-extrabold text-sm sm:text-base transition-colors shrink-0 shadow-sm shadow-[#00B2D6]/20"
              >
                Find Clinic
              </button>

              {/* Or Divider */}
              <div className="flex items-center justify-center gap-3 w-full md:w-auto shrink-0 md:px-2">
                <div className="h-[1px] w-12 bg-slate-200 md:hidden" />
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">or</span>
                <div className="h-[1px] w-12 bg-slate-200 md:hidden" />
                <div className="hidden md:block w-[1px] h-8 bg-slate-200" />
              </div>

              {/* Use My Location Button */}
              <button
                onClick={handleUseMyLocation}
                disabled={isLocating}
                className="w-full md:w-auto flex items-center justify-center md:justify-start gap-3 px-6 py-2.5 rounded-xl md:rounded-full bg-[#EBF7FC] hover:bg-[#D4F0FC] disabled:bg-slate-100 disabled:text-slate-400 text-[#00B2D6] transition-colors text-left shrink-0"
              >
                <div className="p-2 bg-white rounded-full text-[#00B2D6] shadow-sm flex items-center justify-center">
                  <Navigation className="h-4 w-4 fill-current transform rotate-45" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold leading-tight">
                    {isLocating ? "Locating..." : "Use My Location"}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-[#00B2D6]/85 font-bold">
                    Find a clinic near you
                  </div>
                </div>
              </button>
            </div>

            {/* Error Message */}
            {locationError && (
              <p className="text-red-500 text-xs sm:text-sm font-semibold text-center mt-3">
                {locationError}
              </p>
            )}

            {/* Active Filters Display */}
            {userCoords && (
              <div className="flex justify-center mt-4">
                <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-700 shadow-sm animate-fadeIn">
                  <span>Sorting by distance to your current location</span>
                  <button
                    onClick={handleResetLocation}
                    className="p-0.5 rounded-full hover:bg-emerald-100 text-emerald-600 transition-colors"
                    title="Reset sorting"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Grid of Cards block */}
      <section className="py-12 md:py-16 lg:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="sr-only">Clinics List</h2>
        
        <motion.div 
          layout 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {displayedClinics.map((clinic) => (
              <motion.div
                layout
                key={clinic.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                whileHover={{ 
                  y: -5, 
                  borderColor: "rgba(0, 178, 214, 0.25)",
                  boxShadow: "0 12px 35px rgba(15,46,74,0.06)" 
                }}
                className="flex flex-row bg-white border border-slate-200/70 shadow-[0_4px_20px_rgba(0,0,0,0.015)] rounded-2xl overflow-hidden transition-all duration-300 items-stretch"
              >
                
                {/* Image Section */}
                <div className="p-3.5 pr-0 w-2/5 max-w-[170px] sm:max-w-[200px] flex-shrink-0 flex items-stretch">
                  <div className="relative w-full h-full min-h-[140px] sm:min-h-[170px] rounded-xl overflow-hidden shadow-sm bg-slate-100">
                    <Image
                      src={clinic.image}
                      alt={`${clinic.name} City View`}
                      fill
                      sizes="(max-w-768px) 140px, 200px"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      unoptimized
                    />
                  </div>
                </div>

                {/* Info & Content Section */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    {/* Header Row */}
                    <div className="flex flex-wrap items-baseline justify-between gap-1.5 mb-1.5">
                      <h3 className="text-[#0F2E4A] font-extrabold text-base sm:text-lg leading-snug truncate">
                        {clinic.name}
                      </h3>
                      
                      {/* Distance Badge */}
                      {(clinic as any).distance !== undefined && (
                        <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                          {((clinic as any).distance as number).toFixed(1)} mi away
                        </span>
                      )}
                    </div>

                    {/* Address Text */}
                    <p className="text-[#55697A] text-xs sm:text-sm font-semibold leading-relaxed line-clamp-3 mb-4 pr-1">
                      {clinic.address}
                    </p>
                  </div>

                  {/* Actions Column matching mockup */}
                  <div className="flex flex-col gap-2.5 mt-auto pt-3 border-t border-slate-100">
                    <a
                      href={`tel:${clinic.phone}`}
                      className="flex items-center gap-2 text-[#00B2D6] hover:text-[#0092B3] text-xs sm:text-sm font-bold tracking-wide transition-colors group w-fit"
                    >
                      <div className="p-1.5 bg-[#EBF7FC] group-hover:bg-[#00B2D6]/10 rounded-lg transition-colors">
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                      </div>
                      <span className="underline underline-offset-4 decoration-2 decoration-[#00B2D6]/20 group-hover:decoration-[#0092B3] transition-all">
                        {clinic.phone}
                      </span>
                    </a>
                    
                    <a
                      href={clinic.googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#00B2D6] hover:text-[#0092B3] text-xs sm:text-sm font-bold tracking-wide transition-colors group w-fit"
                    >
                      <div className="p-1.5 bg-[#EBF7FC] group-hover:bg-[#00B2D6]/10 rounded-lg transition-colors">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                      </div>
                      <span className="underline underline-offset-4 decoration-2 decoration-[#00B2D6]/20 group-hover:decoration-[#0092B3] transition-all">
                        Direction
                      </span>
                    </a>
                  </div>

                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state fallbacks */}
        {displayedClinics.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-3xl border border-slate-200/60 shadow-[0_4px_30px_rgba(0,0,0,0.01)] max-w-lg mx-auto"
          >
            <MapPin className="h-14 w-14 text-slate-300 mx-auto mb-4" />
            <h3 className="text-[#0F2E4A] font-extrabold text-lg sm:text-xl">
              No Clinics Found
            </h3>
            <p className="text-[#55697A] text-sm font-medium mt-2 px-6">
              We couldn&apos;t find any clinics matching &quot;{searchQuery}&quot;. Try searching for another city, town, or postcode.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00B2D6] hover:bg-[#0092B3] text-white font-extrabold text-xs sm:text-sm transition-all"
            >
              Clear Search Query
            </button>
          </motion.div>
        )}
      </section>

      {/* Booking CTA Section at the bottom */}
      <div className="bg-white border-t border-slate-100 py-4">
        <BookingCTASection />
      </div>

    </div>
  );
}
