"use client";

import Image from "next/image";
import type { WhyOnSiteData } from "@/app/data/BusinessData";

interface WhyOnSiteSectionProps {
  data: WhyOnSiteData;
}

export default function WhyOnSiteSection({ data }: WhyOnSiteSectionProps) {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24 poppins relative overflow-hidden border-b border-slate-100">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative z-10">

        {/* 2-Column Flex Content (Image on left, Text on right) */}
        <div className="flex flex-col lg:flex-row lg:justify-between items-center gap-12 lg:gap-16">

          {/* Left Column: Image with sketch illustration frame */}
          <div className="w-full lg:w-[42%] flex justify-center lg:justify-start order-1">
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
              <div className="relative aspect-[1.1/1] overflow-hidden rounded-[2.5rem] border border-slate-200 bg-slate-50 shadow-[0_4px_25px_rgba(0,0,0,0.04)]">
                <Image
                  src={data.image}
                  alt={data.imageAlt}
                  fill
                  quality={100}
                  className="object-cover object-center animate-fade-in"
                  sizes="(max-width: 1024px) 100vw, 500px"
                  priority
                  unoptimized
                />
              </div>

            </div>
          </div>

          {/* Right Column: Detailed Text Content */}
          <div className="w-full lg:w-[50%] flex flex-col justify-center order-2">

            {/* Title */}
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-[#0F2E4A] tracking-tight leading-tight mb-8">
              {data.title}
            </h2>

            {/* List items */}
            <div className="space-y-6">
              {data.items.map((item, index) => (
                <p key={index} className="text-[#55697A] text-sm sm:text-base font-medium leading-relaxed">
                  <span className="font-extrabold text-[#0F2E4A]">{item.label}: </span>
                  {item.text}
                </p>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
