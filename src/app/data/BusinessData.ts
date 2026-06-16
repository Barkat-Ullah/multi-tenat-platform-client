import type { StaticImageData } from "next/image";
import hgvBusHeroImage from "@/assets/home/hgv-buses.png";
import hgvBusImage from "@/assets/home/hgv-bus-2.png";
import hgvMedicalBusImage from "@/assets/home/hgv-buses-2.png";
import medicalRecordsDoctor from "@/assets/home/medical.png";
import hvgBusinessImage from "@/assets/home/certificate.png";
import preEmploymentImage from "@/assets/home/pre-employment.png";
import medicalBusIllustration from "@/assets/home/medical-bus-illustration.png";


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

export interface OnSiteRequirementCard {
  image: StaticImageData;
  imageAlt: string;
  title: string;
  description: string;
  innerDescription?: string;
  listItems: string[];
  footerDescription?: string;
}

export interface OnSiteRequirementsData {
  title: string;
  subtitlePrefix: string;
  subtitleUnderline: string;
  subtitleSuffix: string;
  cards: OnSiteRequirementCard[];
  bookNowLabel: string;
  bookNowHref: string;
}

export const onSiteRequirementsData: OnSiteRequirementsData = {
  title: "On-Site Medical Requirements",
  subtitlePrefix: "",
  subtitleUnderline: "Compliance Medicals",
  subtitleSuffix: " can send a doctor to your location for driver medical assessments, helping reduce disruption to your business operations.",
  bookNowLabel: "Book Now",
  bookNowHref: "/booking?type=business",
  cards: [
    {
      image: hgvBusImage,
      imageAlt: "Red semi-truck driving on the highway",
      title: "Which medicals can we provide at your location?",
      description: "We provide the following on-site assessments:",
      listItems: [
        "D4 Medicals",
        "Taxi Medicals",
        "Occupational Medical",
        "Forklift Medicals",
        "Pre-Employment Medicals",
      ],
    },
    {
      image: hgvMedicalBusImage,
      imageAlt: "Large warehouse depot lit up at night with trucks parked",
      title: "Can we arrange an on-site clinic at your location?",
      description: "Most premises are suitable for site visits, but a few minimum requirements must be met before booking.",
      innerDescription: "The examination room must be:",
      listItems: [
        "At least 4x4 metres in size",
        "Well lit, preferably with natural lighting.",
        "Occupational Medical",
        "Near a waiting area or seating space.",
      ],
      footerDescription: "We'll ask you to complete a clinic list to help our doctor manage appointments smoothly.",
    },
    {
      image: medicalRecordsDoctor,
      imageAlt: "Doctor talking to a patient across a table with a clipboard",
      title: "What should drivers bring to their appointment?",
      description: "Required items may vary slightly depending on the assessment.",
      innerDescription: "All candidates must bring the following:",
      listItems: [
        "Photo ID",
        "Glasses & Prescription",
        "Current Medications",
      ],
    },
  ],
};

export interface ConsentCertificatesData {
  title: string;
  paragraphOne: string;
  paragraphTwo: string;
  image: StaticImageData;
  imageAlt: string;
  backgroundIllustrationAlt: string;
}

export const consentCertificatesData: ConsentCertificatesData = {
  title: "Consent & Certificates",
  paragraphOne:
    "We can provide a fitness certificate for your company to keep on file for specific kinds of appointments. Documented consent from the candidate is required if you need a certificate or detailed information regarding assessment results, such as the reasons why a candidate might not achieve the essential criteria.",
  paragraphTwo:
    "Prior to the on-site visit, the company is responsible for obtaining this consent and informing the attending physician of any candidates who have not given their consent. We will give you a link to an online consent form to help in this procedure, which you can distribute to each candidate.",
  image: hvgBusinessImage,
  imageAlt: "Certificate of Medical Fitness sample sheet from Compliance Medicals",
  backgroundIllustrationAlt: "Decorative sketch frame",
};

export interface WhyOnSiteItem {
  label: string;
  text: string;
}

export interface WhyOnSiteData {
  title: string;
  items: WhyOnSiteItem[];
  image: StaticImageData;
  imageAlt: string;
  backgroundIllustration: StaticImageData;
  backgroundIllustrationAlt: string;
}

export const whyOnSiteData: WhyOnSiteData = {
  title: "Why reserve a clinic on-site?",
  items: [
    {
      label: "Cost-effective",
      text: "Because you can schedule several drivers at once rather than one at a time, our on-site clinics are more affordable.",
    },
    {
      label: "Convenient",
      text: "We offer start hours from 5 a.m. to 11 p.m., so your drivers may be evaluated with minimum disturbance to work schedules.",
    },
    {
      label: "Effective",
      text: "Depending on the medical examination you have scheduled, 16 drivers can be assessed in a half-day clinic and 32 on a full day.",
    },
  ],
  image: preEmploymentImage,
  imageAlt: "Two construction managers in safety vests and hard hats holding a chart report",
  backgroundIllustration: medicalBusIllustration,
  backgroundIllustrationAlt: "Decorative sketch frame",
};



