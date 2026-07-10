"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, ArrowRight, Map } from "lucide-react";
import { useGetPublicLocationsQuery } from "@/redux/service/locations/locationsApi";
import SectionEyebrow from "@/components/shared/SectionEyebrow";

const HOME_LOCATIONS_LIMIT = 10;

const NearestClinicSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="status" aria-label="Loading nearest clinics">
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={index}
        className="flex flex-col justify-between p-5 sm:p-6 bg-white border border-[#00B2D6]/10 shadow-[0_4px_25px_rgba(0,0,0,0.02)] rounded-2xl min-h-[140px]"
      >
        <div className="flex justify-between items-start">
          <div className="min-w-0 pr-2 w-full">
            <div className="h-5 w-2/3 rounded bg-slate-100 animate-pulse" />
            <div className="mt-3 h-4 w-24 rounded bg-slate-100 animate-pulse" />
          </div>
          <div className="h-5 w-5 rounded-full bg-slate-100 animate-pulse" />
        </div>
        <div className="mt-5 h-4 w-36 rounded bg-slate-100 animate-pulse" />
      </div>
    ))}
    <span className="sr-only">Loading nearest clinics...</span>
  </div>
);

export default function NearestClinicSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: locationsResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetPublicLocationsQuery({
    page: 1,
    limit: HOME_LOCATIONS_LIMIT,
  });

  const locations = locationsResponse?.data || [];

  // Filter clinics based on user query
  const filteredClinics = locations.filter((clinic) =>
    clinic.locationName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const isLocationsLoading = isLoading || isFetching;

  return (
    <section className="py-14 sm:py-20 md:py-28 bg-[#FCFDFE] poppins relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <SectionEyebrow>Nearest Clinic</SectionEyebrow>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0F2E4A] tracking-tight leading-tight">
            Find Your Nearest Clinic
          </h2>
          <p className="text-[#55697A] text-sm md:text-base font-medium mt-3">
            Over 100 clinics across the UK - find one near you
          </p>
        </div>

        {/* Search Input Bar (Refined Pill design with cyan outline glow) */}
        <div className="relative max-w-xl mx-auto mb-10 sm:mb-16 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-[#00B2D6]/20 focus-within:border-[#00B2D6]/40 rounded-full bg-white transition-all duration-300 h-14 sm:h-[60px] flex items-center">
          <div className="absolute inset-y-0 left-4 sm:left-5 flex items-center pointer-events-none text-slate-400">
            <Search className="h-5 w-5 text-black" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter your city and postcode"
            className="w-full pl-11 sm:pl-12 pr-4 sm:pr-6 h-full rounded-full text-[#0F2E4A] placeholder-slate-400 focus:outline-none font-semibold text-sm sm:text-base border-none bg-transparent"
          />
        </div>

        {/* Clinics Grid Layout */}
        <div>
          {isLocationsLoading ? (
            <NearestClinicSkeleton />
          ) : isError ? (
            <div className="text-center py-12 bg-white border border-red-100 rounded-2xl max-w-lg mx-auto">
              <MapPin className="h-12 w-12 text-red-200 mx-auto mb-4" />
              <p className="text-[#0F2E4A] font-extrabold text-lg">Failed to load clinics</p>
              <p className="text-[#55697A] text-sm font-medium mt-1">
                Please try again to see available locations.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-5 inline-flex items-center justify-center rounded-full bg-[#00B2D6] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#0092B3]"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredClinics.map((clinic) => (
                    <motion.div
                      layout
                      key={clinic.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -4, borderColor: "rgba(0, 178, 214, 0.25)", boxShadow: "0 10px 30px rgba(0, 178, 214, 0.04)" }}
                      className="flex flex-col justify-between p-5 sm:p-6 bg-white border border-[#00B2D6]/10 shadow-[0_4px_25px_rgba(0,0,0,0.02)] rounded-2xl transition-all duration-300 min-h-[140px]"
                    >
                      <div className="flex justify-between items-start">
                        <div className="min-w-0 pr-2">
                          <h3 className="text-lg font-bold text-[#0F2E4A] truncate">
                            {clinic.locationName}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#55697A] font-semibold mt-1">
                            {clinic.totalClinicsAdded} clinic{clinic.totalClinicsAdded === 1 ? "" : "s"}
                          </p>
                        </div>
                        <MapPin className="h-5 w-5 text-slate-400 flex-shrink-0" />
                      </div>

                      <div className="flex items-center gap-1.5 mt-4 text-[#00B2D6] font-bold text-xs sm:text-sm">
                        <Map className="h-3.5 w-3.5" />
                        <span>{clinic.totalBookings} booking{clinic.totalBookings === 1 ? "" : "s"}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Empty search fallback */}
              {filteredClinics.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-semibold text-lg">No clinics found for &quot;{searchQuery}&quot;</p>
                  <p className="text-slate-400 text-sm mt-1">Try searching another city or postcode.</p>
                </motion.div>
              )}
            </>
          )}

          <div className="text-center mt-16">
            <Link
              href="/locations"
              className="inline-flex items-center justify-between rounded-full bg-[#00B2D6] pl-6 pr-1.5 py-1.5 font-sans font-bold text-white transition-all duration-300 hover:bg-[#0092B3] group shadow-sm hover:shadow-md"
            >
              <span className="text-sm font-semibold tracking-wide mr-4">View All Clinics</span>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#00B2D6] group-hover:translate-x-0.5 transition-transform duration-200">
                <ArrowRight size={16} strokeWidth={2.5} />
              </div>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
