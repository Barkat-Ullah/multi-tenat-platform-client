import { businessHeroData, onSiteRequirementsData, consentCertificatesData, whyOnSiteData } from "@/app/data/BusinessData";
import BusinessHeroSection from "@/components/pages/landing/business/BusinessHeroSection";
import OnSiteRequirementsSection from "@/components/pages/landing/business/OnSiteRequirementsSection";
import ConsentCertificatesSection from "@/components/pages/landing/business/ConsentCertificatesSection";
import WhyOnSiteSection from "@/components/pages/landing/business/WhyOnSiteSection";
import OnSiteRequestSection from "@/components/pages/landing/business/OnSiteRequestSection";
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

      {/* On-Site Medical Requirements Section */}
      <OnSiteRequirementsSection data={onSiteRequirementsData} />

      {/* Consent & Certificates Section */}
      <ConsentCertificatesSection data={consentCertificatesData} />
      
      {/* Why On-Site Section */}
      <WhyOnSiteSection data={whyOnSiteData} />

      {/* On-Site Request Form Section */}
      <OnSiteRequestSection />

      {/* Booking CTA Section at the bottom */}
      <BookingCTASection />
    </main>
  );
}


