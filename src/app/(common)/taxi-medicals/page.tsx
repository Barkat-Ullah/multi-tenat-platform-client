import { taxiMedicalHeroData } from "@/app/data/TaxiMedicalData";
import BookingCTASection from "@/components/pages/home/BookingCTASection/BookingCTASection";
import TestimonialsSection from "@/components/pages/home/TestimonialsSection/TestimonialsSection";
import TaxiHeroSection from "@/components/pages/landing/taxi-pco/TaxiHeroSection";
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
      
      {/* 
        You can plug in the rest of the sections below as we build them, 
        or reuse the ones from HGV/Bus with new data if they share the same layout! 
      */}
      <TestimonialsSection />
      <BookingCTASection />
    </main>
  );
}
