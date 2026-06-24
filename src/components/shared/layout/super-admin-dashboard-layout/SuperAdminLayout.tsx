"use client";

import AdminLayout from "@/components/shared/layout/Layout";
import Link from "next/link";
import { ReactNode } from "react";
import {
  LayoutDashboard,
  Settings,
  Users
} from "lucide-react";

const navItems = [
  {
    key: "/dashboard/super-admin",
    label: <Link href="/dashboard/super-admin">Dashboards</Link>,
    icon: <LayoutDashboard size={18} />,
    className: "hover:bg-gray-100",
  },
  {
    key: "/dashboard/super-admin/settings",
    label: <Link href="/dashboard/super-admin/settings">Setting</Link>,
    icon: <Settings size={18} />,
    className: "hover:bg-gray-100",
  },
];

const SuperAdminDashboardLayout = ({ children }: { children: ReactNode }) => {
  return <AdminLayout menu={navItems}>{children}</AdminLayout>;
};

export default SuperAdminDashboardLayout;
