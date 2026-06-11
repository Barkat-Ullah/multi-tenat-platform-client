"use client";

import Image from "next/image";
import Link from "next/link";
import type { BusinessHeroData } from "@/app/data/BusinessData";
import scribbleUnderline from "@/assets/herosection/hero-scribble.png";

interface BusinessHeroSectionProps {
  hero: BusinessHeroData;
}

export default function BusinessHeroSection({ hero }: BusinessHeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-white poppins">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <Image
          src={hero.image}
          alt={hero.imageAlt}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>


      {/* Hero Content Container */}
      <div className="relative z-20 mx-auto flex min-h-[500px] max-w-[1440px] items-center px-4 py-14 sm:px-6 md:min-h-[560px] md:py-20 lg:min-h-[620px] lg:px-8">
        <div className="w-full max-w-[620px]">
          
          {/* Breadcrumbs matching "Home » Business" mockup */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 sm:mb-8 flex items-center flex-wrap gap-1 text-[13px] sm:text-[14px] font-bold text-[#111827] uppercase tracking-wide"
          >
            <Link
              href="/"
              className="transition-colors hover:text-[#00B2D6] font-extrabold text-[#111827]"
            >
              Home
            </Link>
            
            <span className="text-[#111827] mx-1 opacity-80 select-none">»</span>
            
            <span className="font-extrabold text-[#111827] opacity-90">
              Business
            </span>
          </nav>

          {/* Main Hero Title */}
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-[#333333] sm:text-5xl md:text-6xl lg:text-7xl mb-8">
            <span className="relative inline-block">
              {hero.title}

              {/* Scribble Underline Illustration positioned under Businesses */}
              <span className="absolute left-12 -right-40 -bottom-10 sm:-bottom-7 h-6 sm:h-8 pointer-events-none select-none">
                <Image
                  src={scribbleUnderline}
                  alt="Scribble Underline"
                  fill
                  className="object-contain"
                  sizes="280px"
                />
              </span>
            </span>
          </h1>

          {/* Description */}
          <p className="mt-8 sm:mt-10 max-w-[500px] text-sm font-medium leading-relaxed text-[#1F2933] sm:text-base md:text-[17px] md:leading-relaxed">
            {hero.description}
          </p>
          
        </div>
      </div>
    </section>
  );
}
