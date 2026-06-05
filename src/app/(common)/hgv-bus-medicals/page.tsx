import {
  hgvBusMedicalHeroData,
  hgvBusMedicalIntroData,
} from "@/app/data/HgvBusMedicalData";
import BookingCTASection from "@/components/pages/home/BookingCTASection/BookingCTASection";
import TestimonialsSection from "@/components/pages/home/TestimonialsSection/TestimonialsSection";
import HgvBusHeroSection from "@/components/pages/landing/hgv-bus/HgvBusHeroSection";
import HgvBusIntroSection from "@/components/pages/landing/hgv-bus/HgvBusIntroSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HGV/Bus Medicals | Compliance Medicals",
  description:
    "Fast and affordable DVLA-compliant medicals for HGV, LGV, and Bus drivers, including full form completion.",
};

export default function HgvBusMedicalsPage() {
  return (
    <main className="bg-white">
      <HgvBusHeroSection hero={hgvBusMedicalHeroData} />
      <HgvBusIntroSection intro={hgvBusMedicalIntroData} />
      <TestimonialsSection />
      <BookingCTASection />
    </main>
  );
}
