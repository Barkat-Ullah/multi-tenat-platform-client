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


