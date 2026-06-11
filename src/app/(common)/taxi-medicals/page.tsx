import { taxiMedicalHeroData, taxiFeaturesData, taxiCouncils, taxiTrustData, taxiWhatToBringData, taxiMedicalRecordsData, taxiFaqData } from "@/app/data/TaxiMedicalData";
import BookingCTASection from "@/components/pages/home/BookingCTASection/BookingCTASection";
import TestimonialsSection from "@/components/pages/home/TestimonialsSection/TestimonialsSection";
import TaxiHeroSection from "@/components/pages/landing/taxi-pco/TaxiHeroSection";
import TaxiFeaturesSection from "@/components/pages/landing/taxi-pco/TaxiFeaturesSection";
import TaxiBookingSection from "@/components/pages/landing/taxi-pco/TaxiBookingSection";
import TaxiTrustSection from "@/components/pages/landing/taxi-pco/TaxiTrustSection";
import TaxiWhatToBringSection from "@/components/pages/landing/taxi-pco/TaxiWhatToBringSection";
import TaxiMedicalRecordsSection from "@/components/pages/landing/taxi-pco/TaxiMedicalRecordsSection";
import type { Metadata } from "next";
import HgvBusNearestClinicSection from "@/components/pages/landing/hgv-bus/HgvBusNearestClinicSection";
import { hgvBusNearestClinicData } from "@/app/data/HgvBusMedicalData";
import TaxiFaqSection from "@/components/pages/landing/taxi-pco/TaxiFaqSection";

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
      <TaxiBookingSection councils={taxiCouncils} />
      <TaxiTrustSection trustItems={taxiTrustData} />
      <TaxiWhatToBringSection data={taxiWhatToBringData} />
      <TaxiMedicalRecordsSection data={taxiMedicalRecordsData} />
      <HgvBusNearestClinicSection data={hgvBusNearestClinicData} />
      <TaxiFaqSection data={taxiFaqData} />
      <BookingCTASection />
    </main>
  );
}





