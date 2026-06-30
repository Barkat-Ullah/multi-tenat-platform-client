// Organizer Dashboard Mock Data and Interfaces

export interface OrganizerStats {
  totalDrivers: number;
  upcomingBookings: number;
  expiringTime: number;
}

export interface BookingChartPoint {
  name: string;
  bookings: number;
}

export interface OrganizerDriver {
  id: string;
  name: string;
  email: string;
  service: string;
  lastMedical: string;
  expiryDate: string;
  status: "Completed" | "Pending";
}

export interface OrganizerBooking {
  id: string;
  srvName: string;
  numDrivers: number;
  clinicianName: string;
  lastMedical: string;
  expiryDate: string;
  status: "Confirm" | "Pending" | "Canceled";
  assignedDriverName?: string;
}

export interface OrganizerReport {
  id: string;
  title: string;
  driverName: string;
  dateGenerated: string;
  hospitalName: string;
}

export const organizerStatsData: OrganizerStats = {
  totalDrivers: 48,
  upcomingBookings: 12,
  expiringTime: 12,
};

export const bookingsChartData: BookingChartPoint[] = [
  { name: "Jan", bookings: 110 },
  { name: "Feb", bookings: 310 },
  { name: "Mar", bookings: 230 },
  { name: "Apr", bookings: 410 },
  { name: "May", bookings: 80 },
  { name: "Jun", bookings: 340 },
  { name: "Jul", bookings: 320 },
  { name: "Aug", bookings: 200 },
  { name: "Sep", bookings: 370 },
  { name: "Oct", bookings: 190 },
  { name: "Nov", bookings: 270 },
  { name: "Dec", bookings: 150 },
];

export const organizerDriversData: OrganizerDriver[] = [
  { id: "1", name: "Sarah Gomez", email: "exaple@gmail.com", service: "Taxi Medicals", lastMedical: "02 Jun 2025", expiryDate: "02 Jun 2026", status: "Completed" },
  { id: "2", name: "Sarah Gomez", email: "exaple@gmail.com", service: "Taxi Medicals", lastMedical: "02 Jun 2025", expiryDate: "02 Jun 2026", status: "Completed" },
  { id: "3", name: "Sarah Gomez", email: "exaple@gmail.com", service: "Taxi Medicals", lastMedical: "02 Jun 2025", expiryDate: "02 Jun 2026", status: "Pending" },
  { id: "4", name: "Sarah Gomez", email: "exaple@gmail.com", service: "Taxi Medicals", lastMedical: "02 Jun 2025", expiryDate: "02 Jun 2026", status: "Completed" },
  { id: "5", name: "Sarah Gomez", email: "exaple@gmail.com", service: "Taxi Medicals", lastMedical: "02 Jun 2025", expiryDate: "02 Jun 2026", status: "Pending" },
  { id: "6", name: "Sarah Gomez", email: "exaple@gmail.com", service: "Taxi Medicals", lastMedical: "02 Jun 2025", expiryDate: "02 Jun 2026", status: "Completed" },
  { id: "7", name: "Sarah Gomez", email: "exaple@gmail.com", service: "Taxi Medicals", lastMedical: "02 Jun 2025", expiryDate: "02 Jun 2026", status: "Completed" },
  { id: "8", name: "Sarah Gomez", email: "exaple@gmail.com", service: "Taxi Medicals", lastMedical: "02 Jun 2025", expiryDate: "02 Jun 2026", status: "Completed" },
  { id: "9", name: "Sarah Gomez", email: "exaple@gmail.com", service: "Taxi Medicals", lastMedical: "02 Jun 2025", expiryDate: "02 Jun 2026", status: "Pending" },
];

export const organizerBookingsData: OrganizerBooking[] = [
  { id: "b1", srvName: "Taxi Medicals", numDrivers: 30, clinicianName: "St Thomas' Hospital", lastMedical: "02 Jun 2025", expiryDate: "02 Jun 2026", status: "Confirm" },
  { id: "b2", srvName: "Taxi Medicals", numDrivers: 30, clinicianName: "Guy's Hospital", lastMedical: "02 Jun 2025", expiryDate: "02 Jun 2026", status: "Pending" },
  { id: "b3", srvName: "Taxi Medicals", numDrivers: 30, clinicianName: "Royal Free Hospital", lastMedical: "02 Jun 2025", expiryDate: "02 Jun 2026", status: "Canceled" },
  { id: "b4", srvName: "Taxi Medicals", numDrivers: 30, clinicianName: "St Thomas' Hospital", lastMedical: "02 Jun 2025", expiryDate: "02 Jun 2026", status: "Confirm" },
  { id: "b5", srvName: "Taxi Medicals", numDrivers: 30, clinicianName: "St Thomas' Hospital", lastMedical: "02 Jun 2025", expiryDate: "02 Jun 2026", status: "Confirm" },
  { id: "b6", srvName: "Taxi Medicals", numDrivers: 30, clinicianName: "St Thomas' Hospital", lastMedical: "02 Jun 2025", expiryDate: "02 Jun 2026", status: "Confirm" },
];

export const organizerReportsData: OrganizerReport[] = [
  { id: "rep1", title: "HGV/Bus Medical Certificates", driverName: "SarahGomez", dateGenerated: "28 May 2025", hospitalName: "Guy's Hospital" },
  { id: "rep2", title: "HGV/Bus Medical Certificates", driverName: "SarahGomez", dateGenerated: "28 May 2025", hospitalName: "Guy's Hospital" },
  { id: "rep3", title: "HGV/Bus Medical Certificates", driverName: "SarahGomez", dateGenerated: "28 May 2025", hospitalName: "Guy's Hospital" },
  { id: "rep4", title: "HGV/Bus Medical Certificates", driverName: "SarahGomez", dateGenerated: "28 May 2025", hospitalName: "Guy's Hospital" },
  { id: "rep5", title: "HGV/Bus Medical Certificates", driverName: "SarahGomez", dateGenerated: "28 May 2025", hospitalName: "Guy's Hospital" },
];
