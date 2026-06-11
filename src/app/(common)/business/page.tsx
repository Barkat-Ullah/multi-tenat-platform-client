import { businessHeroData } from "@/app/data/BusinessData";
import BusinessHeroSection from "@/components/pages/landing/business/BusinessHeroSection";
import BookingCTASection from "@/components/pages/home/BookingCTASection/BookingCTASection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Services | Compliance Medicals",
  description:
    "Learn more about our business services, company values, and how we provide professional solutions tailored to your needs.",
};

export default function BusinessPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <BusinessHeroSection hero={businessHeroData} />
      
      {/* Booking CTA Section at the bottom */}
      <BookingCTASection />
    </main>
  );
}
