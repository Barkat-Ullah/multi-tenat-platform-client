import AboutUsSection from "@/components/pages/home/AboutUsSection/AboutUsSection";
import AgenciesSection from "@/components/pages/home/AgenciesSection/AgenciesSection";
import ContactUsSection from "@/components/pages/home/ContactUsSection/ContactUsSection";
import FAQPage from "@/components/pages/home/FaqSection/Faq";
import FinalCTASection from "@/components/pages/home/FinalCTASection/FinalCTASection";
import MedicalTypesSection from "@/components/pages/home/MedicalTypesSection/MedicalTypesSection";
import ClinicSearchFilter from "@/components/pages/home/ClinicSearchFilter/ClinicSearchFilter";
// import FocusCardsPage from "@/components/pages/home/FocusCard/FocusCard";
import HeroSection from "@/components/pages/home/HeroSection/HeroSection";
import HowItWorksSection from "@/components/pages/home/HowItWorksSection/HowItWorksSection";
import InvestorValueSection from "@/components/pages/home/InvestorValueSection/InvestorValueSection";
import PositioningSection from "@/components/pages/home/PositioningSection/PositioningSection";
import SubscriptionManagement from "@/components/pages/home/SubcriptionSection/SubscriptionSection";

const HompPage = () => {
  return (
    <div className="overflow-hidden bg-white">
      <HeroSection />
      <ClinicSearchFilter />
      <MedicalTypesSection />
      <PositioningSection />
      <HowItWorksSection />
      <SubscriptionManagement/>
      <InvestorValueSection />
      <AgenciesSection />
      <FinalCTASection />
      <AboutUsSection />
      <ContactUsSection />
      <FAQPage />
    </div>
  );
};


export default HompPage;
