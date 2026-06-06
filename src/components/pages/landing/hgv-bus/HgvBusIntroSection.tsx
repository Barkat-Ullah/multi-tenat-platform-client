import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { HgvBusMedicalIntroData } from "@/app/data/HgvBusMedicalData";

interface HgvBusIntroSectionProps {
  intro: HgvBusMedicalIntroData;
}

export default function HgvBusIntroSection({ intro }: HgvBusIntroSectionProps) {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-28 poppins">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <div className="max-w-[620px]">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-[#101418] sm:text-4xl lg:text-[42px]">
            {intro.title}
          </h2>
          <p className="mt-6 max-w-[560px] text-sm font-medium leading-relaxed text-[#58616A] sm:text-base">
            {intro.description}
          </p>

          <ul className="mt-7 space-y-4">
            {intro.checklist.map((item) => (
              <li key={item} className="flex items-start gap-3 text-base font-medium leading-relaxed text-[#4D5660] sm:text-lg">
                <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#00B2D6] text-[#00B2D6]">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-4 xs:flex-row">
            {intro.actions.map((action) => {
              const isSolid = action.variant === "solid";

              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className={`inline-flex items-center justify-between rounded-full border border-[#00B2D6] py-2 pl-6 pr-2 text-sm font-bold transition-all sm:text-base ${
                    isSolid
                      ? "bg-[#00B2D6] text-white shadow-md hover:bg-[#0092B3]"
                      : "bg-white text-[#00B2D6] hover:bg-[#E6F8FC]"
                  }`}
                >
                  <span className="mr-5">{action.label}</span>
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full ${isSolid ? "bg-white text-[#00B2D6]" : "bg-[#00B2D6] text-white"}`}>
                    <ArrowRight className="h-5 w-5 stroke-[2.5]" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[560px]">
            {intro.backgroundIllustration && (
              <div className="absolute -left-20 -top-14 h-[calc(100%+2.5rem)] w-[calc(100%+2.5rem)]">
                <Image
                  src={intro.backgroundIllustration}
                  alt={intro.backgroundIllustrationAlt || ""}
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 1024px) 100vw, 620px"
                />
              </div>
            )}
            <div className="relative aspect-[1.08/1] overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
              <Image
                src={intro.image}
                alt={intro.imageAlt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 560px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
