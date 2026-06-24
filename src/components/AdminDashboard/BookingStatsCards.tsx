"use client";

import React from "react";
import { Card } from "antd";
import { Users, CheckCircle2, AlertCircle, XCircle } from "lucide-react";

// Central stats data for bookings page
export const bookingStatsData = [
  {
    title: "Today's Bookings",
    value: 240,
    icon: Users,
    iconColor: "text-[#00B2D6]",
    bgColor: "bg-[#E6FAFF]",
  },
  {
    title: "Confirmed",
    value: 189,
    icon: CheckCircle2,
    iconColor: "text-[#10B981]",
    bgColor: "bg-[#ECFDF5]",
  },
  {
    title: "Pending",
    value: 13,
    icon: AlertCircle,
    iconColor: "text-[#F59E0B]",
    bgColor: "bg-[#FFFBEB]",
  },
  {
    title: "Cancelled",
    value: 65,
    icon: XCircle,
    iconColor: "text-[#EF4444]",
    bgColor: "bg-[#FEF2F2]",
  },
];

export default function BookingStatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {bookingStatsData.map((stat, idx) => {
        const IconNode = stat.icon;
        return (
          <Card
            key={idx}
            variant="borderless"
            className="shadow-[0_4px_20px_rgba(0,0,0,0.015)] border border-slate-100 rounded-3xl"
            styles={{ body: { padding: "24px" } }}
          >
            <div className="flex flex-col gap-5">
              {/* Header: Icon + Label */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bgColor} ${stat.iconColor}`}>
                  <IconNode size={20} className="stroke-[2.25]" />
                </div>
                <span className="text-sm font-bold text-gray-800 font-sans">
                  {stat.title}
                </span>
              </div>
              
              {/* Value */}
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight font-poppins">
                {stat.value}
              </h2>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
