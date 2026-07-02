"use client";

import React from "react";
import { Card } from "antd";
import {
  CalendarDays,
  ClipboardList,
  MapPin,
  PoundSterling,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import type { AdminAnalyticsOverview } from "@/redux/service/admin/dashboardApi";

interface StatsCardsProps {
  overview?: AdminAnalyticsOverview;
  isLoading: boolean;
}

interface StatCardConfig {
  title: string;
  value: number;
  icon: LucideIcon;
  iconClassName: string;
  iconBackground: string;
  format?: "currency";
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 2,
  }).format(value);

export default function StatsCards({ overview, isLoading }: StatsCardsProps) {
  const stats: StatCardConfig[] = [
    {
      title: "Bookings",
      value: overview?.bookings ?? 0,
      icon: CalendarDays,
      iconClassName: "text-[#00B2D6]",
      iconBackground: "bg-[#E6FAFF]",
    },
    {
      title: "Pending Bookings",
      value: overview?.pendingBookings ?? 0,
      icon: ClipboardList,
      iconClassName: "text-amber-500",
      iconBackground: "bg-amber-50",
    },
    {
      title: "Revenue",
      value: overview?.revenue ?? 0,
      icon: PoundSterling,
      iconClassName: "text-emerald-600",
      iconBackground: "bg-emerald-50",
      format: "currency",
    },
    {
      title: "Active Locations",
      value: overview?.activeLocations ?? 0,
      icon: MapPin,
      iconClassName: "text-orange-500",
      iconBackground: "bg-orange-50",
    },
    {
      title: "Total Services",
      value: overview?.totalServices ?? 0,
      icon: Stethoscope,
      iconClassName: "text-indigo-500",
      iconBackground: "bg-indigo-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.title}
            variant="borderless"
            className="rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.015)]"
            styles={{ body: { padding: "22px" } }}
          >
            <div className="flex min-h-[74px] items-center justify-between gap-3">
              <div className="min-w-0 space-y-2">
                <p className="truncate text-xs font-semibold text-gray-500">
                  {stat.title}
                </p>
                {isLoading ? (
                  <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-200" />
                ) : (
                  <h2 className="font-poppins text-2xl font-bold tracking-tight text-gray-900">
                    {stat.format === "currency"
                      ? formatCurrency(stat.value)
                      : stat.value.toLocaleString("en-GB")}
                  </h2>
                )}
              </div>
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${stat.iconBackground} ${stat.iconClassName}`}
              >
                <Icon size={22} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
