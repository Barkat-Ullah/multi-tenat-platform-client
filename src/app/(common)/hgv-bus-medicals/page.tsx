import {
  hgvBusMedicalHeroData,
  hgvBusMedicalIntroData,
  hgvBusServicesData,
  hgvBusWhatToBringData,
  hgvBusRenewData,
  hgvBusNearestClinicData,
} from "@/app/data/HgvBusMedicalData";
import BookingCTASection from "@/components/pages/home/BookingCTASection/BookingCTASection";
import TestimonialsSection from "@/components/pages/home/TestimonialsSection/TestimonialsSection";
import HgvBusHeroSection from "@/components/pages/landing/hgv-bus/HgvBusHeroSection";
import HgvBusIntroSection from "@/components/pages/landing/hgv-bus/HgvBusIntroSection";
import HgvBusServicesSection from "@/components/pages/landing/hgv-bus/HgvBusServicesSection";
import HgvBusWhatToBringSection from "@/components/pages/landing/hgv-bus/HgvBusWhatToBringSection";
import HgvBusRenewSection from "@/components/pages/landing/hgv-bus/HgvBusRenewSection";
import HgvBusNearestClinicSection from "@/components/pages/landing/hgv-bus/HgvBusNearestClinicSection";
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
      <HgvBusServicesSection data={hgvBusServicesData} />
      <HgvBusWhatToBringSection data={hgvBusWhatToBringData} />
      <HgvBusRenewSection data={hgvBusRenewData} />
      <HgvBusNearestClinicSection data={hgvBusNearestClinicData} />
      <TestimonialsSection />
      <BookingCTASection />
    </main>
  );
}
