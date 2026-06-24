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
