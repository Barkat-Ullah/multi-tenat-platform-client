"use client";

import AdminLayout from "@/components/shared/layout/Layout";
import Link from "next/link";
import { ReactNode } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  MapPin,
  Stethoscope,
  Calendar,
  CalendarPlus,
  Building,
  Heart,
  HelpCircle,
  Users,
  Mail,
  CreditCard,
  ShieldCheck,
  FileText,
  Settings,
  LifeBuoy,
  MessageSquare
} from "lucide-react";

const navItems = [
  {
    key: "/dashboard/super-admin",
    label: <Link href="/dashboard/super-admin">Dashboard</Link>,
    icon: <LayoutDashboard size={18} />,
    className: "hover:bg-gray-100",
  },
  {
    key: "/dashboard/super-admin/all-booking",
    label: <Link href="/dashboard/super-admin/all-booking">All Booking</Link>,
    icon: <CalendarDays size={18} />,
    className: "hover:bg-gray-100",
  },
  {
    key: "/dashboard/super-admin/location",
    label: <Link href="/dashboard/super-admin/location">Location</Link>,
    icon: <MapPin size={18} />,
    className: "hover:bg-gray-100",
  },
  {
    key: "/dashboard/super-admin/clinicians",
    label: <Link href="/dashboard/super-admin/clinicians">Clinicians</Link>,
    icon: <Stethoscope size={18} />,
    className: "hover:bg-gray-100",
  },
  {
    key: "/dashboard/super-admin/calendar",
    label: <Link href="/dashboard/super-admin/calendar">Calendar</Link>,
    icon: <Calendar size={18} />,
    className: "hover:bg-gray-100",
  },
  {
    key: "/dashboard/super-admin/schedule-slots",
    label: <Link href="/dashboard/super-admin/schedule-slots">Schedule Slots</Link>,
    icon: <CalendarPlus size={18} />,
    className: "hover:bg-gray-100",
  },
  {
    key: "/dashboard/super-admin/corporate",
    label: <Link href="/dashboard/super-admin/corporate">Corporate</Link>,
    icon: <Building size={18} />,
    className: "hover:bg-gray-100",
  },
  {
    key: "/dashboard/super-admin/services",
    label: <Link href="/dashboard/super-admin/services">Services</Link>,
    icon: <Heart size={18} />,
    className: "hover:bg-gray-100",
  },
  {
    key: "/dashboard/super-admin/add-faq",
    label: <Link href="/dashboard/super-admin/add-faq">Add FAQ</Link>,
    icon: <HelpCircle size={18} />,
    className: "hover:bg-gray-100",
  },
  {
    key: "/dashboard/super-admin/support-center",
    label: <Link href="/dashboard/super-admin/support-center">Support Center</Link>,
    icon: <LifeBuoy size={18} />,
    className: "hover:bg-gray-100",
  },
  {
    key: "/dashboard/super-admin/messages",
    label: <Link href="/dashboard/super-admin/messages">Messages</Link>,
    icon: <MessageSquare size={18} />,
    className: "hover:bg-gray-100",
  },
  {
    key: "/dashboard/super-admin/manage-user",
    label: <Link href="/dashboard/super-admin/manage-user">Manage User</Link>,
    icon: <Users size={18} />,
    className: "hover:bg-gray-100",
  },
  {
    key: "/dashboard/super-admin/send-email",
    label: <Link href="/dashboard/super-admin/send-email">Send Email</Link>,
    icon: <Mail size={18} />,
    className: "hover:bg-gray-100",
  },
  {
    key: "/dashboard/super-admin/payment-settings",
    label: <Link href="/dashboard/super-admin/payment-settings">Payment Settings</Link>,
    icon: <CreditCard size={18} />,
    className: "hover:bg-gray-100",
  },
  {
    key: "/dashboard/super-admin/privacy-policy",
    label: <Link href="/dashboard/super-admin/privacy-policy">Privacy Policy</Link>,
    icon: <ShieldCheck size={18} />,
    className: "hover:bg-gray-100",
  },
  {
    key: "/dashboard/super-admin/terms-of-service",
    label: <Link href="/dashboard/super-admin/terms-of-service">Terms of Service</Link>,
    icon: <FileText size={18} />,
    className: "hover:bg-gray-100",
  },
  {
    key: "/dashboard/super-admin/settings",
    label: <Link href="/dashboard/super-admin/settings">Settings</Link>,
    icon: <Settings size={18} />,
    className: "hover:bg-gray-100",
  },
];

const SuperAdminDashboardLayout = ({ children }: { children: ReactNode }) => {
  return <AdminLayout menu={navItems}>{children}</AdminLayout>;
};

export default SuperAdminDashboardLayout;
