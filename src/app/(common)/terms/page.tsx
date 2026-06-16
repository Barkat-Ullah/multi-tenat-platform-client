import type { Metadata } from "next";
import TermsClient from "@/components/pages/terms/TermsClient";

export const metadata: Metadata = {
  title: "Terms & Conditions | Compliance Medicals",
  description:
    "Review our terms and conditions to understand our company registrations, acceptance guidelines, customer responsibilities, refund policies, and legal agreements.",
};

export default function TermsPage() {
  return <TermsClient />;
}
