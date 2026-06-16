import type { Metadata } from "next";
import FaqHeroSection from "@/components/pages/faq/FaqHeroSection";
import FaqAccordionSection from "@/components/pages/faq/FaqAccordionSection";
import BookingCTASection from "@/components/pages/home/BookingCTASection/BookingCTASection";

export const metadata: Metadata = {
  title: "FAQs | Compliance Medicals",
  description:
    "Find answers to frequently asked questions about driver medicals, D4 exams, taxi licenses, and occupational health certifications.",
};

export default function FaqPage() {
  return (
    <main className="bg-white">
      {/* FAQ Hero Section */}
      <FaqHeroSection />

      {/* FAQ Accordion Section */}
      <FaqAccordionSection />

      {/* Booking CTA Section at the bottom */}
      <div className="py-10 bg-[#FCFDFE]">
        <BookingCTASection />
      </div>
    </main>
  );
}
