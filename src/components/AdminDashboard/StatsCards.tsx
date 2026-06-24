"use client";

import React from "react";
import { Card } from "antd";
import { Users, ClipboardList, MapPin } from "lucide-react";
import { adminStatsData } from "@/app/data/AdminDashboardData";

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {adminStatsData.map((stat, idx) => {
        let iconColor = "";
        let bgColor = "";
        let IconNode = Users;

        if (stat.iconType === "bookings") {
          iconColor = "text-[#00B2D6]";
          bgColor = "bg-[#E6FAFF]";
          IconNode = Users;
        } else if (stat.iconType === "pending") {
          iconColor = "text-amber-500";
          bgColor = "bg-amber-50";
          IconNode = ClipboardList;
        } else if (stat.iconType === "locations") {
          iconColor = "text-orange-500";
          bgColor = "bg-orange-50";
          IconNode = MapPin;
        }

        return (
          <Card
            key={idx}
            variant="borderless"
            className="shadow-[0_4px_20px_rgba(0,0,0,0.015)] border border-slate-100 rounded-3xl"
            styles={{ body: { padding: "24px" } }}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-500 font-sans">
                  {stat.title}
                </p>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight font-poppins">
                  {stat.value.toLocaleString()}
                </h2>
              </div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bgColor} ${iconColor}`}>
                <IconNode size={24} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
