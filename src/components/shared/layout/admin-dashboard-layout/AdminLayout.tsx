"use client";

import AdminLayout from "@/components/shared/layout/Layout";
import Link from "next/link";
import { ReactNode } from "react";
import {
  LayoutDashboard,
  Home,
  Users,
  Settings,
  LandPlot,
} from "lucide-react";

const navItems = [
  {
    key: "/dashboard/admin",
    label: <Link href="/dashboard/admin">Dashboards</Link>,
    icon: <LayoutDashboard size={18} />,
    className: "hover:bg-gray-100 text-white hover:bg-[#0F4C75]",
  },
  {
    key: "/dashboard/admin/all-properties",
    label: <Link href="/dashboard/admin/all-properties">All Properties</Link>,
    icon: <Home size={18} />,
    className: "hover:bg-gray-100",
  },
  {
    key: "/dashboard/admin/all-properties/add-properties",
    label: <Link href="/dashboard/admin/all-properties/add-properties">Add Properties</Link>,
    icon: <LandPlot size={18} />,
    className: "hover:bg-gray-100",
  },

  {
    key: "/dashboard/admin/all-users",
    label: <Link href="/dashboard/admin/all-users">All Users</Link>,
    icon: <Users size={18} />,
    className: "hover:bg-gray-100",
  },
  {
    key: "/dashboard/admin/settings",
    label: <Link href="/dashboard/admin/settings">Setting</Link>,
    icon: <Settings size={18} />,
    className: "hover:bg-gray-100",
  },

];

const SuperAdminLayout = ({ children }: { children: ReactNode }) => {
  return <AdminLayout menu={navItems}>{children}</AdminLayout>;
};

export default SuperAdminLayout;
