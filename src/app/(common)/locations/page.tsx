import type { Metadata } from "next";
import LocationsPageClient from "@/components/pages/locations/LocationsPageClient";

export const metadata: Metadata = {
  title: "Find Your Nearest Clinic | Compliance Medicals",
  description:
    "Find your nearest Compliance Medicals clinic. Book HGV, Bus, Taxi, and Occupational Health medical exams at over 80+ locations across the UK including Aberdeen, Birmingham, Basildon, Belfast, and more.",
};

export default function LocationsPage() {
  return <LocationsPageClient />;
}
