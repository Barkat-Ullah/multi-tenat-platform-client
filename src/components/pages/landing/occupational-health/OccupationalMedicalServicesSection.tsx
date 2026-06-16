"use client";

import Link from "next/link";
import type { OccupationalServicesData } from "@/app/data/OccupationalHealthData";

interface OccupationalMedicalServicesSectionProps {
  data: OccupationalServicesData;
}

export default function OccupationalMedicalServicesSection({ data }: OccupationalMedicalServicesSectionProps) {
  // Helper to render inline custom SVGs matching mockup perfectly
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "crane":
        return (
          <svg
            className="w-6 h-6 text-[#00B2D6]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Custom crane hook tower icon */}
            <path d="M12 2v6" />
            <path d="M7 8h10" />
            <path d="M10 8l-2 5h8l-2-5" />
            <path d="M12 13v4" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        );
      case "hardhat":
        return (
          <svg
            className="w-6 h-6 text-[#00B2D6]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Custom hardhat icon */}
            <path d="M2 17a10 10 0 0 1 20 0v1H2v-1z" />
            <path d="M12 2v4" />
            <path d="M8 4.5a8.5 8.5 0 0 1 8 0" />
          </svg>
        );
      case "plane":
        return (
          <svg
            className="w-6 h-6 text-[#00B2D6]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Custom airplane icon */}
            <path d="M17.8 19.2L16 11l3.5-3.5a2.1 2.1 0 1 0-3-3L13 8 4.8 6.2a1 1 0 0 0-1.2 1.2L6 11.5l-4 4v1l4-1.5 4 4h1l-1.5-4 4 4 1.2-1.2z" />
          </svg>
        );
      case "ship":
        return (
          <svg
            className="w-6 h-6 text-[#00B2D6]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Custom ship/boat icon */}
            <path d="M2 17l2-2 4 4 4-4 4 4 4-4 2 2" />
            <path d="M12 13V3H9M19 13V6h-4M5 13V9h4M2 14h20v3H2z" />
          </svg>
        );
      case "heart":
        return (
          <svg
            className="w-6 h-6 text-[#00B2D6]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Custom heartbeat pulse icon */}
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            <path d="M12 5v14M8 12h8" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24 poppins relative overflow-hidden border-b border-slate-100">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-[#00B2D6] font-bold text-sm tracking-widest uppercase">
            {data.tagline}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-[#0F2E4A] tracking-tight leading-tight mt-3 mb-6">
            {data.title}
          </h2>
          <p className="text-[#55697A] text-sm sm:text-base font-medium max-w-[680px] mx-auto leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Services Cards */}
          {data.services.map((service) => (
            <div 
              key={service.id}
              className="bg-white rounded-2xl border border-slate-100 p-8 sm:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col items-center text-center transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 group"
            >
              {/* Icon Circle Container */}
              <div className="w-14 h-14 bg-[#E6FAFF] rounded-full flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                {renderIcon(service.icon)}
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-extrabold text-[#0F2E4A] mb-3">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-slate-500 text-[13px] sm:text-[14px] leading-relaxed font-medium">
                {service.description}
              </p>
            </div>
          ))}

          {/* Book in Today CTA Card */}
          <div className="bg-[#E6FAFF]/30 border border-[#BDEAF2] rounded-2xl p-8 sm:p-10 flex flex-col items-center text-center justify-between shadow-[0_4px_20px_rgba(0,178,214,0.02)]">
            <div className="w-full flex flex-col items-center">
              <h3 className="text-lg sm:text-xl font-extrabold text-[#0F2E4A] mb-2">
                {data.ctaCard.title}
              </h3>
              <p className="text-[#55697A] text-sm font-medium mb-6">
                {data.ctaCard.description}
              </p>
              
              {/* Book Now Button */}
              <Link
                href={data.ctaCard.bookNowHref}
                className="w-full bg-[#00B2D6] hover:bg-[#0092B3] text-white font-bold py-3.5 rounded-full transition-all duration-300 shadow-[0_4px_14px_rgba(0,178,214,0.15)] text-center text-sm sm:text-base mb-6"
              >
                {data.ctaCard.bookNowLabel}
              </Link>
            </div>

            <div className="w-full flex flex-col items-center">
              {/* Mid text indicator */}
              <p className="text-[#0F2E4A] font-bold text-xs sm:text-[13px] tracking-wide mb-4">
                Visit one of our 40+ clinics
              </p>

              {/* Clinic Finder Button */}
              <Link
                href={data.ctaCard.clinicFinderHref}
                className="w-full border border-[#00B2D6] hover:bg-[#00B2D6]/5 text-[#00B2D6] font-bold py-3.5 rounded-full transition-all duration-300 text-center text-sm sm:text-base"
              >
                {data.ctaCard.clinicFinderLabel}
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
