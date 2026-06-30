"use client";

import AdminLayout from "@/components/shared/layout/Layout";
import Link from "next/link";
import { ReactNode } from "react";
import {
  LayoutGrid,
  Calendar,
  CalendarPlus,
  Users,
  Building2,
  FileText,
  Folder,
  Settings,
} from "lucide-react";

const navItems = [
  {
    key: "/dashboard/clinic",
    label: <Link href="/dashboard/clinic">Dashboard</Link>,
    icon: <LayoutGrid size={18} />,
  },
  {
    key: "/dashboard/clinic/my-schedule",
    label: <Link href="/dashboard/clinic/my-schedule">My Schedule</Link>,
    icon: <Calendar size={18} />,
  },
  {
    key: "/dashboard/clinic/create-schedule",
    label: <Link href="/dashboard/clinic/create-schedule">Create Schedule</Link>,
    icon: <CalendarPlus size={18} />,
  },
  {
    key: "/dashboard/clinic/my-patients",
    label: <Link href="/dashboard/clinic/my-patients">My Patients</Link>,
    icon: <Users size={18} />,
  },
  {
    key: "/dashboard/clinic/corporate-list",
    label: <Link href="/dashboard/clinic/corporate-list">Corporate List</Link>,
    icon: <Building2 size={18} />,
  },
  {
    key: "/dashboard/clinic/medical-forms",
    label: <Link href="/dashboard/clinic/medical-forms">Medical Forms</Link>,
    icon: <FileText size={18} />,
  },
  {
    key: "/dashboard/clinic/documents",
    label: <Link href="/dashboard/clinic/documents">Docoments</Link>,
    icon: <Folder size={18} />,
  },
  {
    key: "/dashboard/clinic/settings",
    label: <Link href="/dashboard/clinic/settings">Settings</Link>,
    icon: <Settings size={18} />,
  },
];

const ClinicLayout = ({ children }: { children: ReactNode }) => {
  return <AdminLayout menu={navItems}>{children}</AdminLayout>;
};

export default ClinicLayout;
