import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { TaxiMedicalHeroData } from "@/app/data/TaxiMedicalData";
import scribbleUnderline from "@/assets/herosection/hero-scribble.png";

interface TaxiHeroSectionProps {
  hero: TaxiMedicalHeroData;
}

export default function TaxiHeroSection({ hero }: TaxiHeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-white poppins">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 right-[-10%] md:right-0">
          <Image
            src={hero.image}
            alt={hero.imageAlt}
            fill
            priority
            className="object-cover object-right md:object-center"
            sizes="100vw"
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[500px] max-w-[1440px] items-center px-4 py-14 sm:px-6 md:min-h-[560px] md:py-20 lg:min-h-[620px] lg:px-8">
        <div className="w-full max-w-[620px]">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 sm:mb-8 flex flex-wrap items-center gap-2 text-sm font-medium text-[#111827] sm:text-base md:text-lg"
          >
            {hero.breadcrumbs.map((item, index) => {
              const isLast = index === hero.breadcrumbs.length - 1;

              return (
                <div key={item.label} className="flex items-center gap-2">
                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className="transition-colors hover:text-[#00B2D6]"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className={isLast ? "font-extrabold" : undefined}>
                      {item.label}
                    </span>
                  )}

                  {!isLast && <ChevronRight className="h-5 w-5 stroke-[3]" />}
                </div>
              );
            })}
          </nav>

          {/* Main Title */}
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-[#333333] sm:text-5xl md:text-6xl lg:text-7xl flex flex-wrap items-baseline gap-x-3 sm:gap-x-4">
            <span>{hero.titleLineOne}</span>

            <span className="relative inline-block text-[#00B2D6]">
              {hero.titleLineTwo}

              {/* Scribble Underline Illustration */}
              <span className="absolute left-32 right-0 -bottom-5 sm:-bottom-7 h-8 pointer-events-none select-none">
                <Image
                  src={scribbleUnderline}
                  alt="Scribble Underline"
                  fill
                  className="object-contain"
                  sizes="220px"
                />
              </span>
            </span>
          </h1>

          {/* Description */}
          <p className="mt-8 sm:mt-10 max-w-[500px] text-sm font-medium leading-relaxed text-[#1F2933] sm:text-base md:text-lg">
            {hero.description}
          </p>
        </div>
      </div>
    </section>
  );
}