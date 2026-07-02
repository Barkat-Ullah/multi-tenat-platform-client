import { StaticImageData } from "next/image";
import hgvImg from "@/assets/home/hgv-medical-bus.png";
import taxiImg from "@/assets/home/taxies.png";
import ambulanceImg from "@/assets/home/ambulance-hero-intro.png";
import forkliftImg from "@/assets/home/forklift.png";
import motorsportImg from "@/assets/home/motorsportMedicals.png";
import preEmploymentImg from "@/assets/home/pre-employment.png";

export interface NotificationItemData {
  id: string;
  title: string;
  location: string;
  time: string;
}

export const notificationsData: NotificationItemData[] = [
  // Page 1
  { id: "1", title: "New medical booking received.", location: "St Thomas' Hospital", time: "10:20 am" },
  { id: "2", title: "Booking confirmed successfully.", location: "St Thomas' Hospital", time: "10:20 am" },
  { id: "3", title: "Booking cancelled by patient.", location: "St Thomas' Hospital", time: "10:20 am" },
  { id: "4", title: "New medical booking received.", location: "St Thomas' Hospital", time: "10:20 am" },
  { id: "5", title: "Booking confirmed successfully.", location: "St Thomas' Hospital", time: "10:20 am" },
  { id: "6", title: "Booking cancelled by patient.", location: "St Thomas' Hospital", time: "10:20 am" },
  { id: "7", title: "New medical booking received.", location: "St Thomas' Hospital", time: "10:20 am" },
  
  // Page 2
  { id: "8", title: "Booking confirmed successfully.", location: "Guy's Hospital", time: "11:30 am" },
  { id: "9", title: "New medical booking received.", location: "King's College Hospital", time: "11:45 am" },
  { id: "10", title: "Booking cancelled by patient.", location: "St George's Hospital", time: "12:00 pm" },
  { id: "11", title: "New medical booking received.", location: "Royal London Hospital", time: "12:15 pm" },
  { id: "12", title: "Booking confirmed successfully.", location: "St Thomas' Hospital", time: "12:30 pm" },
  { id: "13", title: "Booking cancelled by patient.", location: "King's College Hospital", time: "01:00 pm" },
  { id: "14", title: "New medical booking received.", location: "Guy's Hospital", time: "01:15 pm" },

  // Page 3
  { id: "15", title: "Booking confirmed successfully.", location: "Royal London Hospital", time: "02:30 pm" },
  { id: "16", title: "Booking cancelled by patient.", location: "St Thomas' Hospital", time: "03:00 pm" },
  { id: "17", title: "New medical booking received.", location: "St George's Hospital", time: "03:15 pm" },
  { id: "18", title: "Booking confirmed successfully.", location: "Guy's Hospital", time: "03:30 pm" },
  { id: "19", title: "New medical booking received.", location: "King's College Hospital", time: "04:00 pm" },
  { id: "20", title: "Booking cancelled by patient.", location: "Royal London Hospital", time: "04:30 pm" },
  { id: "21", title: "New medical booking received.", location: "St Thomas' Hospital", time: "05:00 pm" },
];

export interface ReportItemData {
  id: string;
  title: string;
  driverName: string;
  date: string;
  hospital: string;
  details?: {
    email: string;
    clientId: string;
    clinician: string;
    status: string;
    notes?: string;
  };
}

export const adminReportsData: ReportItemData[] = [
  {
    id: "rep-1",
    title: "HGV/Bus Medical Certificates",
    driverName: "SarahGomez",
    date: "28 May 2025",
    hospital: "Guy's Hospital",
    details: {
      email: "sarah.gomez@gmail.com",
      clientId: "C121212",
      clinician: "Dr. John Watson",
      status: "Approved",
      notes: "Patient meets all standard HGV and Bus driving medical requirements.",
    },
  },
  {
    id: "rep-2",
    title: "HGV/Bus Medical Certificates",
    driverName: "SarahGomez",
    date: "28 May 2025",
    hospital: "Guy's Hospital",
    details: {
      email: "sarah.gomez@gmail.com",
      clientId: "C121212",
      clinician: "Dr. John Watson",
      status: "Approved",
      notes: "Patient meets all standard HGV and Bus driving medical requirements.",
    },
  },
  {
    id: "rep-3",
    title: "HGV/Bus Medical Certificates",
    driverName: "SarahGomez",
    date: "28 May 2025",
    hospital: "Guy's Hospital",
    details: {
      email: "sarah.gomez@gmail.com",
      clientId: "C121212",
      clinician: "Dr. John Watson",
      status: "Approved",
      notes: "Patient meets all standard HGV and Bus driving medical requirements.",
    },
  },
  {
    id: "rep-4",
    title: "HGV/Bus Medical Certificates",
    driverName: "SarahGomez",
    date: "28 May 2025",
    hospital: "Guy's Hospital",
    details: {
      email: "sarah.gomez@gmail.com",
      clientId: "C121212",
      clinician: "Dr. John Watson",
      status: "Approved",
      notes: "Patient meets all standard HGV and Bus driving medical requirements.",
    },
  },
  {
    id: "rep-5",
    title: "HGV/Bus Medical Certificates",
    driverName: "SarahGomez",
    date: "28 May 2025",
    hospital: "Guy's Hospital",
    details: {
      email: "sarah.gomez@gmail.com",
      clientId: "C121212",
      clinician: "Dr. John Watson",
      status: "Approved",
      notes: "Patient meets all standard HGV and Bus driving medical requirements.",
    },
  },
  {
    id: "rep-6",
    title: "Taxi Medical Certificates",
    driverName: "JamesWilson",
    date: "29 May 2025",
    hospital: "St Thomas' Hospital",
    details: {
      email: "james.wilson@example.com",
      clientId: "C121213",
      clinician: "Dr. Emma Watson",
      status: "Approved",
      notes: "Passed visual acuity and blood pressure checks cleanly.",
    },
  },
  {
    id: "rep-7",
    title: "Forklift Medical Certificates",
    driverName: "EmilyWatson",
    date: "30 May 2025",
    hospital: "Royal London Hospital",
    details: {
      email: "emily.watson@gmail.com",
      clientId: "C121214",
      clinician: "Dr. Sarah Taylor",
      status: "Approved",
      notes: "Patient fit for forklift operator duty.",
    },
  },
  {
    id: "rep-8",
    title: "HGV/Bus Medical Certificates",
    driverName: "RobertTaylor",
    date: "02 June 2025",
    hospital: "Guy's Hospital",
    details: {
      email: "robert.t@example.com",
      clientId: "C121215",
      clinician: "Dr. John Watson",
      status: "Approved",
      notes: "Standard HGV renewal medical check completed successfully.",
    },
  },
  {
    id: "rep-9",
    title: "Taxi Medical Certificates",
    driverName: "MichaelBrown",
    date: "03 June 2025",
    hospital: "Leeds North Clinic",
    details: {
      email: "m.brown@example.com",
      clientId: "C121216",
      clinician: "Dr. David Davis",
      status: "Pending Review",
      notes: "Needs standard visual correction follow-up.",
    },
  },
  {
    id: "rep-10",
    title: "HGV/Bus Medical Certificates",
    driverName: "EmmaDavis",
    date: "04 June 2025",
    hospital: "St Thomas' Hospital",
    details: {
      email: "emma.d@example.com",
      clientId: "C121217",
      clinician: "Dr. Emma Watson",
      status: "Approved",
      notes: "Renewal completed cleanly.",
    },
  },
];

export interface CalendarAppointmentData {
  id: string;
  patientName: string;
  serviceType: string;
  day: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
  timeSlot: string; // e.g. "8:00 AM", "8:30 AM", "9:00 AM", "10:00 AM", "4:30 PM", "5:00 PM"
  color: "cyan" | "navy";
}

export const adminCalendarAppointments: CalendarAppointmentData[] = [
  // Monday
  { id: "cal-1", patientName: "John Smith", serviceType: "Taxi Medical", day: "MON", timeSlot: "8:00 AM", color: "cyan" },
  { id: "cal-2", patientName: "John Smith", serviceType: "Taxi Medical", day: "MON", timeSlot: "8:00 AM", color: "navy" },
  { id: "cal-3", patientName: "John Smith", serviceType: "Taxi Medical", day: "MON", timeSlot: "8:30 AM", color: "cyan" },
  { id: "cal-4", patientName: "John Smith", serviceType: "Taxi Medical", day: "MON", timeSlot: "8:30 AM", color: "cyan" },
  { id: "cal-5", patientName: "John Smith", serviceType: "Taxi Medical", day: "MON", timeSlot: "8:30 AM", color: "navy" },
  { id: "cal-6", patientName: "John Smith", serviceType: "Taxi Medical", day: "MON", timeSlot: "9:00 AM", color: "cyan" },
  { id: "cal-7", patientName: "John Smith", serviceType: "Taxi Medical", day: "MON", timeSlot: "4:30 PM", color: "cyan" },
  { id: "cal-8", patientName: "John Smith", serviceType: "Taxi Medical", day: "MON", timeSlot: "4:30 PM", color: "navy" },
  { id: "cal-9", patientName: "John Smith", serviceType: "Taxi Medical", day: "MON", timeSlot: "4:30 PM", color: "cyan" },

  // Tuesday
  { id: "cal-10", patientName: "John Smith", serviceType: "Taxi Medical", day: "TUE", timeSlot: "8:00 AM", color: "cyan" },
  { id: "cal-11", patientName: "John Smith", serviceType: "Taxi Medical", day: "TUE", timeSlot: "8:30 AM", color: "navy" },
  { id: "cal-12", patientName: "John Smith", serviceType: "Taxi Medical", day: "TUE", timeSlot: "9:00 AM", color: "cyan" },
  { id: "cal-13", patientName: "John Smith", serviceType: "Taxi Medical", day: "TUE", timeSlot: "9:00 AM", color: "navy" },
  { id: "cal-14", patientName: "John Smith", serviceType: "Taxi Medical", day: "TUE", timeSlot: "10:00 AM", color: "navy" },

  // Wednesday
  { id: "cal-15", patientName: "John Smith", serviceType: "Taxi Medical", day: "WED", timeSlot: "8:00 AM", color: "cyan" },
  { id: "cal-16", patientName: "John Smith", serviceType: "Taxi Medical", day: "WED", timeSlot: "8:30 AM", color: "cyan" },
  { id: "cal-17", patientName: "John Smith", serviceType: "Taxi Medical", day: "WED", timeSlot: "8:30 AM", color: "navy" },
  { id: "cal-18", patientName: "John Smith", serviceType: "Taxi Medical", day: "WED", timeSlot: "10:00 AM", color: "cyan" },
  { id: "cal-19", patientName: "John Smith", serviceType: "Taxi Medical", day: "WED", timeSlot: "10:00 AM", color: "navy" },
  { id: "cal-20", patientName: "John Smith", serviceType: "Taxi Medical", day: "WED", timeSlot: "10:00 AM", color: "cyan" },
  { id: "cal-21", patientName: "John Smith", serviceType: "Taxi Medical", day: "WED", timeSlot: "10:00 AM", color: "navy" },
  { id: "cal-22", patientName: "John Smith", serviceType: "Taxi Medical", day: "WED", timeSlot: "5:00 PM", color: "navy" },

  // Thursday
  { id: "cal-23", patientName: "John Smith", serviceType: "Taxi Medical", day: "THU", timeSlot: "8:30 AM", color: "cyan" },
  { id: "cal-24", patientName: "John Smith", serviceType: "Taxi Medical", day: "THU", timeSlot: "8:30 AM", color: "cyan" },

  // Friday
  { id: "cal-25", patientName: "John Smith", serviceType: "Taxi Medical", day: "FRI", timeSlot: "8:00 AM", color: "cyan" },
  { id: "cal-26", patientName: "John Smith", serviceType: "Taxi Medical", day: "FRI", timeSlot: "8:00 AM", color: "navy" },
  { id: "cal-27", patientName: "John Smith", serviceType: "Taxi Medical", day: "FRI", timeSlot: "8:00 AM", color: "cyan" },
  { id: "cal-28", patientName: "John Smith", serviceType: "Taxi Medical", day: "FRI", timeSlot: "8:00 AM", color: "navy" },
  { id: "cal-29", patientName: "John Smith", serviceType: "Taxi Medical", day: "FRI", timeSlot: "10:00 AM", color: "cyan" },
  { id: "cal-30", patientName: "John Smith", serviceType: "Taxi Medical", day: "FRI", timeSlot: "4:30 PM", color: "navy" },
  { id: "cal-31", patientName: "John Smith", serviceType: "Taxi Medical", day: "FRI", timeSlot: "5:00 PM", color: "cyan" },
  { id: "cal-32", patientName: "John Smith", serviceType: "Taxi Medical", day: "FRI", timeSlot: "5:00 PM", color: "navy" },

  // Saturday
  { id: "cal-33", patientName: "John Smith", serviceType: "Taxi Medical", day: "SAT", timeSlot: "8:30 AM", color: "cyan" },
  { id: "cal-34", patientName: "John Smith", serviceType: "Taxi Medical", day: "SAT", timeSlot: "10:00 AM", color: "navy" },

  // Sunday
  { id: "cal-35", patientName: "John Smith", serviceType: "Taxi Medical", day: "SUN", timeSlot: "9:00 AM", color: "cyan" },
  { id: "cal-36", patientName: "John Smith", serviceType: "Taxi Medical", day: "SUN", timeSlot: "4:30 PM", color: "navy" },
];

export interface ClinicianItemData {
  id: string;
  clinicianName: string;
  email: string;
  locations: string;
  speciality: string;
  status: "Active" | "Inactive";
  phone?: string;
  gmcNumber?: string;
}

export const adminCliniciansData: ClinicianItemData[] = [
  {
    id: "clin-1",
    clinicianName: "St Thomas' Hospital",
    email: "exaple@gmail.com",
    locations: "Manchester",
    speciality: "Taxi Medicals",
    status: "Active",
  },
  {
    id: "clin-2",
    clinicianName: "Guy's Hospital",
    email: "exaple@gmail.com",
    locations: "Manchester",
    speciality: "Taxi Medicals",
    status: "Inactive",
  },
  {
    id: "clin-3",
    clinicianName: "Royal Free Hospital",
    email: "exaple@gmail.com",
    locations: "Manchester",
    speciality: "Taxi Medicals",
    status: "Active",
  },
  {
    id: "clin-4",
    clinicianName: "Royal Hospital",
    email: "exaple@gmail.com",
    locations: "Manchester",
    speciality: "Taxi Medicals",
    status: "Inactive",
  },
  {
    id: "clin-5",
    clinicianName: "Leeds Infirmary",
    email: "exaple@gmail.com",
    locations: "Manchester",
    speciality: "Taxi Medicals",
    status: "Active",
  },
  {
    id: "clin-6",
    clinicianName: "Raj Patel Hospital",
    email: "exaple@gmail.com",
    locations: "Manchester",
    speciality: "Taxi Medicals",
    status: "Active",
  },
  {
    id: "clin-7",
    clinicianName: "Loyal Medicals",
    email: "exaple@gmail.com",
    locations: "Manchester",
    speciality: "Taxi Medicals",
    status: "Inactive",
  },
  {
    id: "clin-8",
    clinicianName: "Victoria Infirmary",
    email: "exaple@gmail.com",
    locations: "Manchester",
    speciality: "Taxi Medicals",
    status: "Inactive",
  },
  {
    id: "clin-9",
    clinicianName: "Laz Farma medicals",
    email: "exaple@gmail.com",
    locations: "Manchester",
    speciality: "Taxi Medicals",
    status: "Active",
  },
  {
    id: "clin-10",
    clinicianName: "Manchester Royal Infirmary",
    email: "mri.clinician@gmail.com",
    locations: "Manchester",
    speciality: "Taxi Medicals",
    status: "Active",
  },
  {
    id: "clin-11",
    clinicianName: "Birmingham General",
    email: "bham.staff@example.com",
    locations: "Birmingham",
    speciality: "HGV Medicals",
    status: "Inactive",
  },
  {
    id: "clin-12",
    clinicianName: "Leeds General Infirmary",
    email: "leeds.general@gmail.com",
    locations: "Leeds",
    speciality: "Taxi Medicals",
    status: "Active",
  },
  {
    id: "clin-13",
    clinicianName: "Glasgow Southern General",
    email: "glasgow.gen@example.com",
    locations: "Glasgow",
    speciality: "HGV Medicals",
    status: "Active",
  },
];

export interface CorporateRequestItem {
  id: string;
  companyName: string;
  companyEmail: string;
  driverCount: number;
  services: string;
  status: "Pending" | "Approved" | "Rejected";
}

export const adminCorporateRequests: CorporateRequestItem[] = [
  { id: "corp-1", companyName: "Apex Logistics Ltd", companyEmail: "exaple@gmail.com", driverCount: 20, services: "HGV Medicals", status: "Pending" },
  { id: "corp-2", companyName: "Swift Transports Co", companyEmail: "exaple@gmail.com", driverCount: 20, services: "HGV Medicals", status: "Pending" },
  { id: "corp-3", companyName: "Global Haulage Partners", companyEmail: "exaple@gmail.com", driverCount: 20, services: "HGV Medicals", status: "Pending" },
  { id: "corp-4", companyName: "City Couriers UK", companyEmail: "exaple@gmail.com", driverCount: 20, services: "HGV Medicals", status: "Pending" },
  { id: "corp-5", companyName: "Metro Bus Systems", companyEmail: "exaple@gmail.com", driverCount: 20, services: "HGV Medicals", status: "Pending" },
  { id: "corp-6", companyName: "Euro Freight Logistics", companyEmail: "exaple@gmail.com", driverCount: 20, services: "HGV Medicals", status: "Pending" },
  { id: "corp-7", companyName: "Pioneer Medical Transport", companyEmail: "exaple@gmail.com", driverCount: 20, services: "HGV Medicals", status: "Pending" },
  { id: "corp-8", companyName: "Elite Courier Services", companyEmail: "exaple@gmail.com", driverCount: 20, services: "HGV Medicals", status: "Pending" },
];

export interface ServiceItemData {
  id: string;
  serviceName: string;
  description: string;
  image: StaticImageData | string;
}

export const adminServicesData: ServiceItemData[] = [
  {
    id: "serv-1",
    serviceName: "HGV/Bus Medicals",
    description: "For HGV & LGV drivers",
    image: hgvImg,
  },
  {
    id: "serv-2",
    serviceName: "Taxi & PCO Medical",
    description: "For Taxi & PCO Medical",
    image: taxiImg,
  },
  {
    id: "serv-3",
    serviceName: "Ambulance Medical",
    description: "For Ambulance Medical",
    image: ambulanceImg,
  },
  {
    id: "serv-4",
    serviceName: "Forklift/Crane Medical",
    description: "For Forklift/Crane Medical",
    image: forkliftImg,
  },
  {
    id: "serv-5",
    serviceName: "Motorsport Medical",
    description: "For Motorsport Medical",
    image: motorsportImg,
  },
  {
    id: "serv-6",
    serviceName: "Pre-Employment Medicals",
    description: "For Pre-Employment Medicals.",
    image: preEmploymentImg,
  },
];

export interface FaqItemData {
  id: string;
  question: string;
  answer: string;
}

export const adminFaqsData: FaqItemData[] = [
  {
    id: "faq-1",
    question: "Who is eligible to apply for an HGV license?",
    answer: "You must have a complete driver's license (Category B) in order to apply for an HGV license. You can operate heavier vehicles (more than 3.5 tons) in the C, C+E, C1, and C1+E categories with an HGV license. You will need further instruction that enhances your current driving abilities.",
  },
  {
    id: "faq-2",
    question: "When will a medical examination be necessary?",
    answer: "A medical examination is required when you first apply for your provisional HGV/LGV license, and then every 5 years from age 45, or annually from age 65.",
  },
  {
    id: "faq-3",
    question: "How can I schedule a medical appointment for a driver?",
    answer: "You can book directly through the calendar scheduler on this dashboard by clicking the '+ Add Booking' button, or by selecting a driver from the database.",
  },
  {
    id: "faq-4",
    question: "What happens if I have to postpone my appointment?",
    answer: "Appointments can be postponed or cancelled up to 24 hours before the scheduled time slot without any penalty.",
  },
  {
    id: "faq-5",
    question: "How do I obtain a receipt?",
    answer: "All receipts and invoices are automatically generated and emailed to your registered address immediately after payment confirmation.",
  },
  {
    id: "faq-6",
    question: "What should I pack for my appointment?",
    answer: "Please bring your driving license, any medical forms (like the D4), your glasses/lens prescription if you wear them, and a list of any current medications.",
  },
  {
    id: "faq-7",
    question: "What's going to occur at the medical?",
    answer: "The doctor will perform an eye test, check your blood pressure, ask about your medical history, and complete the official D4 form questionnaire.",
  },
  {
    id: "faq-8",
    question: "What if I am worried about my vision?",
    answer: "We check your visual acuity with and without glasses. As long as you meet the minimum DVLA standards, you will pass the vision check.",
  },
  {
    id: "faq-9",
    question: "What should I do when my eye test is due?",
    answer: "Ensure you visit an optician to get an updated prescription before coming for your medical exam if you feel your eyesight has deteriorated.",
  },
  {
    id: "faq-10",
    question: "What happens if my blood pressure worries me?",
    answer: "We recommend resting and avoiding caffeine before the exam. If your blood pressure is high, the doctor may suggest seeing your GP.",
  },
  {
    id: "faq-11",
    question: "Before sending my D4 form to the DVLA, how long may I retain it?",
    answer: "The completed D4 medical form is valid for up to 4 months from the date of the doctor's signature before it must be submitted to the DVLA.",
  },
  {
    id: "faq-12",
    question: "Will I know if I made it through?",
    answer: "Yes, the examining clinician will discuss the results of your medical check with you immediately upon completing the examination.",
  },
];
