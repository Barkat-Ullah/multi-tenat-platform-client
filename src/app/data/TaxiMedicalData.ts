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
