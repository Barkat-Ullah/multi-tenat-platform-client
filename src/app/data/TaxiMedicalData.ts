import type { StaticImageData } from "next/image";
import taxiHeroImage from "@/assets/home/taxies.png";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface TaxiMedicalHeroData {
  breadcrumbs: BreadcrumbItem[];
  titleLineOne: string;
  titleLineTwo: string;
  description: string;
  image: StaticImageData;
  imageAlt: string;
}

export const taxiMedicalHeroData: TaxiMedicalHeroData = {
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Taxi Medicals" },
  ],
  titleLineOne: "Taxi",
  titleLineTwo: "Medicals",
  description:
    "Fast and affordable taxi driver medicals completed by GMC-registered doctors, fully compliant with local council and DVLA requirements.",
  image: taxiHeroImage,
  imageAlt: "Black taxi cab for driver medicals",
};

export interface TaxiFeatureItem {
  iconName: string;
  title: string;
  description: string;
}

export const taxiFeaturesData: TaxiFeatureItem[] = [
  {
    iconName: "Calendar",
    title: "7 Day Week",
    description: "Weekend and Evening Appointments available",
  },
  {
    iconName: "ClipboardList",
    title: "Simple & Fast",
    description: "Easy online booking and quick medicals",
  },
  {
    iconName: "CarFront",
    title: "Accept by 100+ Councils",
    description: "We meet local and national licensing requirements",
  },
  {
    iconName: "Stethoscope",
    title: "GMC Registered Doctors",
    description: "Medicals carried out by fully qualified professionals",
  },
];
