import BookingCTASection from "@/components/pages/home/BookingCTASection/BookingCTASection";
import MedicalTypesSection from "@/components/pages/home/MedicalTypesSection/MedicalTypesSection";
import ClinicSearchFilter from "@/components/pages/home/ClinicSearchFilter/ClinicSearchFilter";
import HeroSection from "@/components/pages/home/HeroSection/HeroSection";
import HowItWorksSection from "@/components/pages/home/HowItWorksSection/HowItWorksSection";
import WhyChooseUsSection from "@/components/pages/home/WhyChooseUsSection/WhyChooseUsSection";
import TestimonialsSection from "@/components/pages/home/TestimonialsSection/TestimonialsSection";
import NearestClinicSection from "@/components/pages/home/NearestClinicSection/NearestClinicSection";
import InvestorValueSection from "@/components/pages/home/InvestorValueSection/InvestorValueSection";
import PositioningSection from "@/components/pages/home/PositioningSection/PositioningSection";
import SubscriptionManagement from "@/components/pages/home/SubcriptionSection/SubscriptionSection";

const HompPage = () => {
  return (
    <div className="overflow-hidden bg-white">
      <HeroSection />
      <ClinicSearchFilter />
      <MedicalTypesSection />
      {/* <PositioningSection /> */}
      <HowItWorksSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <NearestClinicSection />
      <BookingCTASection />
      {/* <SubscriptionManagement/> */}
      {/* <InvestorValueSection />
      <AgenciesSection />
      <AboutUsSection />
      <ContactUsSection /> */}
      {/* <FAQPage /> */}
    </div>
  );
};


export default HompPage;
