"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { medicalTypesData, otherMedicalsData } from "@/app/data/LandingPageData";

export default function MedicalTypesSection() {
  const [isOpen, setIsOpen] = useState(false);


  return (
    <section className="py-14 sm:py-16 md:py-24 bg-white poppins">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading Section */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0F2E4A] tracking-tight leading-tight">
            Choose Your Medical Type
          </h2>
          <p className="text-[#55697A] text-sm md:text-base font-medium mt-3">
            Professional driver medicals approved by DVLA. Fast, convenient, and compliant.
          </p>
        </div>

        {/* Grid of Medical Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
          {medicalTypesData.map((card, index) => (
            <div
              key={index}
              className="flex flex-col xs:flex-row xs:items-center gap-4 p-4 border border-[#00B2D6]/10 rounded-2xl bg-white shadow-sm hover:shadow-md hover:border-[#00B2D6]/20 transition-all duration-300 group"
            >
              {/* Image Block */}
              <div className="relative w-full xs:w-24 h-36 xs:h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 96px, 112px"
                />
              </div>

              {/* Text content & CTA */}
              <div className="flex-1 flex flex-col items-start min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-[#0F2E4A] break-words w-full group-hover:text-[#00B2D6] transition-colors duration-200">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#55697A] mt-1 mb-4 w-full font-medium leading-relaxed">
                  {card.description}
                </p>
                <Link
                  href={card.link}
                  className="inline-flex items-center justify-between rounded-full bg-[#00B2D6] pl-4 pr-1.5 py-1 text-xs sm:text-sm font-bold text-white transition-all duration-300 hover:bg-[#0092B3] shadow-sm hover:shadow-md"
                >
                  <span className="mr-3 tracking-wide">Book Now</span>
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#00B2D6] group-hover:translate-x-0.5 transition-transform duration-200">
                    <ArrowRight size={12} strokeWidth={2.5} />
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Other Medicals Accordion */}
        <div className="w-full">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full text-left p-4 sm:p-5 md:p-6 border border-[#00B2D6]/10 rounded-2xl bg-white shadow-sm hover:shadow-md hover:border-[#00B2D6]/20 transition-all duration-300 flex items-start sm:items-center justify-between gap-3 group"
            aria-expanded={isOpen}
          >
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
              {/* Clipboard Custom SVG Icon */}
              <div className="w-12 h-12 rounded-xl bg-[#EBFBFF] flex items-center justify-center text-[#00B2D6] flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-clipboard-list"
                >
                  <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <path d="M12 11h4" />
                  <path d="M12 16h4" />
                  <path d="M8 11h.01" />
                  <path d="M8 16h.01" />
                </svg>
              </div>
              <div className="min-w-0">
                <h4 className="text-base sm:text-lg font-bold text-[#00B2D6] group-hover:text-[#0092B3] transition-colors">
                  Other Medicals
                </h4>
                <p className="text-xs sm:text-sm text-[#55697A] font-medium mt-0.5 leading-relaxed">
                  View and book a range of other medical services
                </p>
              </div>
            </div>

            <div className="text-gray-400 p-2 hover:text-[#00B2D6] transition-colors duration-200 flex-shrink-0">
              {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </div>
          </button>

          {/* Collapsible Panel */}
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                key="content"
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={{
                  open: { opacity: 1, height: "auto" },
                  collapsed: { opacity: 0, height: 0 }
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-4 sm:p-6 border border-[#00B2D6]/10 rounded-2xl bg-gray-50/50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {otherMedicalsData.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 p-4 rounded-xl bg-white border border-gray-100 hover:border-[#00B2D6]/30 hover:shadow-sm transition-all duration-300"
                    >
                      <div className="min-w-0 pr-3">
                        <h5 className="text-sm font-bold text-[#0F2E4A] break-words">{item.name}</h5>
                        <p className="text-xs text-[#55697A] font-medium mt-0.5 leading-relaxed">{item.description}</p>
                      </div>
                      <Link
                        href={`/booking?type=${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                        className="text-xs font-bold text-[#00B2D6] hover:text-[#0092B3] flex items-center gap-1 group flex-shrink-0"
                      >
                        <span className="tracking-wide">Book</span>
                        <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                      </Link>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
