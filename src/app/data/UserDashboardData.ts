// User Dashboard Mock Data and Interfaces

export interface UserAppointmentItem {
  id: string;
  type: string;
  title: string;
  date: string;
  time: string;
  location: string;
  doctor: string;
  status: "Pending" | "Completed" | "Cancelled";
}

export interface UserBooking {
  id: string;
  clinicianName: string;
  email: string;
  serviceType: string;
  appointmentTime: string;
  location: string;
  status: "Completed" | "Cancel" | "Pending" | "Canceled";
}

export interface UserReport {
  id: string;
  title: string;
  driverName: string;
  email: string;
  clientId: string;
  hospital: string;
  clinician: string;
  date: string;
  status: "Approved" | "Pending";
  notes?: string;
}

// 1. Dashboard summary appointments list
export const userAppointmentsData: UserAppointmentItem[] = [
  {
    id: "apt-1",
    type: "Upcoming Appointment",
    title: "HGV D4 Medical",
    date: "Monday, 2 June 2025",
    time: "9:00 Am",
    location: "Manchester",
    doctor: "Dr. Raj Patel",
    status: "Pending",
  },
  {
    id: "apt-2",
    type: "Upcoming Appointment",
    title: "HGV D4 Medical",
    date: "Monday, 2 June 2025",
    time: "9:00 Am",
    location: "Manchester",
    doctor: "Dr. Raj Patel",
    status: "Pending",
  },
];

// 2. Bookings data list matching the mockup
export const userBookingsData: UserBooking[] = [
  {
    id: "1",
    clinicianName: "St Thomas' Hospital",
    email: "emap@gmail.com",
    serviceType: "Taxi Medicals",
    appointmentTime: "Today, 9:00 AM",
    location: "Manchester",
    status: "Completed",
  },
  {
    id: "2",
    clinicianName: "Guy's Hospital",
    email: "emap@gmail.com",
    serviceType: "Taxi Medicals",
    appointmentTime: "Today, 9:00 AM",
    location: "Manchester",
    status: "Cancel",
  },
  {
    id: "3",
    clinicianName: "Royal Free Hospital",
    email: "emap@gmail.com",
    serviceType: "Taxi Medicals",
    appointmentTime: "Today, 9:00 AM",
    location: "Manchester",
    status: "Pending",
  },
  {
    id: "4",
    clinicianName: "Royal Hospital",
    email: "emap@gmail.com",
    serviceType: "Taxi Medicals",
    appointmentTime: "Today, 9:00 AM",
    location: "Manchester",
    status: "Completed",
  },
  {
    id: "5",
    clinicianName: "Leeds Infirmary",
    email: "emap@gmail.com",
    serviceType: "Taxi Medicals",
    appointmentTime: "Today, 9:00 AM",
    location: "Manchester",
    status: "Pending",
  },
  {
    id: "6",
    clinicianName: "Raj Patel Hospital",
    email: "emap@gmail.com",
    serviceType: "Taxi Medicals",
    appointmentTime: "Today, 9:00 AM",
    location: "Manchester",
    status: "Completed",
  },
  {
    id: "7",
    clinicianName: "Loyal Medicals",
    email: "emap@gmail.com",
    serviceType: "Taxi Medicals",
    appointmentTime: "Today, 9:00 AM",
    location: "Manchester",
    status: "Pending",
  },
  {
    id: "8",
    clinicianName: "Victoria Infirmary",
    email: "emap@gmail.com",
    serviceType: "Taxi Medicals",
    appointmentTime: "Today, 9:00 AM",
    location: "Manchester",
    status: "Canceled",
  },
  {
    id: "9",
    clinicianName: "Laz Farma medicals",
    email: "emap@gmail.com",
    serviceType: "Taxi Medicals",
    appointmentTime: "Today, 9:00 AM",
    location: "Manchester",
    status: "Completed",
  },
  {
    id: "10",
    clinicianName: "St Mary's Clinic",
    email: "stmarys@gmail.com",
    serviceType: "HGV D4 Medicals",
    appointmentTime: "Tomorrow, 10:00 AM",
    location: "London East",
    status: "Pending",
  },
  {
    id: "11",
    clinicianName: "Bristol Royal Infirmary",
    email: "bristol@gmail.com",
    serviceType: "Taxi Medicals",
    appointmentTime: "Tomorrow, 2:30 PM",
    location: "Bristol",
    status: "Completed",
  },
  {
    id: "12",
    clinicianName: "City Medicals Leeds",
    email: "leedsmeds@gmail.com",
    serviceType: "HGV D4 Medicals",
    appointmentTime: "Wednesday, 11:00 AM",
    location: "Leeds",
    status: "Cancel",
  },
  {
    id: "13",
    clinicianName: "Liverpool Women's Hospital",
    email: "liverpool@gmail.com",
    serviceType: "Taxi Medicals",
    appointmentTime: "Thursday, 4:00 PM",
    location: "Liverpool",
    status: "Pending",
  },
  {
    id: "14",
    clinicianName: "Sheffield General Hospital",
    email: "sheffield@gmail.com",
    serviceType: "Taxi Medicals",
    appointmentTime: "Friday, 1:00 PM",
    location: "Sheffield",
    status: "Completed",
  },
];

// 3. Reports list matching the mockup
export const userReportsData: UserReport[] = [
  {
    id: "CM-1041",
    title: "HGV D4 Medical Certificates",
    driverName: "SarahGomez",
    email: "sarahgomez@example.com",
    clientId: "CLI-9921",
    hospital: "St Thomas' Hospital",
    clinician: "Dr. Raj Patel",
    date: "28 May 2025",
    status: "Approved",
    notes: "All visual and physical medical requirements have been successfully checked and certified.",
  },
  {
    id: "CM-1042",
    title: "HGV D4 Medical Certificates",
    driverName: "SarahGomez",
    email: "sarahgomez@example.com",
    clientId: "CLI-9921",
    hospital: "Guy's Hospital",
    clinician: "Dr. Sarah Jenkins",
    date: "28 May 2025",
    status: "Approved",
    notes: "Certificate verified and signed.",
  },
  {
    id: "CM-1043",
    title: "HGV D4 Medical Certificates",
    driverName: "SarahGomez",
    email: "sarahgomez@example.com",
    clientId: "CLI-9921",
    hospital: "Royal Free Hospital",
    clinician: "Dr. Raj Patel",
    date: "28 May 2025",
    status: "Approved",
    notes: "Driver check passed.",
  },
  {
    id: "CM-1044",
    title: "HGV D4 Medical Certificates",
    driverName: "SarahGomez",
    email: "sarahgomez@example.com",
    clientId: "CLI-9921",
    hospital: "Royal Hospital",
    clinician: "Dr. Jenkins",
    date: "28 May 2025",
    status: "Approved",
  },
  {
    id: "CM-1045",
    title: "HGV D4 Medical Certificates",
    driverName: "SarahGomez",
    email: "sarahgomez@example.com",
    clientId: "CLI-9921",
    hospital: "Leeds Infirmary",
    clinician: "Dr. Raj Patel",
    date: "28 May 2025",
    status: "Approved",
  },
];
