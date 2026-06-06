import Link from "next/link";
import { Sparkles, MapPin, Clock, Car, ArrowRight } from "lucide-react";
import type { HgvBusNearestClinicData } from "@/app/data/HgvBusMedicalData";

interface HgvBusNearestClinicSectionProps {
  data: HgvBusNearestClinicData;
}

export default function HgvBusNearestClinicSection({ data }: HgvBusNearestClinicSectionProps) {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-28 poppins relative overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-0">
              <div className="h-1.5 w-1.5 rounded-full bg-[#00B2D6]" />
              <div className="h-[1.5px] w-8 sm:w-16 bg-gradient-to-r from-[#00B2D6] to-[#00B2D6]/20" />
            </div>
            <div className="flex items-center gap-1.5 text-[#00B2D6] font-bold text-xs sm:text-sm uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{data.eyebrow}</span>
            </div>
            <div className="flex items-center gap-0">
              <div className="h-[1.5px] w-8 sm:w-16 bg-gradient-to-l from-[#00B2D6] to-[#00B2D6]/20" />
              <div className="h-1.5 w-1.5 rounded-full bg-[#00B2D6]" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-[#0F2E4A] tracking-tight leading-tight mb-4">
            {data.title}
          </h2>
          <p className="text-[#55697A] text-sm md:text-base font-medium mx-auto leading-relaxed max-w-3xl">
            {data.description}
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column: Map */}
          <div className="relative w-full h-[500px] lg:h-auto rounded-3xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200">
            {/* Map iframe (focused on UK/Europe) */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d19853925.10542385!2d13.435759714275066!3d53.30825381813735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2suk!4v1714578110000!5m2!1sen!2suk" 
              className="w-full h-full border-0"
              loading="lazy"
            />
            {/* Locate your Geoposition Card overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[380px] bg-white rounded-2xl shadow-xl p-6 sm:p-8 z-20">
              <h3 className="text-[#0F2E4A] font-bold text-base sm:text-lg mb-4">Locate your Geoposition</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder={data.mapSearchPlaceholder}
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 focus:outline-none focus:border-[#00B2D6] text-sm font-medium text-[#0F2E4A] placeholder-slate-400"
                />
                <button className="w-full h-12 rounded-lg bg-[#00B2D6] hover:bg-[#0092B3] text-white font-bold text-sm transition-colors">
                  {data.mapSearchButtonLabel}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Clinics List */}
          <div className="flex flex-col bg-white border border-slate-200 shadow-sm rounded-3xl p-6 sm:p-8 lg:p-8">
            <div className="space-y-6 flex-1">
              {data.clinics.map((clinic, index) => (
                <div key={index} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                  
                  {/* Top Row: Name, Status, Book Now */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00B2D6]" />
                        <span className="text-[#0F2E4A] text-xs font-bold uppercase tracking-wider">{clinic.status}</span>
                      </div>
                      <h4 className="text-[#0F2E4A] font-extrabold text-base sm:text-lg pr-4">
                        {clinic.name}
                      </h4>
                      {clinic.address && (
                        <p className="text-[#55697A] text-xs sm:text-sm font-medium mt-1">
                          {clinic.address}
                        </p>
                      )}
                    </div>
                    
                    <div className="shrink-0">
                      <Link
                        href={clinic.bookNowHref}
                        className="inline-flex items-center justify-between rounded-full bg-[#00B2D6] py-2 pl-5 pr-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#0092B3] group"
                      >
                        <span className="mr-3">Book Now</span>
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#00B2D6] transition-transform duration-300 group-hover:translate-x-0.5">
                          <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* Bottom Row: Details */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Distance</span>
                      </div>
                      <span className="text-[#0F2E4A] text-xs sm:text-sm font-semibold">{clinic.distance}</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Opening Hours</span>
                      </div>
                      <span className="text-[#0F2E4A] text-xs sm:text-sm font-semibold">{clinic.openingHours}</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Car className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Car Parking</span>
                      </div>
                      <span className="text-[#0F2E4A] text-xs sm:text-sm font-semibold">{clinic.carParking}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Show More link */}
            <div className="mt-6 text-right">
              <Link href="/locations" className="text-[#00B2D6] text-sm font-bold hover:underline underline-offset-4">
                Show More
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
