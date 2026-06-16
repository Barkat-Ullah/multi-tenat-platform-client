"use client";

import Image from "next/image";
import type { ConsentCertificatesData } from "@/app/data/BusinessData";

interface ConsentCertificatesSectionProps {
  data: ConsentCertificatesData;
}

export default function ConsentCertificatesSection({ data }: ConsentCertificatesSectionProps) {
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

            {/* Paragraph 1 */}
            <p className="text-[#55697A] text-sm sm:text-base font-medium leading-relaxed mb-6">
              {data.paragraphOne}
            </p>

            {/* Paragraph 2 */}
            <p className="text-[#55697A] text-sm sm:text-base font-medium leading-relaxed">
              {data.paragraphTwo}
            </p>

          </div>

          {/* Right Column: Image with sketch illustration frame */}
          <div className="w-full lg:w-[42%] flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative w-full max-w-[500px]">
              {/* Background Hand-Drawn Sketch Illustration Frame */}
              {/* {data.backgroundIllustration && (
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
               */}
              {/* Foreground Image Card */}
              <div className="relative aspect-[1.1/1]">
                <Image
                  src={data.image}
                  alt={data.imageAlt}
                  fill
                  className="object-contain animate-fade-in"
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
