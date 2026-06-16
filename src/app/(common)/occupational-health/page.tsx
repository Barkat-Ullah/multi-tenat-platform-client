import { occupationalHealthHeroData, occupationalServicesData, clinicNearYouData, fitToWorkData, airsideMedicalData, seafarersMedicalData, occupationalPreEmploymentData } from "@/app/data/OccupationalHealthData";
import OccupationalHealthHeroSection from "@/components/pages/landing/occupational-health/OccupationalHealthHeroSection";
import OccupationalMedicalServicesSection from "@/components/pages/landing/occupational-health/OccupationalMedicalServicesSection";
import ClinicNearYouSection from "@/components/pages/landing/occupational-health/ClinicNearYouSection";
import FitToWorkSection from "@/components/pages/landing/occupational-health/FitToWorkSection";
import AirsideMedicalSection from "@/components/pages/landing/occupational-health/AirsideMedicalSection";
import SeafarersMedicalSection from "@/components/pages/landing/occupational-health/SeafarersMedicalSection";
import OccupationalPreEmploymentSection from "@/components/pages/landing/occupational-health/OccupationalPreEmploymentSection";
import BookingCTASection from "@/components/pages/home/BookingCTASection/BookingCTASection";
import type { Metadata } from "next";
import TestimonialsSection from "@/components/pages/home/TestimonialsSection/TestimonialsSection";
import HgvBusNearestClinicSection from "@/components/pages/landing/hgv-bus/HgvBusNearestClinicSection";
import { hgvBusNearestClinicData } from "@/app/data/HgvBusMedicalData";

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

      {/* Services Section */}
      <OccupationalMedicalServicesSection data={occupationalServicesData} />

      {/* Clinic Near You Section */}
      <ClinicNearYouSection data={clinicNearYouData} />

      {/* Fit to Work Section */}
      <FitToWorkSection data={fitToWorkData} />

      {/* Airside Medical Section */}
      <AirsideMedicalSection data={airsideMedicalData} />

      {/* Seafarers Medical Section */}
      <SeafarersMedicalSection data={seafarersMedicalData} />

      {/* Pre-Employment Medical Section */}
      <OccupationalPreEmploymentSection data={occupationalPreEmploymentData} />

      <TestimonialsSection />

      <HgvBusNearestClinicSection data={hgvBusNearestClinicData} />

      {/* Booking CTA Section at the bottom */}
      <BookingCTASection />
    </main>
  );
}
