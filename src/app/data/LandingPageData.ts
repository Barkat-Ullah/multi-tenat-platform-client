// TypeScript Interfaces for Landing Page Mock Data

export interface MedicalTypeCard {
  image: string;
  title: string;
  description: string;
  link: string;
}

export interface OtherMedicalItem {
  name: string;
  description: string;
}

// 6 Primary Medical Types
export const medicalTypesData: MedicalTypeCard[] = [
  {
    image: "/images/hgv-bus.png",
    title: "HGV/Bus Medicals",
    description: "For HGV & LGV drivers",
    link: "/booking?type=hgv-bus",
  },
  {
    image: "/images/taxi-pco.png",
    title: "Taxi & PCO Medical",
    description: "For Taxi & PCO Medical",
    link: "/booking?type=taxi-pco",
  },
  {
    image: "/images/ambulance.png",
    title: "Ambulance Medical",
    description: "For Ambulance Medical",
    link: "/booking?type=ambulance",
  },
  {
    image: "/images/forklift.png",
    title: "Forklift/Crane Medical",
    description: "For Forklift/Crane Medical",
    link: "/booking?type=forklift",
  },
  {
    image: "/images/motorsport.png",
    title: "Motorsport Medical",
    description: "For Motorsport Medical",
    link: "/booking?type=motorsport",
  },
  {
    image: "/images/pre-employment.png",
    title: "Pre-Employment Medicals",
    description: "For Pre-Employment Medicals.",
    link: "/booking?type=pre-employment",
  },
];

// Secondary Medicals for Accordion
export const otherMedicalsData: OtherMedicalItem[] = [
  { name: "Executive Health Check", description: "Comprehensive premium health screen" },
  { name: "Seafarers ENG1 Medical", description: "Maritime and seafarers fitness certification" },
  { name: "Parachute & Skydiving", description: "GPA/BPA medical declaration & certificate" },
  { name: "Cabin Crew / Pilot Medical", description: "Aviation medical checks and reports" },
  { name: "Visa & Emigration Medical", description: "Visa clearance checks for AU, CA, US & NZ" },
  { name: "Police & Emergency Services", description: "Fitness reports for police, fire, & rescue" },
];

export interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
  iconName: "Search" | "Clock" | "UserCheck";
}

export const howItWorksStepsData: HowItWorksStep[] = [
  {
    number: "01",
    title: "Find Location",
    description: "Enter your postcode and choose from 80+ clinic locations across the UK.",
    iconName: "Search",
  },
  {
    number: "02",
    title: "Select Slot",
    description: "Choose a convenient date and time. Evening and weekend slots are available.",
    iconName: "Clock",
  },
  {
    number: "03",
    title: "Attend Medical",
    description: "Complete your assessment and leave with your D4 form.",
    iconName: "UserCheck",
  },
];

export interface WhyChooseUsFeature {
  title: string;
  description: string;
  iconName: "Award" | "ShieldCheck" | "Clock" | "MapPin" | "Zap" | "Users";
}

export const whyChooseUsLeftFeatures: WhyChooseUsFeature[] = [
  {
    title: "GMC Registered Doctors",
    description: "All medicals conducted by qualified, GMC registered medical professionals.",
    iconName: "Award",
  },
  {
    title: "DVLA Compliant",
    description: "Fully compliant with DVLA medical standards and requirements.",
    iconName: "ShieldCheck",
  },
  {
    title: "Same Day Appointments",
    description: "Urgent medical needed? We offer same-day appointments at most locations.",
    iconName: "Clock",
  },
];

export const whyChooseUsRightFeatures: WhyChooseUsFeature[] = [
  {
    title: "Nationwide Clinics",
    description: "Over 100 clinics across the UK for your convenience.",
    iconName: "MapPin",
  },
  {
    title: "Fast & Easy Process",
    description: "Quick 20-minute appointments with instant certificate issuance.",
    iconName: "Zap",
  },
  {
    title: "Trusted by Thousands",
    description: "Highly rated by drivers nationwide with thousands of 5-star reviews.",
    iconName: "Users",
  },
];


