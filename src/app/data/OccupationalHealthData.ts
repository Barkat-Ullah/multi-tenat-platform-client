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
