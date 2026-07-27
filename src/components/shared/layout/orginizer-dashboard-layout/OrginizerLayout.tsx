"use client";

import AdminLayout from "@/components/shared/layout/Layout";
import Link from "next/link";
import { ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardPlus,
  FileText,
  LifeBuoy,
  MessageSquare,
  Settings,
} from "lucide-react";

const navItems = [
  {
    key: "/dashboard/orginizer",
    label: <Link href="/dashboard/orginizer">Dashboard</Link>,
    icon: <LayoutDashboard size={18} />,
  },
  {
    key: "/dashboard/orginizer/drivers",
    label: <Link href="/dashboard/orginizer/drivers">My Drivers</Link>,
    icon: <Users size={18} />,
  },
  {
    key: "/dashboard/orginizer/bookings",
    label: <Link href="/dashboard/orginizer/bookings">All Bookings</Link>,
    icon: <Calendar size={18} />,
  },
  {
    key: "/dashboard/orginizer/services-request",
    label: <Link href="/dashboard/orginizer/services-request">Services Request</Link>,
    icon: <ClipboardPlus size={18} />,
  },
  {
    key: "/dashboard/orginizer/reports",
    label: <Link href="/dashboard/orginizer/reports">Reports</Link>,
    icon: <FileText size={18} />,
  },
  {
    key: "/dashboard/orginizer/support-center",
    label: <Link href="/dashboard/orginizer/support-center">Support Center</Link>,
    icon: <LifeBuoy size={18} />,
  },
  {
    key: "/dashboard/orginizer/messages",
    label: <Link href="/dashboard/orginizer/messages">Messages</Link>,
    icon: <MessageSquare size={18} />,
  },
  {
    key: "/dashboard/orginizer/settings",
    label: <Link href="/dashboard/orginizer/settings">Settings</Link>,
    icon: <Settings size={18} />,
  },
];

const OrginizerLayout = ({ children }: { children: ReactNode }) => {
  return <AdminLayout menu={navItems}>{children}</AdminLayout>;
};

export default OrginizerLayout;
