"use client";

import Image from "next/image";
import { Search, Clock, UserCheck, Stethoscope } from "lucide-react";
import type { TaxiMedicalRecordsData } from "@/app/data/TaxiMedicalData";

const iconMap: Record<string, any> = {
  Search,
  Clock,
  UserCheck,
};

interface TaxiMedicalRecordsSectionProps {
  data: TaxiMedicalRecordsData;
}

export default function TaxiMedicalRecordsSection({ data }: TaxiMedicalRecordsSectionProps) {
  // Map string icon names to Lucide icons
  const getIcon = (iconName: string) => {
    return iconMap[iconName] || Stethoscope;
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white poppins relative overflow-hidden border-b border-slate-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-[#0F2E4A] tracking-tight leading-tight mb-4">
            {data.title}
          </h2>
          <p className="text-[#55697A] text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* Staggered steps & image grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Staggered Steps (from home page How It Works section) */}
          <div className="lg:col-span-7 pr-0 lg:pr-10 relative">
            <div className="flex flex-col gap-6 md:gap-8">
              {data.steps.map((step, index) => {
                const isEven = index % 2 === 1;
                const Icon = getIcon(step.iconName);

                return (
                  <div
                    key={step.number}
                    className={`flex items-start sm:items-center gap-3 sm:gap-4 md:gap-8 ${
                      isEven ? "sm:justify-end text-left" : "sm:justify-start text-left"
                    }`}
                  >
                    {/* Render Number on Left for Odd, Card on Right */}
                    {!isEven && (
                      <span className="font-ribeye text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-[#E0EFF2] select-none leading-none w-12 sm:w-16 md:w-24 text-center flex-shrink-0">
                        {step.number}
                      </span>
                    )}

                    {/* Step Card Wrapper */}
                    <div className="flex-1 flex items-start gap-3 sm:gap-4 p-4 sm:p-5 md:p-6 bg-white border border-[#00B2D6]/10 shadow-[0_4px_25px_rgba(0,0,0,0.03)] rounded-2xl max-w-[450px] min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#EBFBFF] flex items-center justify-center text-[#00B2D6] flex-shrink-0">
                        <Icon className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm md:text-[14px] text-[#55697A] font-semibold leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Render Number on Right for Even, Card on Left */}
                    {isEven && (
                      <span className="font-ribeye text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-[#E0EFF2] select-none leading-none w-12 sm:w-16 md:w-24 text-center flex-shrink-0">
                        {step.number}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Smiling Doctor Image with Frame Illustration */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
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
              <div className="relative aspect-[1.1/1] overflow-hidden bg-center rounded-3xl border border-slate-200 bg-slate-50 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
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

        </div>

      </div>
    </section>
  );
}
