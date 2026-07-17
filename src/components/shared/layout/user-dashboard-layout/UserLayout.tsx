"use client";

import AdminLayout from "@/components/shared/layout/Layout";
import Link from "next/link";
import { ReactNode } from "react";
import {
  LayoutGrid,
  Calendar,
  FileText,
  LifeBuoy,
  Settings,
} from "lucide-react";

const navItems = [
  {
    key: "/dashboard/user",
    label: <Link href="/dashboard/user">Dashboard</Link>,
    icon: <LayoutGrid size={18} />,
  },
  {
    key: "/dashboard/user/bookings",
    label: <Link href="/dashboard/user/bookings">Bookings</Link>,
    icon: <Calendar size={18} />,
  },
  {
    key: "/dashboard/user/reports",
    label: <Link href="/dashboard/user/reports">Reports</Link>,
    icon: <FileText size={18} />,
  },
  {
    key: "/dashboard/user/support-center",
    label: <Link href="/dashboard/user/support-center">Support Center</Link>,
    icon: <LifeBuoy size={18} />,
  },
  {
    key: "/dashboard/user/setting",
    label: <Link href="/dashboard/user/setting">Settings</Link>,
    icon: <Settings size={18} />,
  },
];

const UserLayout = ({ children }: { children: ReactNode }) => {
  return <AdminLayout menu={navItems}>{children}</AdminLayout>;
};

export default UserLayout;
