import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { HgvBusMedicalHeroData } from "@/app/data/HgvBusMedicalData";

interface HgvBusHeroSectionProps {
  hero: HgvBusMedicalHeroData;
}

export default function HgvBusHeroSection({ hero }: HgvBusHeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#F7FBFD] poppins">
      <div className="absolute inset-0">
        <div className="absolute inset-0">
          <Image
            src={hero.image}
            alt={hero.imageAlt}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[500px] max-w-[1440px] items-center px-4 py-14 sm:px-6 md:min-h-[560px] md:py-20 lg:min-h-[620px] lg:px-8">
        <div className="w-full max-w-[620px]">
          <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-sm font-medium text-[#111827] sm:text-base md:text-lg">
            {hero.breadcrumbs.map((item, index) => {
              const isLast = index === hero.breadcrumbs.length - 1;

              return (
                <div key={item.label} className="flex items-center gap-2">
                  {item.href && !isLast ? (
                    <Link href={item.href} className="transition-colors hover:text-[#00B2D6]">
                      {item.label}
                    </Link>
                  ) : (
                    <span className={isLast ? "font-bold" : undefined}>{item.label}</span>
                  )}
                  {!isLast && <ChevronRight className="h-5 w-5 stroke-[3]" />}
                </div>
              );
            })}
          </nav>

          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#00B2D6] sm:text-sm">
            {hero.eyebrow}
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-[#333333] sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block">{hero.titleLineOne}</span>
            <span className="mt-3 block text-[#00B2D6] sm:mt-4">{hero.titleLineTwo}</span>
          </h1>
          <p className="mt-6 max-w-[560px] text-sm font-medium leading-relaxed text-[#1F2933] sm:text-base md:text-lg">
            {hero.description}
          </p>
        </div>
      </div>
    </section>
  );
}
