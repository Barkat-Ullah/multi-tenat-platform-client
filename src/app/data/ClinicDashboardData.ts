// Clinic Dashboard Mock Data and Interfaces

export interface CalendarAppointmentData {
  id: string;
  patientName: string;
  serviceType: string;
  day: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
  timeSlot: string;
  color: "cyan" | "navy";
}

export interface ClinicTimeSlot {
  id: string;
  timeRange: string;
  status: "Active" | "Booked" | "Inactive";
}

export interface ClinicMedicalForm {
  id: string;
  clientName: string;
  serviceType: string;
  appointmentDate: string;
  clinicianName: string;
  formStatus: "Pending" | "Submited";
}

export interface ClinicDocument {
  id: string;
  docTitle: string;
  patientName: string;
  generatedDate: string;
}

export const clinicCalendarAppointments: CalendarAppointmentData[] = [
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
];

export const clinicTimeSlotsData: ClinicTimeSlot[] = [
  { id: "slot-1", timeRange: "10.00 AM - 10.30 AM", status: "Active" },
  { id: "slot-2", timeRange: "10.00 AM - 10.30 AM", status: "Active" },
  { id: "slot-3", timeRange: "10.00 AM - 10.30 AM", status: "Active" },
  { id: "slot-4", timeRange: "10.00 AM - 10.30 AM", status: "Booked" },
  { id: "slot-5", timeRange: "10.30 AM - 11.00 AM", status: "Inactive" },
];

export const clinicMedicalFormsData: ClinicMedicalForm[] = [
  { id: "form-1", clientName: "Sarah Gomez", serviceType: "Taxi Medicals", appointmentDate: "Today, 9:00 AM", clinicianName: "St Thomas' Hospital", formStatus: "Pending" },
  { id: "form-2", clientName: "Sarah Gomez", serviceType: "Taxi Medicals", appointmentDate: "Today, 9:00 AM", clinicianName: "St Thomas' Hospital", formStatus: "Submited" },
  { id: "form-3", clientName: "Sarah Gomez", serviceType: "Taxi Medicals", appointmentDate: "Today, 9:00 AM", clinicianName: "St Thomas' Hospital", formStatus: "Pending" },
  { id: "form-4", clientName: "Sarah Gomez", serviceType: "Taxi Medicals", appointmentDate: "Today, 9:00 AM", clinicianName: "St Thomas' Hospital", formStatus: "Submited" },
  { id: "form-5", clientName: "Sarah Gomez", serviceType: "Taxi Medicals", appointmentDate: "Today, 9:00 AM", clinicianName: "St Thomas' Hospital", formStatus: "Submited" },
  { id: "form-6", clientName: "Sarah Gomez", serviceType: "Taxi Medicals", appointmentDate: "Today, 9:00 AM", clinicianName: "St Thomas' Hospital", formStatus: "Pending" },
  { id: "form-7", clientName: "Sarah Gomez", serviceType: "Taxi Medicals", appointmentDate: "Today, 9:00 AM", clinicianName: "St Thomas' Hospital", formStatus: "Submited" },
  { id: "form-8", clientName: "Sarah Gomez", serviceType: "Taxi Medicals", appointmentDate: "Today, 9:00 AM", clinicianName: "St Thomas' Hospital", formStatus: "Pending" },
  { id: "form-9", clientName: "Sarah Gomez", serviceType: "Taxi Medicals", appointmentDate: "Today, 9:00 AM", clinicianName: "St Thomas' Hospital", formStatus: "Submited" },
];

export const clinicDocumentsData: ClinicDocument[] = [
  { id: "doc-1", docTitle: "HGV/Bus Medical Certificates", patientName: "SarahGomez", generatedDate: "28 May 2025" },
  { id: "doc-2", docTitle: "HGV/Bus Medical Certificates", patientName: "SarahGomez", generatedDate: "28 May 2025" },
  { id: "doc-3", docTitle: "HGV/Bus Medical Certificates", patientName: "SarahGomez", generatedDate: "28 May 2025" },
  { id: "doc-4", docTitle: "HGV/Bus Medical Certificates", patientName: "SarahGomez", generatedDate: "28 May 2025" },
  { id: "doc-5", docTitle: "HGV/Bus Medical Certificates", patientName: "SarahGomez", generatedDate: "28 May 2025" },
];
