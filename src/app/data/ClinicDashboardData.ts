// Clinic Dashboard Mock Data and Interfaces

export interface ClinicStats {
  appointmentsThisMonth: number;
  todaysAppointments: number;
  completed: number;
  pending: number;
}

export interface ClinicAppointment {
  id: string;
  clientName: string;
  clientEmail: string;
  serviceType: string;
  appointmentTime: string;
  location: string;
  status: "Upcoming" | "Completed" | "Pending";
}

export const clinicStatsData: ClinicStats = {
  appointmentsThisMonth: 250,
  todaysAppointments: 34,
  completed: 3,
  pending: 20,
};

export const clinicAppointmentsData: ClinicAppointment[] = [
  { id: "1", clientName: "Sarah Gomez", clientEmail: "emap@gmail.com", serviceType: "Taxi Medicals", appointmentTime: "Today, 9:00 AM", location: "Manchester", status: "Upcoming" },
  { id: "2", clientName: "Sarah Gomez", clientEmail: "emap@gmail.com", serviceType: "Taxi Medicals", appointmentTime: "Today, 10:00 AM", location: "Manchester", status: "Upcoming" },
  { id: "3", clientName: "Sarah Gomez", clientEmail: "emap@gmail.com", serviceType: "Taxi Medicals", appointmentTime: "Today, 11:00 AM", location: "Manchester", status: "Upcoming" },
  { id: "4", clientName: "Sarah Gomez", clientEmail: "emap@gmail.com", serviceType: "Taxi Medicals", appointmentTime: "Today, 12:00 PM", location: "Manchester", status: "Upcoming" },
  { id: "5", clientName: "Sarah Gomez", clientEmail: "emap@gmail.com", serviceType: "Taxi Medicals", appointmentTime: "Today, 01:00 PM", location: "Manchester", status: "Upcoming" },
  { id: "6", clientName: "Sarah Gomez", clientEmail: "emap@gmail.com", serviceType: "Taxi Medicals", appointmentTime: "Today, 03:00 PM", location: "Manchester", status: "Upcoming" },
];
