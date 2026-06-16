import type { StaticImageData } from "next/image";
import occupationalHealthHeroImage from "@/assets/home/occupational-health.png";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface OccupationalHealthHeroData {
  breadcrumbs: BreadcrumbItem[];
  titleLineOne: string;
  titleLineTwo: string;
  description: string;
  image: StaticImageData;
  imageAlt: string;
}

export const occupationalHealthHeroData: OccupationalHealthHeroData = {
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Occupational Health" },
  ],
  titleLineOne: "Occupational",
  titleLineTwo: "Health",
  description:
    "Fast and affordable taxi driver medicals completed by GMC-registered doctors, fully compliant with local council and DVLA requirements.",
  image: occupationalHealthHeroImage,
  imageAlt: "Group of diverse industrial workers in orange safety vests and helmets standing side by side",
};

export interface OccupationalService {
  id: number;
  title: string;
  description: string;
  icon: "crane" | "hardhat" | "plane" | "ship" | "heart";
}

export interface OccupationalServicesData {
  tagline: string;
  title: string;
  description: string;
  services: OccupationalService[];
  ctaCard: {
    title: string;
    description: string;
    bookNowLabel: string;
    bookNowHref: string;
    clinicFinderLabel: string;
    clinicFinderHref: string;
  };
}

export const occupationalServicesData: OccupationalServicesData = {
  tagline: "✦ What should medicals ✦",
  title: "Medical We Provide",
  description:
    "compliance medical forms are available at all clinics, and our team is happy to help with your C1/ Ambulance medical queries.",
  services: [
    {
      id: 1,
      title: "Safety Critical Medicals",
      description: "A Safety Critical Medical ensures you are fit to work safely in high-risk roles.",
      icon: "crane",
    },
    {
      id: 2,
      title: "Fit to Work Medicals",
      description: "A Fit to Work Medical ensures employees are healthy and fit to perform their job safely.",
      icon: "hardhat",
    },
    {
      id: 3,
      title: "Airside Medicals",
      description: "Airside Medicals ensure you are fit for safe work in airport environments.",
      icon: "plane",
    },
    {
      id: 4,
      title: "ML5 Sea Farers Medical",
      description: "The ML5 Seafarers Medical ensures you are medically fit to work safely at sea.",
      icon: "ship",
    },
    {
      id: 5,
      title: "Pre-Employment Medicals",
      description: "Pre-employment medicals ensure candidates are fit for work safely.",
      icon: "heart",
    },
  ],
  ctaCard: {
    title: "Book in Today",
    description: "Book your medical online.",
    bookNowLabel: "Book Now",
    bookNowHref: "/booking?type=occupational",
    clinicFinderLabel: "Clinic Location Finder",
    clinicFinderHref: "/#location",
  },
};

export interface ClinicNearYouData {
  title: string;
  description: string;
  checklist: string[];
  bookNowLabel: string;
  bookNowHref: string;
  image: StaticImageData;
  imageAlt: string;
  backgroundIllustration?: StaticImageData;
  backgroundIllustrationAlt?: string;
}

import criticalDoctor from "@/assets/home/critical-doctor.png";
import medicalBusIllustration from "@/assets/home/medical-bus-illustration.png";

export const clinicNearYouData: ClinicNearYouData = {
  title: "Looking for a Safety Critical Medical Clinic Near You?",
  description:
    "Whether you drive heavy vehicles, operate machinery, or work in construction, this medical assessment ensures you are physically and mentally fit for the role. Here's what you can expect:",
  checklist: [
    "Height, weight & BMI",
    "Blood pressure & pulse check",
    "Vision checks",
    "Urinalysis",
    "A full hearing assessment",
    "Spirometry/ Respiratory assessment",
  ],
  bookNowLabel: "Book Now",
  bookNowHref: "/booking?type=occupational",
  image: criticalDoctor,
  imageAlt: "Medical professional team",
  backgroundIllustration: medicalBusIllustration,
  backgroundIllustrationAlt: "Decorative sketch frame",
};

export interface FitToWorkData {
  title: string;
  description: string;
  checklist: string[];
  bookNowLabel: string;
  bookNowHref: string;
  image: StaticImageData;
  imageAlt: string;
  backgroundIllustration?: StaticImageData;
  backgroundIllustrationAlt?: string;
}

import constructionMedical from "@/assets/home/construction-medical.png";

export const fitToWorkData: FitToWorkData = {
  title: "Need a Fit to Work Medical Assessment?",
  description:
    "At Compliance Medicals, we provide comprehensive Fit to Work medicals, ensuring compliance with government regulations.",
  checklist: [
    "Plant operators",
    "Crane operators",
    "Forklift drivers",
    "Urinalysis",
    "360 excavator operators",
    "HIAB truck drivers",
  ],
  bookNowLabel: "Book Now",
  bookNowHref: "/booking?type=occupational",
  image: constructionMedical,
  imageAlt: "Construction safety team climbing structures",
  backgroundIllustration: medicalBusIllustration,
  backgroundIllustrationAlt: "Decorative sketch frame",
};

export interface AirsideMedicalData {
  title: string;
  description: string;
  checklist: string[];
  bookNowLabel: string;
  bookNowHref: string;
  image: StaticImageData;
  imageAlt: string;
  backgroundIllustration?: StaticImageData;
  backgroundIllustrationAlt?: string;
}

import airsideMedical from "@/assets/home/airside-medical.png";

export const airsideMedicalData: AirsideMedicalData = {
  title: "Are you looking for a Airside Medical near you?",
  description:
    "At Compliance Medicals, we provide professional airside medicals that meet AOA and DVLA Group 2 standards, ensuring you are fit, safe, and compliant for airside operations.",
  checklist: [
    "Height, weight & BMI",
    "Blood pressure & pulse check",
    "Vision checks",
    "Urinalysis",
    "A full hearing assessment",
    "Spirometry/ Respiratory assessment",
  ],
  bookNowLabel: "Book Now",
  bookNowHref: "/booking?type=occupational",
  image: airsideMedical,
  imageAlt: "Airfield tarmac environment with vehicles",
  backgroundIllustration: medicalBusIllustration,
  backgroundIllustrationAlt: "Decorative sketch frame",
};

export interface SeafarersMedicalData {
  title: string;
  description: string;
  checklist: string[];
  bookNowLabel: string;
  bookNowHref: string;
  image: StaticImageData;
  imageAlt: string;
  backgroundIllustration?: StaticImageData;
  backgroundIllustrationAlt?: string;
}

import seaMedical from "@/assets/home/sea-medical.png";

export const seafarersMedicalData: SeafarersMedicalData = {
  title: "Do you need a ML5 Sea Farers Medical?",
  description:
    "The ML5 Seafarers Medical is essential for anyone working at sea, ensuring you are medically fit for prolonged voyages. At Compliance Medicals, we offer affordable ML5 medicals, including an eye test, with full support from our GMC-registered doctors.",
  checklist: [
    "Height, weight & BMI",
    "Blood pressure & pulse check",
    "Vision checks",
    "Urinalysis",
    "A full hearing assessment",
    "Spirometry/ Respiratory assessment",
  ],
  bookNowLabel: "Book Now",
  bookNowHref: "/booking?type=occupational",
  image: seaMedical,
  imageAlt: "Seafarer working on the deck of a ship at sea",
  backgroundIllustration: medicalBusIllustration,
  backgroundIllustrationAlt: "Decorative sketch frame",
};

export interface OccupationalPreEmploymentData {
  title: string;
  description: string;
  checklist: string[];
  bookNowLabel: string;
  bookNowHref: string;
  image: StaticImageData;
  imageAlt: string;
  backgroundIllustration?: StaticImageData;
  backgroundIllustrationAlt?: string;
}

import preEmploymentImage from "@/assets/home/pre-employment-medical.png";

export const occupationalPreEmploymentData: OccupationalPreEmploymentData = {
  title: "Are you looking for a Pre-Employment Medical near you?",
  description:
    "Compliance Medicals provides onsite and in-clinic pre-employment medical assessments tailored to your needs. Our medicals help you meet job requirements and include a fitness certificate for your employer.",
  checklist: [
    "Ensuring Fit for the Role",
    "Health and Safety Compliance",
    "Vision checks",
    "Risk Management",
  ],
  bookNowLabel: "Book Now",
  bookNowHref: "/booking?type=occupational",
  image: preEmploymentImage,
  imageAlt: "Pre-employment safety medical assessment",
  backgroundIllustration: medicalBusIllustration,
  backgroundIllustrationAlt: "Decorative sketch frame",
};
