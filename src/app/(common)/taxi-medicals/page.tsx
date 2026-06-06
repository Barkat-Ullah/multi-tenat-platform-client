import { taxiMedicalHeroData, taxiFeaturesData } from "@/app/data/TaxiMedicalData";
import BookingCTASection from "@/components/pages/home/BookingCTASection/BookingCTASection";
import TestimonialsSection from "@/components/pages/home/TestimonialsSection/TestimonialsSection";
import TaxiHeroSection from "@/components/pages/landing/taxi-pco/TaxiHeroSection";
import TaxiFeaturesSection from "@/components/pages/landing/taxi-pco/TaxiFeaturesSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Taxi Medicals | Compliance Medicals",
  description:
    "Fast and affordable taxi driver medicals completed by GMC-registered doctors, fully compliant with local council and DVLA requirements.",
};

export default function TaxiMedicalsPage() {
  return (
    <main className="bg-white">
      <TaxiHeroSection hero={taxiMedicalHeroData} />
      <TaxiFeaturesSection features={taxiFeaturesData} />
      <BookingCTASection />
    </main>
  );
}
