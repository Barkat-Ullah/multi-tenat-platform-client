"use client";

import AdminLayout from "@/components/shared/layout/Layout";
import Link from "next/link";
import { ReactNode } from "react";
import {
  LayoutDashboard,
  Home,
  Settings,
} from "lucide-react";

const navItems = [
  {
    key: "/dashboard/user",
    label: <Link href="/dashboard/user">Dashboards</Link>,
    icon: <LayoutDashboard size={18} />,
    className: "hover:bg-gray-100 text-white hover:bg-[#0F4C75]",
  },
  {
    key: "/dashboard/user/property-list",
    label: <Link href="/dashboard/user/property-list">Property list</Link>,
    icon: <Home size={18} />,
    className: "hover:bg-gray-100",
  },
  {
    key: "/dashboard/user/setting",
    label: <Link href="/dashboard/user/setting">Setting</Link>,
    icon: <Settings size={18} />,
    className: "hover:bg-gray-100",
  },
];

const UserLayout = ({ children }: { children: ReactNode }) => {
  return <AdminLayout menu={navItems}>{children}</AdminLayout>;
};

export default UserLayout;
