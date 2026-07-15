"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Navigation, X, ArrowRight } from "lucide-react";
import BookingCTASection from "@/components/pages/home/BookingCTASection/BookingCTASection";
import SectionEyebrow from "@/components/shared/SectionEyebrow";
import {
  type PublicLocation,
  useGetCouncilNearestLocationsQuery,
  useGetPublicLocationsQuery,
} from "@/redux/service/locations/locationsApi";

const PAGE_LIMIT = 10;

type DisplayLocation = PublicLocation & {
  distance?: number;
};

const getGoogleMapsLink = (location: PublicLocation) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${location.locationName} ${location.lat},${location.lng}`
  )}`;

const LocationsGridSkeleton = () => (
  <div
    className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
    role="status"
    aria-label="Loading locations"
  >
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={index}
        className="flex flex-row bg-white border border-slate-200/70 shadow-[0_4px_20px_rgba(0,0,0,0.015)] rounded-2xl overflow-hidden items-stretch"
      >
        <div className="p-3.5 pr-0 w-2/5 max-w-[170px] sm:max-w-[200px] flex-shrink-0">
          <div className="h-full min-h-[140px] sm:min-h-[170px] rounded-xl bg-slate-100 animate-pulse" />
        </div>
        <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 min-w-0">
          <div>
            <div className="h-5 w-2/3 rounded bg-slate-100 animate-pulse" />
            <div className="mt-3 h-4 w-full rounded bg-slate-100 animate-pulse" />
            <div className="mt-2 h-4 w-3/4 rounded bg-slate-100 animate-pulse" />
          </div>
          <div className="mt-6 border-t border-slate-100 pt-3 space-y-2.5">
            <div className="h-8 w-32 rounded-lg bg-slate-100 animate-pulse" />
            <div className="h-8 w-28 rounded-lg bg-slate-100 animate-pulse" />
          </div>
        </div>
      </div>
    ))}
    <span className="sr-only">Loading locations...</span>
  </div>
);

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
  const [currentPage, setCurrentPage] = useState(1);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [councilCoords, setCouncilCoords] = useState<{ councilLat: number; councilLng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const publicLocationsQuery = useGetPublicLocationsQuery(
    {
      page: currentPage,
      limit: PAGE_LIMIT,
    },
    { skip: Boolean(councilCoords) },
  );
  const councilNearestQuery = useGetCouncilNearestLocationsQuery(
    councilCoords || { councilLat: 0, councilLng: 0 },
    { skip: !councilCoords },
  );

  const activeLocationsQuery = councilCoords ? councilNearestQuery : publicLocationsQuery;
  const {
    data: locationsResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = activeLocationsQuery;

  const locations = locationsResponse?.data || [];
  const totalPages = Math.max(
    1,
    Math.ceil((locationsResponse?.meta?.total ?? locations.length) / PAGE_LIMIT)
  );
  const isLocationsLoading = isLoading || isFetching;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = params.get("search");
    const latParam = params.get("lat");
    const lngParam = params.get("lng");
    const councilLatParam = params.get("councilLat");
    const councilLngParam = params.get("councilLng");

    if (search) {
      setSearchQuery(search);
    }

    if (councilLatParam && councilLngParam) {
      const councilLat = Number(councilLatParam);
      const councilLng = Number(councilLngParam);
      if (Number.isFinite(councilLat) && Number.isFinite(councilLng)) {
        setCouncilCoords({ councilLat, councilLng });
        setUserCoords({ lat: councilLat, lng: councilLng });
        setLocationError(null);
      }
      return;
    }

    if (latParam && lngParam) {
      const lat = Number(latParam);
      const lng = Number(lngParam);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        setUserCoords({ lat, lng });
        setLocationError(null);
      }
    }
  }, []);

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
        setCouncilCoords(null);
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
    setCouncilCoords(null);
    setLocationError(null);
  };

  // Process and sort clinics
  const displayedClinics = useMemo(() => {
    // 1. Filter clinics by searchQuery
    const filtered = locations.filter((clinic) => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      return clinic.locationName.toLowerCase().includes(query);
    });

    // 2. Add distance calculations if user location is available
    const mapped: DisplayLocation[] = filtered.map((clinic) => {
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

    // 3. Sort by distance if location available, otherwise alphabetical.
    // Council-nearest results are already returned by the backend endpoint.
    if (councilCoords) {
      return mapped;
    }

    if (userCoords) {
      mapped.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    } else {
      mapped.sort((a, b) => a.locationName.localeCompare(b.locationName));
    }

    return mapped;
  }, [councilCoords, locations, searchQuery, userCoords]);

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
            <SectionEyebrow>Our Clinics</SectionEyebrow>

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
                  <span>
                    {councilCoords
                      ? "Showing nearest clinics for selected council"
                      : "Sorting by distance to your current location"}
                  </span>
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
        
        {isLocationsLoading ? (
          <LocationsGridSkeleton />
        ) : isError ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-red-100 shadow-[0_4px_30px_rgba(0,0,0,0.01)] max-w-lg mx-auto">
            <MapPin className="h-14 w-14 text-red-200 mx-auto mb-4" />
            <h3 className="text-[#0F2E4A] font-extrabold text-lg sm:text-xl">
              Failed to Load Locations
            </h3>
            <p className="text-[#55697A] text-sm font-medium mt-2 px-6">
              We could not load clinic locations right now. Please try again.
            </p>
            <button
              onClick={() => refetch()}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00B2D6] hover:bg-[#0092B3] text-white font-extrabold text-xs sm:text-sm transition-all"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
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
                        {clinic.image ? (
                          <Image
                            src={clinic.image}
                            alt={`${clinic.locationName} clinic location`}
                            fill
                            sizes="(max-width: 768px) 140px, 200px"
                            className="object-cover transition-transform duration-500 hover:scale-105"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full min-h-[140px] sm:min-h-[170px] flex-col items-center justify-center gap-2 bg-[#EBF7FC] text-[#00B2D6]">
                            <MapPin className="h-8 w-8" />
                            <span className="text-xs font-extrabold uppercase tracking-wide">
                              No image
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info & Content Section */}
                    <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        {/* Header Row */}
                        <div className="flex flex-wrap items-baseline justify-between gap-1.5 mb-1.5">
                          <h3 className="text-[#0F2E4A] font-extrabold text-base sm:text-lg leading-snug truncate">
                            {clinic.locationName}
                          </h3>
                          
                          {/* Distance Badge */}
                          {clinic.distance !== undefined && (
                            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                              {clinic.distance.toFixed(1)} mi away
                            </span>
                          )}
                        </div>

                        {/* Location Text */}
                        <p className="text-[#55697A] text-xs sm:text-sm font-semibold leading-relaxed line-clamp-3 mb-4 pr-1">
                          {clinic.totalClinicsAdded} clinic{clinic.totalClinicsAdded === 1 ? "" : "s"} available at this location.
                        </p>
                      </div>

                      {/* Actions Column matching mockup */}
                      <div className="flex flex-col gap-2.5 mt-auto pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-[#55697A] text-xs sm:text-sm font-bold tracking-wide">
                          <div className="p-1.5 bg-[#EBF7FC] rounded-lg text-[#00B2D6]">
                            <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                          </div>
                          <span>{clinic.totalBookings} booking{clinic.totalBookings === 1 ? "" : "s"}</span>
                        </div>
                        
                        <a
                          href={getGoogleMapsLink(clinic)}
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
                  {searchQuery
                    ? `We couldn't find any clinics matching "${searchQuery}". Try searching for another location.`
                    : "No clinic locations are available right now."}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00B2D6] hover:bg-[#0092B3] text-white font-extrabold text-xs sm:text-sm transition-all"
                  >
                    Clear Search Query
                  </button>
                )}
              </motion.div>
            )}

            {displayedClinics.length > 0 && totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-[#0F2E4A] transition-colors hover:border-[#00B2D6] hover:text-[#00B2D6] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm font-bold text-[#55697A]">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage >= totalPages}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-[#0F2E4A] transition-colors hover:border-[#00B2D6] hover:text-[#00B2D6] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Booking CTA Section at the bottom */}
      <div className="bg-white border-t border-slate-100 py-4">
        <BookingCTASection />
      </div>

    </div>
  );
}
