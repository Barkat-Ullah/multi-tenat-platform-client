// User Dashboard Mock Data and Interfaces

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

// Reports list matching the mockup
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
