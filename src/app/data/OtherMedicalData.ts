import type { StaticImageData } from "next/image";
import otherMedicalsHeroImage from "@/assets/home/other-medicals-vehicles.png";
import ambulanceHeroIntroImage from "@/assets/home/ambulance-hero-intro.png";
import medicalBusIllustration from "@/assets/home/medical-bus-illustration.png";
import preEmploymentImage from "@/assets/home/pre-employment.png";
import motorhomeDriverImage from "@/assets/home/motorhome-driver-medical.png";
import forkliftImage from "@/assets/home/forklift.png";
import motorsportImage from "@/assets/home/motorsportMedicals.png";
import craneOperatorImage from "@/assets/home/craneOperator.png";



export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface OtherMedicalHeroData {
  breadcrumbs: BreadcrumbItem[];
  titleLineOne: string;
  titleLineTwo: string;
  description: string;
  image: StaticImageData;
  imageAlt: string;
}

export const otherMedicalHeroData: OtherMedicalHeroData = {
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Other Medicals" },
  ],
  titleLineOne: "Other",
  titleLineTwo: "Medicals",
  description:
    "Fast and affordable taxi driver medicals completed by GMC-registered doctors, fully compliant with local council and DVLA requirements.",
  image: otherMedicalsHeroImage,
  imageAlt: "Ambulance, motorhome, sports car and airport tug parked on tarmac",
};

export interface AmbulanceIntroData {
  title: string;
  description: string;
  image: StaticImageData;
  imageAlt: string;
  backgroundIllustration: StaticImageData;
  backgroundIllustrationAlt: string;
  whatHappensTitle: string;
  whatHappensDesc: string;
  whatToBringTitle: string;
  whatToBringItems: string[];
  whatToDoTitle: string;
  whatToDoDesc: string;
  bookNowLabel: string;
  bookNowHref: string;
}

export const ambulanceIntroData: AmbulanceIntroData = {
  title: "Ambulance Driver Medical",
  description:
    "Many ambulance students need a provisional C1 licence before starting paramedic studies. We provide ambulance driver medicals for students, paramedics, and ambulance drivers across the UK.",
  image: ambulanceHeroIntroImage,
  imageAlt: "Yellow emergency ambulance parked on city street",
  backgroundIllustration: medicalBusIllustration,
  backgroundIllustrationAlt: "Decorative sketch frame",
  whatHappensTitle: "What's going to occur at the medical?",
  whatHappensDesc:
    "Our physician will verify your identity and complete a DVLA-approved medical examination, including vision and blood pressure checks.",
  whatToBringTitle: "What you need To bring to the medical?",
  whatToBringItems: [
    "D4 Medical Form",
    "Download Here",
    "Photo ID",
    "Your driving glasses/contact lenses & prescription",
  ],
  whatToDoTitle: "What to do after the medical?",
  whatToDoDesc:
    "Please send your completed application forms (D4 form and D2 form) to the DVLA using the return envelope provided.",
  bookNowLabel: "Book Now",
  bookNowHref: "/booking?type=ambulance",
};

export interface PreEmploymentData {
  title: string;
  description: string;
  image: StaticImageData;
  imageAlt: string;
  backgroundIllustration: StaticImageData;
  backgroundIllustrationAlt: string;
  whatHappensTitle: string;
  whatHappensDesc: string;
  whatToBringTitle: string;
  whatToBringItems: string[];
  whatToDoTitle: string;
  whatToDoDesc: string;
  bookNowLabel: string;
  bookNowHref: string;
}

export const preEmploymentData: PreEmploymentData = {
  title: "Pre -Employee",
  description:
    "Many employers require a fitness certificate before work begins. Our doctors carry out pre-employment medicals to DVLA Group 2 standards.",
  image: preEmploymentImage,
  imageAlt: "Construction workers in safety gear holding plans",
  backgroundIllustration: medicalBusIllustration,
  backgroundIllustrationAlt: "Decorative sketch frame",
  whatHappensTitle: "What's going to occur at the medical?",
  whatHappensDesc:
    "Your visit includes identity verification, a medical assessment, vision test, and blood pressure check in line with DVLA requirements.",
  whatToBringTitle: "What you require to take to the medical examination?",
  whatToBringItems: [
    "Photo ID",
    "Your driving glasses/contact lenses & prescription",
    "Details of any medical conditions and medications you take.",
    "Medical records where required",
  ],
  whatToDoTitle: "What to do after the medical?",
  whatToDoDesc:
    "Please send your completed application forms (D4 form and D2 form) to the DVLA using the return envelope provided.",
  bookNowLabel: "Book Online",
  bookNowHref: "/booking?type=pre-employment",
};

export interface MotorhomeIntroData {
  title: string;
  description: string;
  image: StaticImageData;
  imageAlt: string;
  backgroundIllustration: StaticImageData;
  backgroundIllustrationAlt: string;
  whatHappensTitle: string;
  whatHappensDesc: string;
  whatToBringTitle: string;
  whatToBringItems: Array<{
    segments: Array<{ text: string; isLink?: boolean; linkUrl?: string }>;
  }>;
  whatToDoTitle: string;
  whatToDoDesc: string;
  bookNowLabel: string;
  bookNowHref: string;
}

export const motorhomeIntroData: MotorhomeIntroData = {
  title: "Motorhome Driver Medical",
  description:
    "Driving a motorhome over 3.5 tonnes requires a standard D4 medical. If you got your licence before 1997, you'll also need it at age 70 to renew your C1 entitlement.",
  image: motorhomeDriverImage,
  imageAlt: "Heavy vehicle driver medical representation",
  backgroundIllustration: medicalBusIllustration,
  backgroundIllustrationAlt: "Decorative sketch frame",
  whatHappensTitle: "What's going to occur at the medical?",
  whatHappensDesc:
    "During your appointment, our doctor will verify your identity and conduct a DVLA-approved medical exam, which includes comprehensive vision and blood pressure checks.",
  whatToBringTitle: "What you need To bring to the medical?",
  whatToBringItems: [
    {
      segments: [
        { text: "D4 Medical Form ", isLink: false },
        // { text: "Download Here", isLink: true, linkUrl: "/d4-medical-form" }
      ]
    },
    {
      segments: [
        { text: "Photo ID.", isLink: false }
      ]
    },
    {
      segments: [
        { text: "Your driving glasses/contact lenses & prescription.", isLink: false }
      ]
    },
    {
      segments: [
        { text: "Details of any ongoing medical conditions plus any medication you are taking.", isLink: false }
      ]
    }
  ],
  whatToDoTitle: "What to do after the medical?",
  whatToDoDesc:
    "Once you have completed your D2 and D4 application forms, please return them to the DVLA using the enclosed envelope.",
  bookNowLabel: "Book Online",
  bookNowHref: "/booking?type=motorhome",
};

export interface ForkliftIntroData {
  title: string;
  description: string;
  image: StaticImageData;
  imageAlt: string;
  backgroundIllustration: StaticImageData;
  backgroundIllustrationAlt: string;
  whatHappensTitle: string;
  whatHappensDesc: string;
  whatToBringTitle: string;
  whatToBringItems: string[];
  whatToDoTitle: string;
  whatToDoDesc: string;
  bookNowLabel: string;
  bookNowHref: string;
}

export const forkliftIntroData: ForkliftIntroData = {
  title: "Forklift Medical",
  description:
    "FLT medicals ensure forklift operators are fit to work safely. These health assessments are carried out by GMC-registered doctors.",
  image: forkliftImage,
  imageAlt: "Forklift truck operator working in warehouse",
  backgroundIllustration: medicalBusIllustration,
  backgroundIllustrationAlt: "Decorative sketch frame",
  whatHappensTitle: "What's going to occur at the medical?",
  whatHappensDesc:
    "During your appointment, our doctor will verify your identity before conducting a comprehensive physical assessment and reviewing your medical history.",
  whatToBringTitle: "What you need To bring to the medical?",
  whatToBringItems: [
    "Photo ID",
    "Your driving glasses/contact lenses & prescription",
    "Current medical conditions and medications.",
    "Medical records where required",
  ],
  whatToDoTitle: "What to do after the medical?",
  whatToDoDesc:
    "Please submit your completed application forms.",
  bookNowLabel: "Book Online",
  bookNowHref: "/booking?type=forklift",
};

export interface MotorsportIntroData {
  title: string;
  description: string;
  image: StaticImageData;
  imageAlt: string;
  backgroundIllustration: StaticImageData;
  backgroundIllustrationAlt: string;
  whatHappensTitle: string;
  whatHappensDesc: string;
  whatToBringTitle: string;
  whatToBringItems: string[];
  whatToDoTitle: string;
  whatToDoDesc: string;
  bookNowLabel: string;
  bookNowHref: string;
}

export const motorsportIntroData: MotorsportIntroData = {
  title: "Motorsport Medicals",
  description:
    "A Motorsport medical is required for National Race or International Competition Licence applications and renewals for drivers over 60 or with a medical condition.",
  image: motorsportImage,
  imageAlt: "Three people wearing face masks talking next to a car with an open hood in a garage",
  backgroundIllustration: medicalBusIllustration,
  backgroundIllustrationAlt: "Decorative sketch frame",
  whatHappensTitle: "What's going to occur at the medical?",
  whatHappensDesc:
    "Our doctor will complete a driver medical covering health history, blood pressure, vision, urine testing, and physical checks. International applicants also need an ECG review.",
  whatToBringTitle: "What you need To bring to the medical?",
  whatToBringItems: [
    "Motorsport medical form.",
    "Photo ID",
    "Your driving glasses/contact lenses & prescription.",
    "Current conditions and medications..",
  ],
  whatToDoTitle: "What to do after the medical?",
  whatToDoDesc:
    "Please submit your completed application forms.",
  bookNowLabel: "Book Online",
  bookNowHref: "/booking?type=motorsport",
};

export interface CraneIntroData {
  title: string;
  description: string;
  image: StaticImageData;
  imageAlt: string;
  backgroundIllustration: StaticImageData;
  backgroundIllustrationAlt: string;
  whatHappensTitle: string;
  whatHappensDesc: string;
  whatToBringTitle: string;
  whatToBringItems: string[];
  whatToDoTitle: string;
  whatToDoDesc: string;
  bookNowLabel: string;
  bookNowHref: string;
}

export const craneIntroData: CraneIntroData = {
  title: "Crane Operator Medical",
  description:
    "Crane medicals ensure operators are fit to work safely. These assessments are carried out by GMC-registered doctors.",
  image: craneOperatorImage,
  imageAlt: "Construction workers in safety gear and hard hats on site",
  backgroundIllustration: medicalBusIllustration,
  backgroundIllustrationAlt: "Decorative sketch frame",
  whatHappensTitle: "What's going to occur at the medical?",
  whatHappensDesc:
    "After ID verification, our doctor will review your medical history and carry out a physical assessment, including blood pressure and vision tests.",
  whatToBringTitle: "What you need To bring to the medical?",
  whatToBringItems: [
    "Medical Form (specific to your company). We can provide standard forms.",
    "Photo ID",
    "Your driving glasses/contact lenses & prescription.",
    "Current conditions and medications..",
  ],
  whatToDoTitle: "What to do after the medical?",
  whatToDoDesc:
    "Please submit your completed application forms.",
  bookNowLabel: "Book Now",
  bookNowHref: "/booking?type=crane",
};






