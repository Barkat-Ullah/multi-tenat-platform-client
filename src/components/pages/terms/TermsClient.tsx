"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ChevronRight, FileText } from "lucide-react";
import { termsIntro, termsSections } from "@/app/data/TermsData";

export default function TermsClient() {
  const [activeSection, setActiveSection] = useState<string>("about-us");

  const scrollToSection = (id: string) => {
    if (typeof window !== "undefined") {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveSection(id);
      }
    }
  };

  return (
    <div className="bg-[#FCFDFE] poppins min-h-screen">
      
      {/* Hero Header Block */}
      <section className="bg-white border-b border-slate-100 py-12 md:py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center flex-wrap gap-1 text-[13px] sm:text-[14px] font-bold text-[#1F2937] tracking-wide"
          >
            <Link href="/" className="transition-colors hover:text-[#00B2D6] font-extrabold text-[#1F2937]">
              Home
            </Link>
            <span className="text-[#1F2937] mx-1 opacity-80 select-none">»</span>
            <span className="font-extrabold text-[#1F2937] opacity-90">Terms & Conditions</span>
          </nav>

          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex items-center gap-0">
                <div className="h-1.5 w-1.5 rounded-full bg-[#00B2D6]" />
                <div className="h-[1.5px] w-8 sm:w-16 bg-gradient-to-r from-[#00B2D6] to-[#00B2D6]/20" />
              </div>
              <div className="flex items-center gap-1.5 text-[#00B2D6] font-bold text-xs sm:text-sm uppercase tracking-widest">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Compliance Medicals</span>
              </div>
              <div className="flex items-center gap-0">
                <div className="h-[1.5px] w-8 sm:w-16 bg-gradient-to-l from-[#00B2D6] to-[#00B2D6]/20" />
                <div className="h-1.5 w-1.5 rounded-full bg-[#00B2D6]" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F2E4A] tracking-tight leading-tight">
              Terms & Conditions
            </h1>
            <p className="text-[#55697A] text-sm sm:text-base font-semibold mt-3 leading-relaxed">
              {termsIntro.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sticky Left Sidebar for Desktop Table of Contents */}
          <aside className="lg:w-[320px] w-full shrink-0 sticky top-28 bg-white border border-slate-200/60 p-5 rounded-2xl shadow-[0_4px_25px_rgba(15,46,74,0.015)] hidden lg:block">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <FileText className="h-4.5 w-4.5 text-[#00B2D6]" />
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#0F2E4A]">
                Table of Contents
              </h2>
            </div>
            
            <nav className="flex flex-col gap-1.5">
              {termsSections.map((section) => {
                const isActive = activeSection === section.id;
                // Get display title by striping out the number index for clean nav
                const cleanTitle = section.title.replace(/^\d+\.\s*/, "");

                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      isActive
                        ? "bg-[#EBF7FC] text-[#00B2D6] scale-[1.01]"
                        : "text-[#55697A] hover:bg-slate-50 hover:text-[#0F2E4A]"
                    }`}
                  >
                    {cleanTitle}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Right Main Text Panel */}
          <main className="flex-1 bg-white border border-slate-200/60 p-6 sm:p-8 md:p-10 lg:p-12 rounded-3xl shadow-[0_4px_30px_rgba(15,46,74,0.01)] min-w-0">
            
            {/* Mobile View: Table of Contents List */}
            <div className="mb-10 bg-slate-50/50 border border-slate-200/50 p-5 rounded-2xl lg:hidden">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0F2E4A] mb-3">
                Table of Contents
              </h3>
              <ul className="space-y-2">
                {termsSections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00B2D6] hover:underline text-left leading-normal"
                    >
                      <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                      <span>{section.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Render Sections */}
            <div className="space-y-10">
              {termsSections.map((section) => (
                <div
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28 pb-10 border-b border-slate-100 last:border-none last:pb-0"
                >
                  <h3 className="text-[#0F2E4A] font-extrabold text-base sm:text-lg md:text-xl tracking-tight mb-4">
                    {section.title}
                  </h3>
                  
                  <div className="space-y-4">
                    {section.content.map((paragraph, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-[#55697A] text-xs sm:text-sm md:text-base font-semibold leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {section.bullets && (
                    <ul className="list-disc pl-5 mt-4 space-y-2.5 text-[#55697A] text-xs sm:text-sm md:text-base font-semibold leading-relaxed">
                      {section.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="pl-1">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Terms Footer Text */}
            <div className="mt-12 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs font-bold text-[#00B2D6] tracking-wide">
                {termsIntro.footerText}
              </p>
            </div>

          </main>
        </div>
      </section>

    </div>
  );
}
