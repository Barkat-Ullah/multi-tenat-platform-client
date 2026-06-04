"use client";

import AdminLayout from "@/components/shared/layout/Layout";
import Link from "next/link";
import { ReactNode } from "react";
import { LayoutDashboard, Settings } from "lucide-react";

const navItems = [
  {
    key: "/dashboard/clinic",
    label: <Link href="/dashboard/clinic">Clinic Dashboard</Link>,
    icon: <LayoutDashboard size={18} />,
    className: "hover:bg-gray-100 text-white hover:bg-[#0F4C75]",
  },
  {
    key: "/dashboard/clinic/settings",
    label: <Link href="/dashboard/clinic/settings">Settings</Link>,
    icon: <Settings size={18} />,
    className: "hover:bg-gray-100",
  },
];

const ClinicLayout = ({ children }: { children: ReactNode }) => {
  return <AdminLayout menu={navItems}>{children}</AdminLayout>;
};

export default ClinicLayout;
