import { otherMedicalHeroData, ambulanceIntroData, preEmploymentData, motorhomeIntroData, forkliftIntroData, motorsportIntroData, craneIntroData } from "@/app/data/OtherMedicalData";
import OtherMedicalHeroSection from "@/components/pages/landing/other-medicals/OtherMedicalHeroSection";
import AmbulanceIntroSection from "@/components/pages/landing/other-medicals/AmbulanceIntroSection";
import PreEmploymentSection from "@/components/pages/landing/other-medicals/PreEmploymentSection";
import MotorhomeIntroSection from "@/components/pages/landing/other-medicals/MotorhomeIntroSection";
import ForkliftIntroSection from "@/components/pages/landing/other-medicals/ForkliftIntroSection";
import MotorsportIntroSection from "@/components/pages/landing/other-medicals/MotorsportIntroSection";
import CraneIntroSection from "@/components/pages/landing/other-medicals/CraneIntroSection";
import BookingCTASection from "@/components/pages/home/BookingCTASection/BookingCTASection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Other Medicals | Compliance Medicals",
  description:
    "Fast and affordable professional driver medicals completed by GMC-registered doctors, fully compliant with DVLA Group 2 requirements.",
};

export default function OtherMedicalsPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <OtherMedicalHeroSection hero={otherMedicalHeroData} />
      
      {/* Ambulance Intro Section */}
      <AmbulanceIntroSection data={ambulanceIntroData} />

      {/* Pre-Employment Section */}
      <PreEmploymentSection data={preEmploymentData} />

      {/* Motorhome Intro Section */}
      <MotorhomeIntroSection data={motorhomeIntroData} />
      
      {/* Forklift Intro Section */}
      <ForkliftIntroSection data={forkliftIntroData} />
      
      {/* Motorsport Intro Section */}
      <MotorsportIntroSection data={motorsportIntroData} />

      {/* Crane Operator Medical Section */}
      <CraneIntroSection data={craneIntroData} />
      
      {/* Booking CTA Section at the bottom */}
      <BookingCTASection />
    </main>
  );
}



