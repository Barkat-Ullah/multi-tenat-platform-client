// Super Admin Dashboard Mock Data and Interfaces

export interface SuperAdminStats {
  todaysBookings: number;
  pendingBookings: number;
  todaysRevenue: string;
  activeLocations: number;
}

export interface BookingTrendData {
  month: string;
  booking: number;
  revenue: number;
}

export interface RecentBooking {
  id: string;
  name: string;
  initial: string;
  service: string;
  time: string;
  status: "Completed" | "Pending";
}

export interface TopServiceItem {
  name: string;
  value: number;
  color: string;
}

export interface RecentReport {
  id: string;
  title: string;
  date: string;
}

export const superAdminStatsData: SuperAdminStats = {
  todaysBookings: 850,
  pendingBookings: 365,
  todaysRevenue: "$365",
  activeLocations: 25,
};

export const bookingRevenueTrendsData: BookingTrendData[] = [
  { month: "Jan", booking: 190, revenue: 270 },
  { month: "Feb", booking: 215, revenue: 310 },
  { month: "Mar", booking: 280, revenue: 380 },
  { month: "Apr", booking: 390, revenue: 450 },
  { month: "May", booking: 210, revenue: 290 },
  { month: "Jun", booking: 260, revenue: 350 },
  { month: "Jul", booking: 200, revenue: 280 },
  { month: "Aug", booking: 270, revenue: 370 },
  { month: "Sep", booking: 220, revenue: 315 },
  { month: "Oct", booking: 260, revenue: 355 },
  { month: "Nov", booking: 220, revenue: 310 },
  { month: "Dec", booking: 250, revenue: 360 },
];

export const superAdminRecentBookings: RecentBooking[] = [
  { id: "sb-1", name: "James Wilson", initial: "J", service: "HGV Medical", time: "09:00 AM", status: "Completed" },
  { id: "sb-2", name: "James Wilson", initial: "J", service: "HGV Medical", time: "09:00 AM", status: "Completed" },
  { id: "sb-3", name: "James Wilson", initial: "J", service: "HGV Medical", time: "09:00 AM", status: "Completed" },
  { id: "sb-4", name: "James Wilson", initial: "J", service: "HGV Medical", time: "09:00 AM", status: "Completed" },
  { id: "sb-5", name: "James Wilson", initial: "J", service: "HGV Medical", time: "09:00 AM", status: "Completed" },
];

export const topServicesPieData: TopServiceItem[] = [
  { name: "HGV Medical", value: 420, color: "#00B2D6" }, // Cyan
  { name: "HGV Medical", value: 420, color: "#6366F1" }, // Purple
  { name: "HGV Medical", value: 420, color: "#F59E0B" }, // Orange
];

export const superAdminRecentReports: RecentReport[] = [
  { id: "sr-1", title: "Monthly Booking Report", date: "May 01, 2025" },
  { id: "sr-2", title: "Monthly Booking Report", date: "May 01, 2025" },
  { id: "sr-3", title: "Monthly Booking Report", date: "May 01, 2025" },
  { id: "sr-4", title: "Monthly Booking Report", date: "May 01, 2025" },
  { id: "sr-5", title: "Monthly Booking Report", date: "May 01, 2025" },
];
