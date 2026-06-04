"use client";

import AdminLayout from "@/components/shared/layout/Layout";
import Link from "next/link";
import { ReactNode } from "react";
import { LayoutDashboard, Settings } from "lucide-react";

const navItems = [
  {
    key: "/dashboard/orginizer",
    label: <Link href="/dashboard/orginizer">Organizer Dashboard</Link>,
    icon: <LayoutDashboard size={18} />,
    className: "hover:bg-gray-100 text-white hover:bg-[#0F4C75]",
  },
  {
    key: "/dashboard/orginizer/settings",
    label: <Link href="/dashboard/orginizer/settings">Settings</Link>,
    icon: <Settings size={18} />,
    className: "hover:bg-gray-100",
  },
];

const OrginizerLayout = ({ children }: { children: ReactNode }) => {
  return <AdminLayout menu={navItems}>{children}</AdminLayout>;
};

export default OrginizerLayout;
