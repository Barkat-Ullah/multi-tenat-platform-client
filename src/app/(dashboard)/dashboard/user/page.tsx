"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  Users,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
} from "lucide-react";

interface AppointmentItem {
  id: string;
  type: string;
  title: string;
  date: string;
  time: string;
  location: string;
  doctor: string;
  status: "Pending" | "Completed" | "Cancelled";
}

export default function UserDashboardPage() {
  const [appointments] = useState<AppointmentItem[]>([
    {
      id: "apt-1",
      type: "Upcoming Appointment",
      title: "HGV D4 Medical",
      date: "Monday, 2 June 2025",
      time: "9:00 Am",
      location: "Manchester",
      doctor: "Dr. Raj Patel",
      status: "Pending",
    },
    {
      id: "apt-2",
      type: "Upcoming Appointment",
      title: "HGV D4 Medical",
      date: "Monday, 2 June 2025",
      time: "9:00 Am",
      location: "Manchester",
      doctor: "Dr. Raj Patel",
      status: "Pending",
    },
  ]);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 w-full">
      {/* Dashboard Heading */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
        Dashboard
      </h1>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Appointment */}
        <div className="bg-white rounded-[24px] border border-slate-100/90 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col justify-between h-[130px] transition-all hover:scale-[1.01]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#EAF8FC] flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-[#00B2D6]" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-[#0F2E4A] font-poppins leading-tight">
              Total Appointment
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins pl-1">
            10
          </span>
        </div>

        {/* Today Appointment */}
        <div className="bg-white rounded-[24px] border border-slate-100/90 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col justify-between h-[130px] transition-all hover:scale-[1.01]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#F2EFFF] flex items-center justify-center shrink-0">
              <CalendarDays className="h-5 w-5 text-[#7B62FF]" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-[#0F2E4A] font-poppins leading-tight">
              Today Appointment
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins pl-1">
            1
          </span>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-[24px] border border-slate-100/90 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col justify-between h-[130px] transition-all hover:scale-[1.01]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-[#0F2E4A] font-poppins leading-tight">
              Completed
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins pl-1">
            3
          </span>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-[24px] border border-slate-100/90 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col justify-between h-[130px] transition-all hover:scale-[1.01]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center shrink-0">
              <AlertCircle className="h-5 w-5 text-[#F59E0B]" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-[#0F2E4A] font-poppins leading-tight">
              Pending
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins pl-1">
            2
          </span>
        </div>
      </div>

      {/* Appointments List Section */}
      <div className="space-y-5">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          My Appointments
        </h2>

        <div className="space-y-6">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-[24px] border border-slate-100/90 p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4"
            >
              <div className="space-y-1">
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {apt.type}
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-[#0F2E4A] font-poppins">
                  {apt.title}
                </h3>
              </div>

              {/* Detail Items */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-slate-500">
                  <Calendar className="h-4.5 w-4.5 text-[#00B2D6] shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold">{apt.date}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500">
                  <Clock className="h-4.5 w-4.5 text-[#00B2D6] shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold">{apt.time}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500">
                  <MapPin className="h-4.5 w-4.5 text-[#00B2D6] shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold">{apt.location}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500">
                  <Stethoscope className="h-4.5 w-4.5 text-[#00B2D6] shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold">{apt.doctor}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="pt-2">
                <span className="inline-flex items-center px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-extrabold bg-[#FEF9E7] text-[#D9A700] border border-[#F9E79F]/30 uppercase tracking-wider">
                  {apt.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
