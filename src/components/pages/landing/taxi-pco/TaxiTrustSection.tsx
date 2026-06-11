"use client";

import { ShieldCheck, Lock, MapPin, Star, Stethoscope } from "lucide-react";
import type { TaxiTrustItem } from "@/app/data/TaxiMedicalData";
import { cn } from "@/lib/utils";

const iconMap: Record<string, any> = {
  ShieldCheck,
  Lock,
  MapPin,
  Star,
};

interface TaxiTrustSectionProps {
  trustItems: TaxiTrustItem[];
}

export default function TaxiTrustSection({ trustItems }: TaxiTrustSectionProps) {
  return (
    <section className="bg-white py-16 md:py-20 lg:py-24 poppins border-b border-slate-100">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F2E4A] text-center mb-12 md:mb-16 tracking-tight">
          Trusted by drivers across the UK
        </h2>

        {/* 4-Column Grid with Custom Teal/Blue Borders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-b border-[#00B2D6]/20">
          {trustItems.map((item, index) => {
            const Icon = iconMap[item.iconName] || Stethoscope;
            
            // Apply borders responsive logic:
            // Column 1: border-b, md:border-r, lg:border-b-0
            // Column 2: border-b, lg:border-r, lg:border-b-0
            // Column 3: border-b, md:border-b-0, md:border-r
            // Column 4: no border
            const borderClasses = cn(
              "border-[#00B2D6]/20",
              index === 0 && "border-b md:border-r lg:border-b-0",
              index === 1 && "border-b md:border-r-0 lg:border-r lg:border-b-0",
              index === 2 && "border-b md:border-b-0 md:border-r",
              index === 3 && "border-0"
            );

            return (
              <div
                key={index}
                className={cn(
                  "flex flex-col items-center text-center p-8 sm:p-10 transition-all duration-300 hover:bg-slate-50/50 group",
                  borderClasses
                )}
              >
                {/* Circular Icon Container */}
                <div className="w-[60px] h-[60px] rounded-full bg-[#E6F8FC] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-[#00B2D6] stroke-[2]" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#0F2E4A] mb-3 tracking-tight">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-[13px] sm:text-[14px] text-slate-500 leading-relaxed max-w-[240px]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
