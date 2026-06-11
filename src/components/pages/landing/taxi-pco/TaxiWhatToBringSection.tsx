"use client";

import Image from "next/image";
import { Sparkles, FileText, Glasses, ClipboardList, IdCard, Pill, Stethoscope } from "lucide-react";
import type { TaxiWhatToBringData } from "@/app/data/TaxiMedicalData";

const iconMap: Record<string, any> = {
  FileText,
  Glasses,
  ClipboardList,
  IdCard,
  Pill,
};

interface TaxiWhatToBringSectionProps {
  data: TaxiWhatToBringData;
}

export default function TaxiWhatToBringSection({ data }: TaxiWhatToBringSectionProps) {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24 poppins relative overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            {/* Left Dot-Line Decorator */}
            <div className="flex items-center gap-0">
              <div className="h-1.5 w-1.5 rounded-full bg-[#00B2D6]" />
              <div className="h-[1.5px] w-8 sm:w-16 bg-gradient-to-r from-[#00B2D6] to-[#00B2D6]/20" />
            </div>
            <div className="flex items-center gap-1.5 text-[#00B2D6] font-bold text-xs sm:text-sm uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{data.eyebrow}</span>
            </div>
            {/* Right Line-Dot Decorator */}
            <div className="flex items-center gap-0">
              <div className="h-[1.5px] w-8 sm:w-16 bg-gradient-to-l from-[#00B2D6] to-[#00B2D6]/20" />
              <div className="h-1.5 w-1.5 rounded-full bg-[#00B2D6]" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-[#0F2E4A] tracking-tight leading-tight mb-4">
            {data.title}
          </h2>
          <p className="text-[#55697A] text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* 2-Column Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Image with sketch illustration frame (from HgvBusIntroSection styling) */}
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="relative w-full max-w-[560px]">
              {data.backgroundIllustration && (
                <div className="absolute -left-24 -top-12 h-[calc(100%+2rem)] w-[calc(100%+2rem)] pointer-events-none select-none">
                  <Image
                    src={data.backgroundIllustration}
                    alt={data.backgroundIllustrationAlt || ""}
                    fill
                    className="object-contain object-center"
                    sizes="(max-width: 1024px) 100vw, 620px"
                  />
                </div>
              )}
              <div className="relative aspect-[1.15/1] overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <Image
                  src={data.image}
                  alt={data.imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 560px"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Right Side: List of 5 items */}
          <div className="space-y-6 sm:space-y-8 order-1 lg:order-2 max-w-[560px] mx-auto lg:mx-0">
            {data.items.map((item, index) => {
              const Icon = iconMap[item.iconName] || Stethoscope;

              return (
                <div key={index} className="flex items-start gap-4 sm:gap-5 group">
                  {/* Icon Container */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#E6F8FC] flex items-center justify-center text-[#00B2D6] flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  
                  {/* Text Details */}
                  <div className="space-y-1 sm:space-y-1.5">
                    <h3 className="text-base sm:text-lg font-bold text-[#0F2E4A] leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-[13px] sm:text-[14px] text-slate-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
