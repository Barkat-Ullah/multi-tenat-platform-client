"use client";

import React from "react";
import { Card } from "antd";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { topServicesData } from "@/app/data/AdminDashboardData";

export default function TopServices() {
  // Sum of top services for donut chart center label
  const totalServicesCount = topServicesData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card
      variant="borderless"
      className="shadow-[0_4px_20px_rgba(0,0,0,0.015)] border border-slate-100 rounded-3xl"
      styles={{ body: { padding: "24px" } }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-900 font-poppins">
          Top Services
        </h2>
        <Link
          href="/dashboard/admin/services"
          className="text-xs font-bold text-[#00B2D6] hover:underline"
        >
          View All
        </Link>
      </div>

      {/* Donut Chart Container */}
      <div className="relative h-[180px] w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={topServicesData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
            >
              {topServicesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Absolute Centered Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold text-gray-950 leading-none">
            {totalServicesCount}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Total
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2.5">
        {topServicesData.map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="font-semibold text-[#0F2E4A]">{entry.name}</span>
            </div>
            <span className="font-bold text-gray-900">{entry.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
