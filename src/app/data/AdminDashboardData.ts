import { StaticImageData } from "next/image";
import hgvImg from "@/assets/home/hgv-medical-bus.png";
import taxiImg from "@/assets/home/taxies.png";
import ambulanceImg from "@/assets/home/ambulance-hero-intro.png";
import forkliftImg from "@/assets/home/forklift.png";
import motorsportImg from "@/assets/home/motorsportMedicals.png";
import preEmploymentImg from "@/assets/home/pre-employment.png";

export interface AdminStatCard {
  title: string;
  value: number;
  iconType: "bookings" | "pending" | "locations";
}

export interface BookingTrendItem {
  name: string;
  bookings: number;
}

export interface RecentBookingItem {
  id: string;
  name: string;
  service: string;
  time: string;
  status: "Completed" | "Pending" | "Cancelled";
  avatarText: string;
}

export interface TopServiceItem {
  name: string;
  value: number;
  color: string;
}

export interface RecentReportItem {
  id: string;
  title: string;
  date: string;
}

export const adminStatsData: AdminStatCard[] = [
  {
    title: "Today's Bookings",
    value: 850,
    iconType: "bookings",
  },
  {
    title: "Pending Bookings",
    value: 365,
    iconType: "pending",
  },
  {
    title: "Active Locations",
    value: 25,
    iconType: "locations",
  },
];

export const bookingTrendsData: BookingTrendItem[] = [
  { name: "Jan", bookings: 230 },
  { name: "Feb", bookings: 250 },
  { name: "Mar", bookings: 320 },
  { name: "Apr", bookings: 380 },
  { name: "May", bookings: 260 },
  { name: "Jun", bookings: 230 },
  { name: "Jul", bookings: 270 },
  { name: "Aug", bookings: 250 },
  { name: "Sep", bookings: 220 },
  { name: "Oct", bookings: 280 },
  { name: "Nov", bookings: 250 },
  { name: "Dec", bookings: 270 },
];

export const recentBookingsData: RecentBookingItem[] = [
  {
    id: "1",
    name: "James Wilson",
    service: "HGV Medical",
    time: "09:00 AM",
    status: "Completed",
    avatarText: "J",
  },
  {
    id: "2",
    name: "James Wilson",
    service: "HGV Medical",
    time: "09:00 AM",
    status: "Completed",
    avatarText: "J",
  },
  {
    id: "3",
    name: "James Wilson",
    service: "HGV Medical",
    time: "09:00 AM",
    status: "Completed",
    avatarText: "J",
  },
  {
    id: "4",
    name: "James Wilson",
    service: "HGV Medical",
    time: "09:00 AM",
    status: "Completed",
    avatarText: "J",
  },
  {
    id: "5",
    name: "James Wilson",
    service: "HGV Medical",
    time: "09:00 AM",
    status: "Completed",
    avatarText: "J",
  },
];

export const topServicesData: TopServiceItem[] = [
  { name: "HGV Medical", value: 420, color: "#00B2D6" },
  { name: "HGV/Bus Medical", value: 250, color: "#F59E0B" },
  { name: "Taxi Medical", value: 180, color: "#6366F1" },
];

export const recentReportsData: RecentReportItem[] = [
  { id: "1", title: "Monthly Booking Report", date: "May 01, 2025" },
  { id: "2", title: "Monthly Booking Report", date: "May 01, 2025" },
  { id: "3", title: "Monthly Booking Report", date: "May 01, 2025" },
  { id: "4", title: "Monthly Booking Report", date: "May 01, 2025" },
  { id: "5", title: "Monthly Booking Report", date: "May 01, 2025" },
];

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

export interface AllBookingItemData {
  id: string;
  name: string;
  email: string;
  service: string;
  council: string;
  clinician: string;
  dateTime: string;
  clientId: string;
  location: string;
  fullDateTime: string;
}

export const allBookingsData: AllBookingItemData[] = [
  // Page 1
  { id: "1", name: "Sarah Gomez", email: "exaple@gmail.com", service: "Taxi Medicals", council: "Leeds City Council", clinician: "St Thomas' Hospital", dateTime: "02/06 9:00 AM", clientId: "C121212", location: "Manchester Clinic, 12 Oxford", fullDateTime: "Monday, 2 June 2025" },
  { id: "2", name: "Sarah Gomez", email: "exaple@gmail.com", service: "Taxi Medicals", council: "Leeds City Council", clinician: "St Thomas' Hospital", dateTime: "02/06 9:00 AM", clientId: "C121212", location: "Manchester Clinic, 12 Oxford", fullDateTime: "Monday, 2 June 2025" },
  { id: "3", name: "Sarah Gomez", email: "exaple@gmail.com", service: "Taxi Medicals", council: "Leeds City Council", clinician: "St Thomas' Hospital", dateTime: "02/06 9:00 AM", clientId: "C121212", location: "Manchester Clinic, 12 Oxford", fullDateTime: "Monday, 2 June 2025" },
  { id: "4", name: "Sarah Gomez", email: "exaple@gmail.com", service: "Taxi Medicals", council: "Leeds City Council", clinician: "St Thomas' Hospital", dateTime: "02/06 9:00 AM", clientId: "C121212", location: "Manchester Clinic, 12 Oxford", fullDateTime: "Monday, 2 June 2025" },
  { id: "5", name: "Sarah Gomez", email: "exaple@gmail.com", service: "Taxi Medicals", council: "Leeds City Council", clinician: "St Thomas' Hospital", dateTime: "02/06 9:00 AM", clientId: "C121212", location: "Manchester Clinic, 12 Oxford", fullDateTime: "Monday, 2 June 2025" },
  { id: "6", name: "Sarah Gomez", email: "exaple@gmail.com", service: "Taxi Medicals", council: "Leeds City Council", clinician: "St Thomas' Hospital", dateTime: "02/06 9:00 AM", clientId: "C121212", location: "Manchester Clinic, 12 Oxford", fullDateTime: "Monday, 2 June 2025" },
  { id: "7", name: "Sarah Gomez", email: "exaple@gmail.com", service: "Taxi Medicals", council: "Leeds City Council", clinician: "St Thomas' Hospital", dateTime: "02/06 9:00 AM", clientId: "C121212", location: "Manchester Clinic, 12 Oxford", fullDateTime: "Monday, 2 June 2025" },

  // Page 2
  { id: "8", name: "James Wilson", email: "james.w@gmail.com", service: "HGV Medical", council: "London City Council", clinician: "Guy's Hospital", dateTime: "03/06 10:00 AM", clientId: "C121213", location: "London Central Clinic, 45 Regent St", fullDateTime: "Tuesday, 3 June 2025" },
  { id: "9", name: "Emily Watson", email: "emily.watson@gmail.com", service: "Forklift Medicals", council: "Manchester Council", clinician: "Royal London Hospital", dateTime: "03/06 11:30 AM", clientId: "C121214", location: "Manchester Clinic, 12 Oxford", fullDateTime: "Tuesday, 3 June 2025" },
  { id: "10", name: "Robert Taylor", email: "robert.t@gmail.com", service: "Taxi Medicals", council: "Leeds City Council", clinician: "St Thomas' Hospital", dateTime: "04/06 09:00 AM", clientId: "C121215", location: "Leeds North Clinic, 88 Park Ln", fullDateTime: "Wednesday, 4 June 2025" },
  { id: "11", name: "Michael Brown", email: "m.brown@gmail.com", service: "HGV Medical", council: "London City Council", clinician: "Guy's Hospital", dateTime: "04/06 01:30 PM", clientId: "C121216", location: "London Central Clinic, 45 Regent St", fullDateTime: "Wednesday, 4 June 2025" },
  { id: "12", name: "Emma Davis", email: "emma.d@gmail.com", service: "Taxi Medicals", council: "Leeds City Council", clinician: "St Thomas' Hospital", dateTime: "05/06 10:00 AM", clientId: "C121217", location: "Leeds North Clinic, 88 Park Ln", fullDateTime: "Thursday, 5 June 2025" },
  { id: "13", name: "David Jones", email: "david.j@gmail.com", service: "Motorsport Medicals", council: "Leeds City Council", clinician: "St George's Hospital", dateTime: "05/06 02:00 PM", clientId: "C121218", location: "Manchester Clinic, 12 Oxford", fullDateTime: "Thursday, 5 June 2025" },
  { id: "14", name: "Sophia Miller", email: "sophia.m@gmail.com", service: "Taxi Medicals", council: "Leeds City Council", clinician: "St Thomas' Hospital", dateTime: "06/06 09:00 AM", clientId: "C121219", location: "Leeds North Clinic, 88 Park Ln", fullDateTime: "Friday, 6 June 2025" },

  // Page 3
  { id: "15", name: "Oliver Wilson", email: "oliver.w@gmail.com", service: "HGV Medical", council: "London City Council", clinician: "Guy's Hospital", dateTime: "08/06 09:00 AM", clientId: "C121220", location: "London Central Clinic, 45 Regent St", fullDateTime: "Monday, 8 June 2025" },
  { id: "16", name: "Amelia Thomas", email: "amelia.t@gmail.com", service: "Taxi Medicals", council: "Leeds City Council", clinician: "St Thomas' Hospital", dateTime: "08/06 11:00 AM", clientId: "C121221", location: "Leeds North Clinic, 88 Park Ln", fullDateTime: "Monday, 8 June 2025" },
  { id: "17", name: "Lucas Johnson", email: "lucas.j@gmail.com", service: "Forklift Medicals", council: "Manchester Council", clinician: "Royal London Hospital", dateTime: "09/06 09:30 AM", clientId: "C121222", location: "Manchester Clinic, 12 Oxford", fullDateTime: "Tuesday, 9 June 2025" },
  { id: "18", name: "Mia Roberts", email: "mia.r@gmail.com", service: "Taxi Medicals", council: "Leeds City Council", clinician: "St Thomas' Hospital", dateTime: "09/06 02:00 PM", clientId: "C121223", location: "Leeds North Clinic, 88 Park Ln", fullDateTime: "Tuesday, 9 June 2025" },
  { id: "19", name: "William Carter", email: "william.c@gmail.com", service: "HGV Medical", council: "London City Council", clinician: "Guy's Hospital", dateTime: "10/06 10:00 AM", clientId: "C121224", location: "London Central Clinic, 45 Regent St", fullDateTime: "Wednesday, 10 June 2025" },
  { id: "20", name: "Ava Mitchell", email: "ava.m@gmail.com", service: "Taxi Medicals", council: "Leeds City Council", clinician: "St Thomas' Hospital", dateTime: "10/06 04:00 PM", clientId: "C121225", location: "Leeds North Clinic, 88 Park Ln", fullDateTime: "Wednesday, 10 June 2025" },
  { id: "21", name: "Ethan Harris", email: "ethan.h@gmail.com", service: "Motorsport Medicals", council: "Leeds City Council", clinician: "St George's Hospital", dateTime: "11/06 09:00 AM", clientId: "C121226", location: "Manchester Clinic, 12 Oxford", fullDateTime: "Thursday, 11 June 2025" },
];

export interface LocationItemData {
  id: string;
  city: string;
  address: string;
  bookingsCount: number;
  cliniciansCount: number;
}

export const adminLocationsData: LocationItemData[] = [
  {
    id: "loc-1",
    city: "London",
    address: "St Thomas' Hospital, Lambeth Palace Rd, London SE1 7EH, UK",
    bookingsCount: 45,
    cliniciansCount: 8,
  },
  {
    id: "loc-2",
    city: "Manchester",
    address: "Manchester Clinic, 12 Oxford Rd, Manchester M1 5AN, UK",
    bookingsCount: 28,
    cliniciansCount: 4,
  },
  {
    id: "loc-3",
    city: "Birmingham",
    address: "Birmingham City Centre, 24 Broad St, Birmingham B1 2DY, UK",
    bookingsCount: 32,
    cliniciansCount: 6,
  },
  {
    id: "loc-4",
    city: "Leeds",
    address: "Leeds North Clinic, 88 Park Ln, Leeds LS1 3HE, UK",
    bookingsCount: 19,
    cliniciansCount: 3,
  },
  {
    id: "loc-5",
    city: "Glasgow",
    address: "Glasgow Clinic, 77 Bothwell St, Glasgow G2 6TS, UK",
    bookingsCount: 22,
    cliniciansCount: 4,
  },
  {
    id: "loc-6",
    city: "Edinburgh",
    address: "Edinburgh Clinic, 45 Queensferry Rd, Edinburgh EH4 3JH, UK",
    bookingsCount: 14,
    cliniciansCount: 2,
  },
  {
    id: "loc-7",
    city: "Bristol",
    address: "Bristol Clifton Clinic, 18 Queens Rd, Bristol BS8 1QE, UK",
    bookingsCount: 16,
    cliniciansCount: 3,
  },
  {
    id: "loc-8",
    city: "Newcastle",
    address: "Newcastle Jesmond Clinic, 34 Osborne Rd, Newcastle NE2 2AL, UK",
    bookingsCount: 11,
    cliniciansCount: 2,
  },
  {
    id: "loc-9",
    city: "Cardiff",
    address: "Cardiff Clinic, 10 Cathedral Rd, Cardiff CF11 9LJ, UK",
    bookingsCount: 9,
    cliniciansCount: 2,
  },
  {
    id: "loc-10",
    city: "Liverpool",
    address: "Liverpool Medical Centre, 55 Bold St, Liverpool L1 4EU, UK",
    bookingsCount: 25,
    cliniciansCount: 5,
  },
  {
    id: "loc-11",
    city: "Sheffield",
    address: "Sheffield Health Hub, 120 Ecclesall Rd, Sheffield S11 8NX, UK",
    bookingsCount: 18,
    cliniciansCount: 3,
  },
  {
    id: "loc-12",
    city: "Nottingham",
    address: "Nottingham Wellness, 9 Victoria St, Nottingham NG1 2EX, UK",
    bookingsCount: 21,
    cliniciansCount: 4,
  },
  {
    id: "loc-13",
    city: "Southampton",
    address: "Southampton Coastal Clinic, 4 High St, Southampton SO14 2DH, UK",
    bookingsCount: 13,
    cliniciansCount: 2,
  },
  {
    id: "loc-14",
    city: "Belfast",
    address: "Belfast City Clinic, 22 Donegall Sq, Belfast BT1 5GS, UK",
    bookingsCount: 15,
    cliniciansCount: 3,
  },
  {
    id: "loc-15",
    city: "Aberdeen",
    address: "Westhill, Aberdeen, Aberdeenshire AB32 6TT, UK",
    bookingsCount: 12,
    cliniciansCount: 3,
  },
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


