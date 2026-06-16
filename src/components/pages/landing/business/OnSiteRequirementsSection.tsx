"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { OnSiteRequirementsData } from "@/app/data/BusinessData";

interface OnSiteRequirementsSectionProps {
  data: OnSiteRequirementsData;
}

export default function OnSiteRequirementsSection({ data }: OnSiteRequirementsSectionProps) {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24 poppins relative overflow-hidden border-b border-slate-100">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-[900px] mx-auto mb-14 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0F2E4A] tracking-tight leading-tight mb-4">
            {data.title}
          </h2>
          <p className="text-[#55697A] text-sm sm:text-base font-medium leading-relaxed">
            {data.subtitlePrefix}
            <span className="underline decoration-[#00B2D6] decoration-2 underline-offset-4 font-bold text-[#0F2E4A]">
              {data.subtitleUnderline}
            </span>
            {data.subtitleSuffix}
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:items-center">

          {data.cards.map((card, index) => (
            <div
              key={index}
              className="bg-white border border-slate-100 rounded-[1.5rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col"
            >
              {/* Card Image */}
              <div className="relative aspect-[1.6/1] w-full overflow-hidden bg-slate-50">
                <Image
                  src={card.image}
                  alt={card.imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 420px"
                />
              </div>

              {/* Card Contents */}
              <div className="p-6 sm:p-8 flex flex-col flex-grow">
                {/* Title */}
                <h3 className="text-lg sm:text-xl font-extrabold text-[#0F2E4A] leading-snug mb-3.5">
                  {card.title}
                </h3>

                {/* Main Description */}
                <p className="text-[13px] sm:text-[14px] text-slate-500 font-semibold leading-relaxed mb-4">
                  {card.description}
                </p>

                {/* Inner Checklist Header */}
                {card.innerDescription && (
                  <h4 className="text-[13px] sm:text-[14px] text-[#0F2E4A] font-bold mb-3">
                    {card.innerDescription}
                  </h4>
                )}

                {/* Checklist items */}
                <ul className="space-y-2.5 mb-6">
                  {card.listItems.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2.5">
                      {/* Cyan Check Icon */}
                      <svg
                        className="w-4 h-4 text-[#00B2D6] stroke-[2.5] flex-shrink-0 mt-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                      <span className="text-[13px] sm:text-[14px] text-slate-500 font-semibold leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Footer Description */}
                {card.footerDescription && (
                  <p className="text-[12px] sm:text-[13px] text-slate-400 font-medium leading-relaxed mt-auto pt-4 border-t border-slate-100">
                    {card.footerDescription}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Center Booking Action button */}
        <div className="mt-12 lg:mt-16 flex justify-center">
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
    </section>
  );
}
