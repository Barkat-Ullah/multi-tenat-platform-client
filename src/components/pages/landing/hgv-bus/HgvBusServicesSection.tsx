import Link from "next/link";
import { ArrowRight, Sparkles, Phone, ScanEye, Activity, UserCheck, Scale } from "lucide-react";
import type { HgvBusServicesData, HgvBusServiceItem } from "@/app/data/HgvBusMedicalData";

interface HgvBusServicesSectionProps {
  data: HgvBusServicesData;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "eye":
      return <ScanEye className="h-6 w-6" />;
    case "blood-pressure":
      return <Activity className="h-6 w-6" />;
    case "physical-exam":
      return <UserCheck className="h-6 w-6" />;
    case "bmi":
      return <Scale className="h-6 w-6" />;
    default:
      return <Activity className="h-6 w-6" />;
  }
};

export default function HgvBusServicesSection({ data }: HgvBusServicesSectionProps) {
  return (
    <section className="bg-[#FAFAFA] py-16 sm:py-20 lg:py-28 poppins">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Content and Services Grid */}
          <div className="flex flex-col">
            {/* Header / Eyebrow */}
            <div className="flex items-center gap-4 mb-4">
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

            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-[#0F2E4A] sm:text-4xl lg:text-[42px] mb-4">
              {data.title}
            </h2>
            <p className="max-w-[560px] text-sm font-medium leading-relaxed text-[#55697A] sm:text-base mb-10">
              {data.description}
            </p>

            {/* Services 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-10">
              {data.services.map((service, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center p-6 border border-[#00B2D6]/10 rounded-2xl bg-white shadow-[0_4px_25px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#00B2D6]/20"
                >
                  <div className="w-16 h-16 rounded-full border border-dashed border-[#00B2D6]/40 bg-[#EBFBFF] flex items-center justify-center text-[#00B2D6] mb-4">
                    {getIcon(service.iconName)}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#0F2E4A] text-center">
                    {service.title}
                  </h3>
                </div>
              ))}
            </div>

            {/* Book Now Button */}
            <div>
              <Link
                href={data.bookNowHref}
                className="inline-flex items-center justify-between rounded-full bg-[#00B2D6] py-2 pl-6 pr-2 text-sm sm:text-base font-bold text-white shadow-md transition-all hover:bg-[#0092B3] group"
              >
                <span className="mr-5">Book Now</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#00B2D6] transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight className="h-5 w-5 stroke-[2.5]" />
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column: "How to arrange your medical?" Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[500px] bg-[#E5F9FD] rounded-3xl p-8 sm:p-12 text-center shadow-sm">
              <h3 className="text-2xl sm:text-[32px] font-extrabold text-[#0F2E4A] leading-tight mb-10 tracking-tight">
                {data.arrangeMedical.title}
              </h3>

              {/* Speak to our team */}
              <div className="mb-8 flex flex-col items-center">
                <p className="text-sm font-bold text-[#0F2E4A] mb-3">
                  {data.arrangeMedical.phoneLabel}
                </p>
                <a
                  href={data.arrangeMedical.phoneHref}
                  className="inline-flex w-full max-w-[280px] items-center justify-between rounded-full bg-[#00B2D6] py-2 pl-6 pr-2 text-base sm:text-lg font-bold tracking-wider text-white shadow-sm transition-all hover:bg-[#0092B3] group"
                >
                  <span className="flex-1 text-center pr-2">{data.arrangeMedical.phoneNumber}</span>
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#00B2D6] transition-transform duration-300 group-hover:scale-105">
                    <Phone className="h-5 w-5 fill-current" />
                  </span>
                </a>
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] bg-[#00B2D6]/10 mb-8" />

              {/* Book in Today */}
              <div className="mb-8 flex flex-col items-center">
                <p className="text-sm font-bold text-[#0F2E4A] mb-3">
                  {data.arrangeMedical.bookTodayLabel}
                </p>
                <Link
                  href={data.arrangeMedical.bookTodayHref}
                  className="inline-flex w-full max-w-[280px] items-center justify-center rounded-full bg-[#00B2D6] py-3.5 text-sm sm:text-base font-bold text-white shadow-sm transition-all hover:bg-[#0092B3]"
                >
                  Book Now
                </Link>
              </div>

              {/* Visit Clinics */}
              <div className="flex flex-col items-center">
                <p className="text-sm font-bold text-[#0F2E4A] mb-3">
                  {data.arrangeMedical.visitClinicsLabel}
                </p>
                <Link
                  href={data.arrangeMedical.visitClinicsHref}
                  className="inline-flex w-full max-w-[280px] items-center justify-center rounded-full border border-[#00B2D6] bg-transparent py-3.5 text-sm sm:text-base font-bold text-[#00B2D6] transition-all hover:bg-[#00B2D6]/5"
                >
                  Clinic Location Finder
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
