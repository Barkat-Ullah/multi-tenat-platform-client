import type { StaticImageData } from "next/image";
import hgvBusHeroImage from "@/assets/home/hgv-buses.png";
import hgvMedicalBusImage from "@/assets/home/hgv-medical-bus.png";
import medicalBusIllustration from '@/assets/home/medical-bus-illustration.png'

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface HgvBusMedicalHeroData {
  breadcrumbs: BreadcrumbItem[];
  eyebrow: string;
  titleLineOne: string;
  titleLineTwo: string;
  description: string;
  image: StaticImageData;
  imageAlt: string;
}

export interface HgvBusMedicalIntroAction {
  label: string;
  href: string;
  variant: "solid" | "outline";
}

export interface HgvBusMedicalIntroData {
  title: string;
  description: string;
  checklist: string[];
  actions: HgvBusMedicalIntroAction[];
  image: StaticImageData;
  imageAlt: string;
  backgroundIllustration?: StaticImageData;
  backgroundIllustrationAlt?: string;
}

export const hgvBusMedicalHeroData: HgvBusMedicalHeroData = {
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "HGV/Bus Medicals" },
  ],
  eyebrow: "DVLA-compliant driver medicals",
  titleLineOne: "HGV/Bus",
  titleLineTwo: "Medicals",
  description:
    "Fast and affordable DVLA-compliant medicals for HGV, LGV, and Bus drivers, including full form completion.",
  image: hgvBusHeroImage,
  imageAlt: "HGV truck for driver medicals",
};

export const hgvBusMedicalIntroData: HgvBusMedicalIntroData = {
  title: "Are you trying to find a local HGV medical facility?",
  description:
    "Motor Medicals provides HGV medicals across Manchester, Leeds, Birmingham, Liverpool, Sheffield, and clinics nationwide.",
  checklist: [
    "Included is an eye test.",
    "Registered Physicians at GMC",
    "Compliance medicals forms completed in a clinic",
    "40+ clinics across the country!",
  ],
  actions: [
    { label: "Book Online", href: "/booking?type=hgv-bus", variant: "solid" },
    { label: "Clinic Location", href: "/locations", variant: "outline" },
  ],
  image: hgvMedicalBusImage,
  imageAlt: "HGV vehicle for local medical facility",
  backgroundIllustration: medicalBusIllustration,
  backgroundIllustrationAlt: "Decorative frame behind HGV medical image",
};

export interface HgvBusServiceItem {
  iconName: string;
  title: string;
}

export interface HgvBusServicesData {
  eyebrow: string;
  title: string;
  description: string;
  services: HgvBusServiceItem[];
  bookNowHref: string;
  arrangeMedical: {
    title: string;
    phoneLabel: string;
    phoneNumber: string;
    phoneHref: string;
    bookTodayLabel: string;
    bookTodayHref: string;
    visitClinicsLabel: string;
    visitClinicsHref: string;
  };
}

export const hgvBusServicesData: HgvBusServicesData = {
  eyebrow: "Our Services",
  title: "What does an HGV/D4 Medical include?",
  description:
    "To maintain a safe workplace, we at Motor Medicals make care to cover all health concerns. Included in our HGV/D4 medical are:",
  services: [
    { iconName: "eye", title: "Eye Test" },
    { iconName: "blood-pressure", title: "Blood pressure Check" },
    { iconName: "physical-exam", title: "Physical Exam" },
    { iconName: "bmi", title: "Test BMI" },
  ],
  bookNowHref: "/booking?type=hgv-bus",
  arrangeMedical: {
    title: "How to arrange your medical?",
    phoneLabel: "Speak to our team",
    phoneNumber: "+000000 000", // using standard phone number from footer
    phoneHref: "tel:+000000 000",
    bookTodayLabel: "Book in Today",
    bookTodayHref: "/booking?type=hgv-bus",
    visitClinicsLabel: "Visit one of our 40+ clinics",
    visitClinicsHref: "/locations",
  },
};

export interface HgvBusWhatToBringItem {
  iconName: string;
  description: string;
}

export interface HgvBusWhatToBringData {
  eyebrow: string;
  title: string;
  description: string;
  items: HgvBusWhatToBringItem[];
}

export const hgvBusWhatToBringData: HgvBusWhatToBringData = {
  eyebrow: "What should medicals",
  title: "What should I bring for my HGV medical?",
  description:
    "compliance medical forms are available at all clinics, and our team is happy to help with your C1/ Ambulance medical queries.",
  items: [
    {
      iconName: "document",
      description: "Your compliance medical form for (we have spares in clinic)",
    },
    {
      iconName: "glasses",
      description: "Any Contacts or Glasses Worn During Driving or Daily Activities",
    },
    {
      iconName: "clipboard",
      description: "Any Hospital Letters That Are Relevant to Your Medical History",
    },
    {
      iconName: "pills",
      description: "Any Drugs Taken Including Prescribed Medication",
    },
  ],
};

export interface HgvBusRenewData {
  title: string;
  subtitle: string;
  paragraphs: string[];
}

export const hgvBusRenewData: HgvBusRenewData = {
  title: "When should I renew my HGV/compliance medical?",
  subtitle: "compliance medical forms are available at all clinics, and our team is happy to help with your C1/Ambulance medical queries.",
  paragraphs: [
    "Throughout their careers, HGV drivers must undergo medical exams.\non your initial application for a temporary license.\nYou will need to get another medical examination when you turn 45, and then every five years after that.",
    "Every year once you turn 65, you must have a medical examination.\nGet professional guidance from Motor medicals on HGV medical renewals. Study up on the D4 renewal procedure.\nrequirements, as well as advice for a smooth HGV medical examination.\nMake an appointment to renew your HGV medical now!"
  ],
};

export interface HgvBusClinicItem {
  status: string;
  name: string;
  address: string;
  distance: string;
  openingHours: string;
  carParking: string;
  bookNowHref: string;
}

export interface HgvBusNearestClinicData {
  eyebrow: string;
  title: string;
  description: string;
  mapSearchPlaceholder: string;
  mapSearchButtonLabel: string;
  clinics: HgvBusClinicItem[];
}

export const hgvBusNearestClinicData: HgvBusNearestClinicData = {
  eyebrow: "Search for Nearest Medical",
  title: "Where can I get an HGV medical?",
  description:
    "You can complete your complian HGV medical at over 40 clinics nationwide, including Manchester, Birmingham, Leeds, Liverpool, and more. Use the locations option below to find your nearest clinic.",
  mapSearchPlaceholder: "Your Address",
  mapSearchButtonLabel: "Search Nearest Clinic",
  clinics: [
    {
      status: "Online",
      name: "Delta McKeever Hotel, Derby McKeever Court Hotel",
      address: "Elvaston Road, Weston, DE3 0KR",
      distance: "0.5 mile",
      openingHours: "Open 24 Hours",
      carParking: "Yes (Free)",
      bookNowHref: "/booking?type=hgv-bus&clinic=delta",
    },
    {
      status: "Online",
      name: "Royal London Hospital",
      address: "",
      distance: "2 mile",
      openingHours: "Open 24 Hours",
      carParking: "No",
      bookNowHref: "/booking?type=hgv-bus&clinic=royal-london",
    },
    {
      status: "Online",
      name: "HCA Healthcare UK",
      address: "",
      distance: "11.5 mile",
      openingHours: "Open 24 Hours",
      carParking: "Yes (Free)",
      bookNowHref: "/booking?type=hgv-bus&clinic=hca",
    },
  ],
};
