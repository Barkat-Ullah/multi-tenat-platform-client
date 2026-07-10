"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PreEmploymentData } from "@/app/data/OtherMedicalData";

interface PreEmploymentSectionProps {
  data: PreEmploymentData;
}

export default function PreEmploymentSection({ data }: PreEmploymentSectionProps) {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24 poppins relative overflow-hidden border-b border-slate-100">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative z-10">

        {/* 2-Column Flex Content (Text on left, Image on right) */}
        <div className="flex flex-col lg:flex-row lg:justify-between items-center gap-12 lg:gap-16">

          {/* Left Column: Detailed Text Content */}
          <div className="w-full lg:w-[50%] flex flex-col justify-center order-2 lg:order-1">

            {/* Title */}
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-[#0F2E4A] tracking-tight leading-tight mb-6">
              {data.title}
            </h2>

            {/* Description */}
            <p className="text-[#55697A] text-sm sm:text-base font-medium leading-relaxed mb-8">
              {data.description}
            </p>

            {/* Sub-Blocks */}
            <div className="space-y-6 mb-8">

              {/* What Happens */}
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-[#0F2E4A] leading-tight">
                  {data.whatHappensTitle}
                </h3>
                <p className="text-[13px] sm:text-[14px] text-slate-500 leading-relaxed font-medium">
                  {data.whatHappensDesc}
                </p>
              </div>

              {/* What to Bring Checklist */}
              <div className="space-y-3.5">
                <h3 className="text-base sm:text-lg font-bold text-[#0F2E4A] leading-tight">
                  {data.whatToBringTitle}
                </h3>
                <ul className="space-y-2.5">
                  {data.whatToBringItems.map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      {/* Custom Cyan Check Circle */}
                      <svg
                        className="w-5 h-5 text-[#00B2D6] stroke-[2.5] flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-[13px] sm:text-[14px] text-slate-500 leading-relaxed font-medium">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What to Do After */}
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-[#0F2E4A] leading-tight">
                  {data.whatToDoTitle}
                </h3>
                <p className="text-[13px] sm:text-[14px] text-slate-500 leading-relaxed font-medium">
                  {data.whatToDoDesc}
                </p>
              </div>

            </div>

            {/* CTA Book Button */}
            <div className="pt-2">
              <Link
                href={data.bookNowHref}
                className="inline-flex items-center justify-between rounded-full bg-[#00B2D6] pl-8 pr-2 py-2 font-bold text-white transition-all duration-300 hover:bg-[#0092B3] shadow-[0_4px_14px_rgba(0,178,214,0.15)] group max-w-fit"
              >
                <span className="text-[14px] sm:text-base tracking-wide mr-6">{data.bookNowLabel}</span>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#00B2D6] group-hover:translate-x-0.5 transition-transform duration-200">
                  <ArrowRight size={16} className="stroke-[2.5]" />
                </div>
              </Link>
            </div>

          </div>

          {/* Right Column: Image with sketch illustration frame */}
          <div className="w-full lg:w-[42%] flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative w-full max-w-[500px]">
              {/* Background Hand-Drawn Sketch Illustration Frame */}
              {data.backgroundIllustration && (
                <div className="absolute -left-10 -top-6 h-[calc(100%)] w-[calc(100%)] pointer-events-none select-none">
                  <Image
                    src={data.backgroundIllustration}
                    alt={data.backgroundIllustrationAlt || ""}
                    fill
                    className="object-contain object-center scale-[1.15]"
                    sizes="(max-width: 1024px) 100vw, 560px"
                  />
                </div>
              )}

              {/* Foreground Image Card */}
              <div className="relative aspect-[1.1/1] overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-[0_4px_25px_rgba(0,0,0,0.04)]">
                <Image
                  src={data.image}
                  alt={data.imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 500px"
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
