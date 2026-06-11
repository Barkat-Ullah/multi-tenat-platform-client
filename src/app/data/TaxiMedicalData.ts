import type { StaticImageData } from "next/image";
import taxiHeroImage from "@/assets/home/taxies.png";
import hvgTaxiImage from "@/assets/home/hvg-taxi.png";
import medicalBusIllustration from "@/assets/home/medical-bus-illustration.png";
import medicalRecordsDoctor from "@/assets/home/medical-records-doctor.png";



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

export const taxiCouncils = [
  "Transport for London (TfL)",
  "Birmingham City Council",
  "Manchester City Council",
  "Leeds City Council",
  "Liverpool City Council",
  "Sheffield City Council",
  "Bristol City Council",
  "Coventry City Council",
  "Leicester City Council",
  "Nottingham City Council",
  "Newcastle City Council",
  "Wolverhampton City Council",
  "Bradford City Council",
  "Southampton City Council",
  "Cardiff Council",
  "Edinburgh City Council",
  "Glasgow City Council",
  "York City Council",
  "Kirklees Council",
  "Wakefield Council",
  "Dudley Council",
  "Sandwell Council",
  "Solihull Council",
  "Walsall Council",
];

export interface TaxiTrustItem {
  iconName: string;
  title: string;
  description: string;
}

export const taxiTrustData: TaxiTrustItem[] = [
  {
    iconName: "ShieldCheck",
    title: "Fully Compliant",
    description: "Secure central storage and detailed records",
  },
  {
    iconName: "Lock",
    title: "Your Data is Safe",
    description: "Secure central storage and detailed records",
  },
  {
    iconName: "MapPin",
    title: "1,200+ Locations",
    description: "Find convenient stations near you",
  },
  {
    iconName: "Star",
    title: "5-Star Rated",
    description: "Trusted by hundreds of happy clients",
  },
];

export interface TaxiWhatToBringItem {
  iconName: string;
  title: string;
  description: string;
}

export interface TaxiWhatToBringData {
  eyebrow: string;
  title: string;
  description: string;
  image: StaticImageData;
  imageAlt: string;
  backgroundIllustration: StaticImageData;
  backgroundIllustrationAlt: string;
  items: TaxiWhatToBringItem[];
}

export const taxiWhatToBringData: TaxiWhatToBringData = {
  eyebrow: "What should medicals",
  title: "What should I bring for my Taxi medical?",
  description:
    "compliance medical forms are available at all clinics, and our team is happy to help with your Taxi medical queries.",
  image: hvgTaxiImage,
  imageAlt: "Three black taxi cabs parked for driver medical exam",
  backgroundIllustration: medicalBusIllustration,
  backgroundIllustrationAlt: "Decorative sketch frame behind image",
  items: [
    {
      iconName: "FileText",
      title: "Medical Records",
      description: "Bring a printed or digital copy to your doctor's appointment.",
    },
    {
      iconName: "Glasses",
      title: "Glasses/Contacts",
      description: "Bring your glasses, contact lenses, or a valid prescription if you use them.",
    },
    {
      iconName: "ClipboardList",
      title: "Council Forms",
      description: "Complete and bring any council provided medical forms if required.",
    },
    {
      iconName: "IdCard",
      title: "Form Of ID",
      description: "Bring a valid photo ID such as a passport or driving license.",
    },
    {
      iconName: "Pill",
      title: "Prescriptions",
      description: "Bring list or copy of your current medications and prescriptions.",
    },
  ],
};

export interface TaxiMedicalRecordStep {
  number: string;
  iconName: string;
  description: string;
}

export interface TaxiMedicalRecordsData {
  title: string;
  description: string;
  image: StaticImageData;
  imageAlt: string;
  backgroundIllustration: StaticImageData;
  backgroundIllustrationAlt: string;
  steps: TaxiMedicalRecordStep[];
}

export const taxiMedicalRecordsData: TaxiMedicalRecordsData = {
  title: "How Can I Get My Medical Records?",
  description: "Book your driver medical quickly and hassle-free in just 3 simple steps.",
  image: medicalRecordsDoctor,
  imageAlt: "Smiling doctor sitting at a desk with a laptop",
  backgroundIllustration: medicalBusIllustration,
  backgroundIllustrationAlt: "Decorative sketch frame behind doctor image",
  steps: [
    {
      number: "01",
      iconName: "Search",
      description: "Get a copy of your complete medical records from birth by contacting your general practitioner's office.",
    },
    {
      number: "02",
      iconName: "Clock",
      description: "Give your information, including your full name, birthdate, address, and, if you know it, your NHS number.",
    },
    {
      number: "03",
      iconName: "UserCheck",
      description: "Your general practitioner's office may take up to 28 days to process the request.",
    },
    {
      number: "04",
      iconName: "Clock",
      description: "Bring a printed or digital copy to your doctor's appointment.",
    },
  ],
};

export interface TaxiFaqItem {
  question: string;
  answer: string;
}

export interface TaxiFaqData {
  title: string;
  description: string;
  faqs: TaxiFaqItem[];
}

export const taxiFaqData: TaxiFaqData = {
  title: "Taxi Medicals FAQS",
  description:
    "Find answers to common questions about taxi medicals, including requirements, documents needed, DVLA standards, and how to book your medical appointment quickly and easily.",
  faqs: [
    {
      question: "What Is Needed by My Council?",
      answer:
        "Regarding taxi medicals, each municipal council has its own set of regulations. While some authorities may accept a summary printout from your GP or the NHS App, others may need a complete copy of your GP's medical records. Additionally, some councils need the completion of their own medical paperwork.",
    },
    {
      question: "Where is my Taxi Council Medical Form located?",
      answer:
        "Your local council's licensing department website usually hosts the specific medical form required for your application. You can download it directly from there, or we can provide advice on where to obtain it. Remember to print it out and bring it to your medical appointment.",
    },
    {
      question: "When Should Your Taxi Medical Be Renewed?",
      answer:
        "Typically, most councils require a new medical examination when you first apply, then every 5 years starting from age 45, and annually from age 65. However, licensing terms vary by local authority, so you should always check your specific council's guidelines.",
    },
    {
      question: "What Does a Taxi Driver's Medical Coverage Include?",
      answer:
        "The medical assessment includes an eyesight test (using a Snellen chart to verify visual acuity), blood pressure measurement, a review of your medical history, and a physical examination checking your general health, heart, and neurological system to ensure safety behind the wheel.",
    },
  ],
};





