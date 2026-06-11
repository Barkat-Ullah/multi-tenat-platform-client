import type { StaticImageData } from "next/image";
import hgvBusHeroImage from "@/assets/home/hgv-buses.png";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BusinessHeroData {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  description: string;
  image: StaticImageData;
  imageAlt: string;
}

export const businessHeroData: BusinessHeroData = {
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Business" },
  ],
  title: "Businesses",
  description:
    "Learn more about our business services, company values, and how we provide professional solutions tailored to your needs.",
  image: hgvBusHeroImage,
  imageAlt: "Row of semi-trucks parked next to mountains under a blue sky",
};
