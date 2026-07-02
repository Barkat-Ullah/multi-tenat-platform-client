"use client";

import React from "react";
import { Card } from "antd";
import { AlertCircle, CheckCircle2, ClipboardList, XCircle } from "lucide-react";
import type { AdminBookingListResponse } from "@/redux/service/admin/bookingsApi";

interface BookingStatsCardsProps {
  meta?: AdminBookingListResponse["meta"];
  isLoading: boolean;
}

export default function BookingStatsCards({
  meta,
  isLoading,
}: BookingStatsCardsProps) {
  const stats = [
    {
      title: "Total Bookings",
      value: meta?.total ?? 0,
      icon: ClipboardList,
      iconColor: "text-[#00B2D6]",
      bgColor: "bg-[#E6FAFF]",
    },
    {
      title: "Confirmed",
      value: meta?.confirmed ?? 0,
      icon: CheckCircle2,
      iconColor: "text-[#10B981]",
      bgColor: "bg-[#ECFDF5]",
    },
    {
      title: "Pending",
      value: meta?.pending ?? 0,
      icon: AlertCircle,
      iconColor: "text-[#F59E0B]",
      bgColor: "bg-[#FFFBEB]",
    },
    {
      title: "Cancelled",
      value: meta?.cancelled ?? 0,
      icon: XCircle,
      iconColor: "text-[#EF4444]",
      bgColor: "bg-[#FEF2F2]",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            variant="borderless"
            className="rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.015)]"
            styles={{ body: { padding: "24px" } }}
          >
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bgColor} ${stat.iconColor}`}>
                  <Icon size={20} />
                </div>
                <span className="text-sm font-bold text-gray-800">{stat.title}</span>
              </div>
              {isLoading ? (
                <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-200" />
              ) : (
                <h2 className="font-poppins text-3xl font-extrabold tracking-tight text-gray-900">
                  {stat.value.toLocaleString("en-GB")}
                </h2>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
