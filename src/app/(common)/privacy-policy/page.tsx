import type { Metadata } from "next";
import PrivacyPolicyClient from "@/components/pages/privacy-policy/PrivacyPolicyClient";

export const metadata: Metadata = {
  title: "Privacy Policy | Compliance Medicals",
  description:
    "Review our privacy policy to understand how we collect, use, and protect your personal information when scheduling bookings and using our medical services.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
