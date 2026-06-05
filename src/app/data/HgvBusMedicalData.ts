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
    { label: "Clinic Location", href: "/#location", variant: "outline" },
  ],
  image: hgvMedicalBusImage,
  imageAlt: "HGV vehicle for local medical facility",
  backgroundIllustration: medicalBusIllustration,
  backgroundIllustrationAlt: "Decorative frame behind HGV medical image",
};
