"use client";

import AdminLayout from "@/components/shared/layout/Layout";
import Link from "next/link";
import { ReactNode } from "react";
import {
  LayoutDashboard,
  CalendarCheck,
  MapPin,
  FileText,
  Calendar,
  Stethoscope,
  Building2,
  HeartPulse,
  HelpCircle,
  LifeBuoy,
  ShieldCheck,
  Settings,
} from "lucide-react";

const navItems = [
  {
    key: "/dashboard/admin",
    label: <Link href="/dashboard/admin">Dashboard</Link>,
    icon: <LayoutDashboard size={18} />,
  },
  {
    key: "/dashboard/admin/all-booking",
    label: <Link href="/dashboard/admin/all-booking">All Booking</Link>,
    icon: <CalendarCheck size={18} />,
  },
  {
    key: "/dashboard/admin/location",
    label: <Link href="/dashboard/admin/location">Location</Link>,
    icon: <MapPin size={18} />,
  },
  {
    key: "/dashboard/admin/reports",
    label: <Link href="/dashboard/admin/reports">Reports</Link>,
    icon: <FileText size={18} />,
  },
  {
    key: "/dashboard/admin/calender",
    label: <Link href="/dashboard/admin/calender">Calender</Link>,
    icon: <Calendar size={18} />,
  },
  {
    key: "/dashboard/admin/clinicians",
    label: <Link href="/dashboard/admin/clinicians">Clinicians</Link>,
    icon: <Stethoscope size={18} />,
  },
  {
    key: "/dashboard/admin/corporate",
    label: <Link href="/dashboard/admin/corporate">Corporate</Link>,
    icon: <Building2 size={18} />,
  },
  {
    key: "/dashboard/admin/services",
    label: <Link href="/dashboard/admin/services">Services</Link>,
    icon: <HeartPulse size={18} />,
  },
  {
    key: "/dashboard/admin/add-faq",
    label: <Link href="/dashboard/admin/add-faq">Add FAQ</Link>,
    icon: <HelpCircle size={18} />,
  },
  {
    key: "/dashboard/admin/support-center",
    label: <Link href="/dashboard/admin/support-center">Support Center</Link>,
    icon: <LifeBuoy size={18} />,
  },
  {
    key: "/dashboard/admin/privacy-policy",
    label: <Link href="/dashboard/admin/privacy-policy">Privacy Policy</Link>,
    icon: <ShieldCheck size={18} />,
  },
  {
    key: "/dashboard/admin/terms-of-service",
    label: <Link href="/dashboard/admin/terms-of-service">Terms of Service</Link>,
    icon: <FileText size={18} />,
  },
  {
    key: "/dashboard/admin/settings",
    label: <Link href="/dashboard/admin/settings">Settings</Link>,
    icon: <Settings size={18} />,
  },
];

const SuperAdminLayout = ({ children }: { children: ReactNode }) => {
  return <AdminLayout menu={navItems}>{children}</AdminLayout>;
};

export default SuperAdminLayout;
