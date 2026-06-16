"use client";

import Image from "next/image";
import Link from "next/link";

import faqHeroImage from "@/assets/home/faq-hero-img.png"

export default function FaqHeroSection() {
  return (
    <section className="relative overflow-hidden bg-white poppins">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <Image
          src={faqHeroImage}
          alt="FAQ Wooden Blocks Background"
          fill
          priority
          quality={100}
          unoptimized
          className="object-cover object-right md:object-center"
          sizes="100vw"
        />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-20 mx-auto flex min-h-[360px] max-w-[1440px] items-center px-4 py-12 sm:px-6 md:min-h-[420px] md:py-14 lg:min-h-[460px] lg:px-8">
        <div className="w-full max-w-[620px]">
          
          {/* Breadcrumbs matching mockup */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center flex-wrap gap-1 text-[13px] sm:text-[14px] font-bold text-[#1F2937] tracking-wide"
          >
            <Link
              href="/"
              className="transition-colors hover:text-[#00B2D6] font-extrabold text-[#1F2937]"
            >
              Home
            </Link>
            
            <span className="text-[#1F2937] mx-1 opacity-80 select-none">»</span>
            
            <span className="font-extrabold text-[#1F2937] opacity-90">
              FAQ
            </span>
          </nav>

          {/* Main Hero Title */}
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-[#0F2E4A] sm:text-5xl md:text-6xl lg:text-7xl">
            FAQ
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-[480px] text-xs sm:text-sm md:text-base font-semibold leading-relaxed text-[#55697A]">
            Find answers to the most common questions about our medical services, appointments, and DVLA requirements.
          </p>
          
        </div>
      </div>
    </section>
  );
}
