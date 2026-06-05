"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Clock, ArrowRight, Sparkles, Map } from "lucide-react";
import { nearestClinicsData } from "@/app/data/LandingPageData";

export default function NearestClinicSection() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter clinics based on user query
  const filteredClinics = nearestClinicsData.filter((clinic) =>
    clinic.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="py-14 sm:py-20 md:py-28 bg-[#FCFDFE] poppins relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            {/* Left Dot-Line Decorator */}
            <div className="flex items-center gap-0">
              <div className="h-1.5 w-1.5 rounded-full bg-[#00B2D6]" />
              <div className="h-[1.5px] w-8 sm:w-16 bg-gradient-to-r from-[#00B2D6] to-[#00B2D6]/20" />
            </div>
            <div className="flex items-center gap-1.5 text-[#00B2D6] font-bold text-xs sm:text-sm uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Nearest Clinic</span>
            </div>
            {/* Right Line-Dot Decorator */}
            <div className="flex items-center gap-0">
              <div className="h-[1.5px] w-8 sm:w-16 bg-gradient-to-l from-[#00B2D6] to-[#00B2D6]/20" />
              <div className="h-1.5 w-1.5 rounded-full bg-[#00B2D6]" />
            </div>
          </div>

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
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredClinics.map((clinic) => (
                <motion.div
                  layout
                  key={clinic.city}
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
                        {clinic.city}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#55697A] font-semibold mt-1">
                        {clinic.count} clinics
                      </p>
                    </div>
                    <MapPin className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  </div>

                  <div className="flex items-center gap-1.5 mt-4 text-[#00B2D6] font-bold text-xs sm:text-sm">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Next available: {clinic.nextAvailable}</span>
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
              <p className="text-slate-400 text-sm mt-1">Try searching another UK city or postcode.</p>
            </motion.div>
          )}

          {/* Footer View All Action Button */}
          <div className="text-center mt-16">
            <Link
              href="/booking"
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
