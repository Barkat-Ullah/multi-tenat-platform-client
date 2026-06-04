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
