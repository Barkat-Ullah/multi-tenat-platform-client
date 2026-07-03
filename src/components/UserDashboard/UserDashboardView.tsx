"use client";

import React from "react";
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
import Spinner from "@/components/ui/Spinner";
import {
  DriverAnalyticsAppointment,
  useGetDriverAnalyticsQuery,
} from "@/redux/service/user/userDashboardApi";

const formatAppointmentDate = (scheduledAt: string) => {
  const date = new Date(scheduledAt);
  if (Number.isNaN(date.getTime())) return "Not scheduled";

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const formatAppointmentTime = (scheduledAt: string) => {
  const date = new Date(scheduledAt);
  if (Number.isNaN(date.getTime())) return "Not scheduled";

  return new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const formatStatus = (status: string) =>
  status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const getAppointmentType = (status: string) => {
  if (status === "COMPLETED") return "Completed Appointment";
  if (status === "CANCELLED") return "Cancelled Appointment";
  return "Upcoming Appointment";
};

export default function UserDashboardView() {
  const { data, isLoading, isError, refetch } = useGetDriverAnalyticsQuery();
  const overview = data?.data?.overview;
  const appointments = data?.data?.appointments || [];

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

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
            {overview?.totalAppointment ?? 0}
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
            {overview?.todayAppointment ?? 0}
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
            {overview?.completed ?? 0}
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
            {overview?.pending ?? 0}
          </span>
        </div>
      </div>

      {/* Appointments List Section */}
      <div className="space-y-5">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          My Appointments
        </h2>

        {isError ? (
          <div className="rounded-[24px] border border-red-100 bg-red-50 p-6 text-center">
            <p className="text-sm font-semibold text-red-600">
              Failed to load appointments.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 rounded-full bg-[#00B2D6] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[#0092B0]"
            >
              Try Again
            </button>
          </div>
        ) : appointments.length === 0 ? (
          <div className="rounded-[24px] border border-slate-100 bg-white p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
            <p className="text-sm font-semibold text-slate-500">
              You do not have any appointments yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {appointments.map((apt: DriverAnalyticsAppointment) => (
            <div
              key={apt.id}
              className="bg-white rounded-[24px] border border-slate-100/90 p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4"
            >
              <div className="space-y-1">
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {getAppointmentType(apt.status)}
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-[#0F2E4A] font-poppins">
                  {apt.serviceTitle}
                </h3>
              </div>

              {/* Detail Items */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-slate-500">
                  <Calendar className="h-4.5 w-4.5 text-[#00B2D6] shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold">
                    {formatAppointmentDate(apt.scheduledAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500">
                  <Clock className="h-4.5 w-4.5 text-[#00B2D6] shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold">
                    {formatAppointmentTime(apt.scheduledAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500">
                  <MapPin className="h-4.5 w-4.5 text-[#00B2D6] shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold">{apt.location}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500">
                  <Stethoscope className="h-4.5 w-4.5 text-[#00B2D6] shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold">{apt.clinicName}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="pt-2">
                <span className="inline-flex items-center px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-extrabold bg-[#FEF9E7] text-[#D9A700] border border-[#F9E79F]/30 uppercase tracking-wider">
                  {formatStatus(apt.status)}
                </span>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
