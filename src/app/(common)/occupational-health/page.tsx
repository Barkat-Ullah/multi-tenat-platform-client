import { occupationalHealthHeroData } from "@/app/data/OccupationalHealthData";
import OccupationalHealthHeroSection from "@/components/pages/landing/occupational-health/OccupationalHealthHeroSection";
import BookingCTASection from "@/components/pages/home/BookingCTASection/BookingCTASection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Occupational Health | Compliance Medicals",
  description:
    "Fast and affordable taxi driver medicals completed by GMC-registered doctors, fully compliant with local council and DVLA requirements.",
};

export default function OccupationalHealthPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <OccupationalHealthHeroSection hero={occupationalHealthHeroData} />

      {/* Booking CTA Section at the bottom */}
      <BookingCTASection />
    </main>
  );
}
