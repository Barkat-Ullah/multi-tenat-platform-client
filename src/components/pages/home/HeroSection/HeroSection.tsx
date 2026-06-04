"use client";

import { Award, Sparkles, CalendarCheck, ShieldCheck, MapPin } from "lucide-react";
import heroImage from "@/assets/herosection/hero-image.png";
import scribbleUnderline from "@/assets/herosection/hero-scribble.png";

export default function HeroSection() {
  return (
    <section
      className="relative w-full min-h-[550px] sm:min-h-[600px] md:min-h-[680px] lg:min-h-[760px] flex items-center bg-cover bg-no-repeat bg-top-center overflow-hidden  transition-all duration-700 poppins"
      style={{
        backgroundImage: `url(${heroImage.src})`,
      }}
    >
      {/* Soft gradient overlay to ensure text contrast on all devices */}
      <div className="absolute inset-0  pointer-events-none" />

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-24 relative z-10">
        <div className="max-w-[650px] flex flex-col items-start text-left">
          
          {/* Badge: GMC Registered Doctors */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00B2D6]/20 bg-white/95 px-4 py-1.5 text-xs font-semibold text-[#0F2E4A] shadow-sm backdrop-blur-md mb-6">
            <Award className="h-4 w-4 text-[#00B2D6]" />
            <span className="tracking-wide">GMC Registered Doctors</span>
            <Sparkles className="h-3.5 w-3.5 text-[#00B2D6]" />
          </div>

          {/* Heading: Driver Medicals Made Simple */}
          <h1 className="text-[#0F2E4A] font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] mb-6">
            Driver Medicals <br />
            <span className="font-light italic text-[#0F2E4A]">Made </span>
            <span className="relative inline-block text-[#00B2D6] font-semibold italic">
              Simple
              {/* Scribble Underline Illustration */}
              <span className="absolute left-0 right-0 -bottom-7 h-10 pointer-events-none select-none">
                <img 
                  src={scribbleUnderline.src}
                  alt="Scribble Underline"
                  className="w-full h-full object-contain"
                />
              </span>
            </span>
          </h1>

          {/* Subheading Description */}
          <p className="text-[#55697A] text-base md:text-lg font-medium leading-relaxed max-w-xl mb-12">
            Fast, DVLA-approved medicals for HGV, Taxi, Ambulance, Forklift & more.
            <br className="hidden sm:inline" />
            {" "}Same-day appointments available nationwide.
          </p>

          {/* Feature Badges Row */}
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8 w-full max-w-xl">
            {/* Same Day Appointments */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-[#00B2D6]/60 flex items-center justify-center text-[#00B2D6] bg-white shadow-sm hover:border-[#00B2D6] hover:scale-105 transition-all duration-300">
                <CalendarCheck className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <span className="text-[#0F2E4A] font-bold text-xs md:text-sm mt-3 leading-tight block">
                Same Day <br /> Appointments
              </span>
            </div>

            {/* Divider */}
            <div className="w-[1px] h-10 md:h-12 bg-slate-300/60 self-center" />

            {/* DVLA Approved */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-[#00B2D6]/60 flex items-center justify-center text-[#00B2D6] bg-white shadow-sm hover:border-[#00B2D6] hover:scale-105 transition-all duration-300">
                <ShieldCheck className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <span className="text-[#0F2E4A] font-bold text-xs md:text-sm mt-3 leading-tight block">
                DVLA <br /> Approved
              </span>
            </div>

            {/* Divider */}
            <div className="w-[1px] h-10 md:h-12 bg-slate-300/60 self-center" />

            {/* 80+ Nationwide */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-[#00B2D6]/60 flex items-center justify-center text-[#00B2D6] bg-white shadow-sm hover:border-[#00B2D6] hover:scale-105 transition-all duration-300">
                <MapPin className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <span className="text-[#0F2E4A] font-bold text-xs md:text-sm mt-3 leading-tight block">
                80+ <br /> Nationwide
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

