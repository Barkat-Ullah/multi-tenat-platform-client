"use client";

import React from "react";
import Image from "next/image";
import { Search, Clock, UserCheck, Sparkles } from "lucide-react";
import howItWorksHero from "@/assets/home/howItWorksHero.png";
import { howItWorksStepsData } from "@/app/data/LandingPageData";

export default function HowItWorksSection() {
  // Map string icon names to Lucide icons
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Search":
        return <Search className="h-5 w-5" />;
      case "Clock":
        return <Clock className="h-5 w-5" />;
      case "UserCheck":
        return <UserCheck className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <section className="py-16 md:py-24 bg-white poppins">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">

        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[1px] w-8 sm:w-16 bg-[#00B2D6]/30" />
            <div className="flex items-center gap-1.5 text-[#00B2D6] font-bold text-xs sm:text-sm uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              <span>How it Works</span>
            </div>
            <div className="h-[1px] w-8 sm:w-16 bg-[#00B2D6]/30" />
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0F2E4A] tracking-tight leading-tight">
            Your Medical in 3 Easy steps
          </h2>
          <p className="text-[#55697A] text-sm md:text-base font-medium mt-3">
            Book your driver medical quickly and hassle-free in just 3 simple steps.
          </p>
        </div>

        {/* Staggered steps & image grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">

          {/* Left Column: Staggered Steps */}
          <div className="lg:col-span-7 pr-0 lg:pr-10 relative">
            <div className="flex flex-col gap-6 md:gap-8">
              {howItWorksStepsData.map((step, index) => {
                const isEven = index % 2 === 1;

                return (
                  <div
                    key={step.number}
                    className={`flex items-center gap-4 md:gap-8 ${isEven ? "justify-end text-left" : "justify-start text-left"
                      }`}
                  >
                    {/* Render Number on Left for Odd, Card on Right */}
                    {!isEven && (
                      <span className="font-ribeye text-5xl md:text-7xl lg:text-8xl text-[#E0EFF2] select-none leading-none w-16 md:w-24 text-center">
                        {step.number}
                      </span>
                    )}

                    {/* Step Card Wrapper */}
                    <div className="flex-1 flex items-start gap-4 p-5 md:p-6 bg-white border border-[#00B2D6]/10 shadow-[0_4px_25px_rgba(0,0,0,0.03)] rounded-2xl max-w-[450px]">
                      <div className="w-12 h-12 rounded-full bg-[#EBFBFF] flex items-center justify-center text-[#00B2D6] flex-shrink-0">
                        {getIcon(step.iconName)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base md:text-lg font-bold text-[#0F2E4A]">
                          {step.title}
                        </h3>
                        <p className="text-xs md:text-sm text-[#55697A] font-medium mt-1 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Render Number on Right for Even, Card on Left */}
                    {isEven && (
                      <span className="font-ribeye text-5xl md:text-7xl lg:text-8xl text-[#E0EFF2] select-none leading-none w-16 md:w-24 text-center">
                        {step.number}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Vertical Line on right of steps (desktop only) */}
            <div className="hidden lg:block absolute right-0 top-6 bottom-6 w-[1.5px] bg-gradient-to-b from-[#00B2D6]/5 via-[#00B2D6]/35 to-[#00B2D6]/5" />
          </div>

          {/* Right Column: Paramedic & Ambulance Image */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full md:min-w-[520] aspect-[4/5] hover:scale-[1.01] transition-all duration-500">
              <Image
                src={howItWorksHero}
                alt="NHS Paramedic with Ambulance"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 380px"
                priority
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

