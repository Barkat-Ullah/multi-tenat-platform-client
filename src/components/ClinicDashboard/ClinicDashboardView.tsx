"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Users, Calendar, CheckCircle2, Clock, X } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import {
  ClinicAnalyticsAppointment,
  useGetClinicAnalyticsQuery,
} from "@/redux/service/clinic/clinicDashboardApi";

interface ClinicAppointmentRow {
  id: string;
  clientName: string;
  clientEmail: string;
  serviceType: string;
  appointmentTime: string;
  location: string;
  status: string;
}

const formatStatus = (status?: string) => {
  if (!status) return "N/A";

  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatAppointmentTime = (scheduledAt?: string) => {
  if (!scheduledAt) return "N/A";

  const date = new Date(scheduledAt);
  if (Number.isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const mapAppointment = (
  appointment: ClinicAnalyticsAppointment,
): ClinicAppointmentRow => ({
  id: appointment.id,
  clientName:
    appointment.clientName ||
    appointment.driverName ||
    appointment.driver?.fullName ||
    "N/A",
  clientEmail:
    appointment.clientEmail ||
    appointment.driverEmail ||
    appointment.driver?.email ||
    "N/A",
  serviceType:
    appointment.serviceType ||
    appointment.serviceTitle ||
    appointment.service ||
    "N/A",
  appointmentTime:
    formatAppointmentTime(appointment.appointmentTime || appointment.scheduledAt),
  location: appointment.location || "N/A",
  status: formatStatus(appointment.status),
});

const getStatusClassName = (status: string) => {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "completed") {
    return "bg-emerald-50 text-emerald-600 border-emerald-100";
  }

  if (normalizedStatus === "pending") {
    return "bg-[#FEF9E7] text-[#D9A700] border-[#F9E79F]/30";
  }

  if (normalizedStatus === "cancelled" || normalizedStatus === "canceled") {
    return "bg-red-50 text-red-600 border-red-100";
  }

  return "bg-[#E6FAFF] text-[#00B2D6] border-[#00B2D6]/10";
};

export default function ClinicDashboardView() {
  const [viewingAppt, setViewingAppt] = useState<ClinicAppointmentRow | null>(
    null,
  );
  const [mounted, setMounted] = useState(false);
  const { data, isLoading, isError, refetch } = useGetClinicAnalyticsQuery();

  useEffect(() => {
    setMounted(true);
  }, []);

  const overview = data?.data?.overview;
  const appointments = useMemo(
    () => (data?.data?.todaysAppointments || []).map(mapAppointment),
    [data?.data?.todaysAppointments],
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col justify-between h-[150px] shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[16px] bg-[#E6FAFF] text-[#00B2D6] flex items-center justify-center shrink-0">
              <Users size={22} className="stroke-[2.5]" />
            </div>
            <div className="font-poppins">
              <span className="block text-sm sm:text-base font-bold text-[#0F2E4A] leading-tight">
                Appointments
              </span>
              <span className="block text-[10px] sm:text-xs text-slate-400 font-semibold font-sans mt-0.5">
                This Month
              </span>
            </div>
          </div>
          <span className="text-3xl sm:text-4xl font-bold text-[#0F2E4A] tracking-tight font-poppins mt-3">
            {overview?.appointmentsThisMonth ?? 0}
          </span>
        </div>

        <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col justify-between h-[150px] shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[16px] bg-[#EEF2FF] text-[#6366F1] flex items-center justify-center shrink-0">
              <Calendar size={22} className="stroke-[2.5]" />
            </div>
            <div className="font-poppins">
              <span className="block text-sm sm:text-base font-bold text-[#0F2E4A] leading-tight">
                Today&apos;s
              </span>
              <span className="block text-sm sm:text-base font-bold text-[#0F2E4A] leading-tight">
                Appointment
              </span>
            </div>
          </div>
          <span className="text-3xl sm:text-4xl font-bold text-[#0F2E4A] tracking-tight font-poppins mt-3">
            {overview?.todaysAppointment ?? 0}
          </span>
        </div>

        <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col justify-between h-[150px] shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[16px] bg-[#E8F8F5] text-[#10B981] flex items-center justify-center shrink-0">
              <CheckCircle2 size={22} className="stroke-[2.5]" />
            </div>
            <div className="font-poppins">
              <span className="block text-sm sm:text-base font-bold text-[#0F2E4A] leading-tight">
                Completed
              </span>
            </div>
          </div>
          <span className="text-3xl sm:text-4xl font-bold text-[#0F2E4A] tracking-tight font-poppins mt-3">
            {overview?.completed ?? 0}
          </span>
        </div>

        <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col justify-between h-[150px] shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[16px] bg-[#FEF9E7] text-[#D9A700] flex items-center justify-center shrink-0">
              <Clock size={22} className="stroke-[2.5]" />
            </div>
            <div className="font-poppins">
              <span className="block text-sm sm:text-base font-bold text-[#0F2E4A] leading-tight">
                Pending
              </span>
            </div>
          </div>
          <span className="text-3xl sm:text-4xl font-bold text-[#0F2E4A] tracking-tight font-poppins mt-3">
            {overview?.pending ?? 0}
          </span>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          Today&apos;s Appointments
        </h2>

        <div className="bg-white rounded-[24px] border border-slate-100/90 shadow-[0_4px_25px_rgba(0,0,0,0.01)] overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[1000px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#00B2D6] bg-white">
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[18%]">
                    Client Name
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[22%]">
                    Client Email
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[18%]">
                    Service Type
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[18%]">
                    Appointment Time
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[14%]">
                    Location
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins text-center w-[10%]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {isLoading && (
                  <tr>
                    <td colSpan={6} className="py-10">
                      <div className="flex justify-center">
                        <Spinner />
                      </div>
                    </td>
                  </tr>
                )}

                {isError && !isLoading && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center">
                      <p className="text-sm font-bold text-red-500">
                        Failed to load appointments.
                      </p>
                      <button
                        type="button"
                        onClick={() => refetch()}
                        className="mt-3 rounded-full bg-[#00B2D6] px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#0092B0]"
                      >
                        Try Again
                      </button>
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  !isError &&
                  appointments.map((appt) => (
                    <tr
                      key={appt.id}
                      onClick={() => setViewingAppt(appt)}
                      className="hover:bg-slate-50/40 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-6 text-xs sm:text-sm text-[#0F2E4A] font-bold font-sans">
                        {appt.clientName}
                      </td>
                      <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                        {appt.clientEmail}
                      </td>
                      <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                        {appt.serviceType}
                      </td>
                      <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                        {appt.appointmentTime}
                      </td>
                      <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                        {appt.location}
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <span
                          className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold border uppercase tracking-wider ${getStatusClassName(
                            appt.status,
                          )}`}
                        >
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                {!isLoading && !isError && appointments.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-sm font-bold text-slate-400 font-sans"
                    >
                      No appointments found for today.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {viewingAppt &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
              onClick={() => setViewingAppt(null)}
            />

            <div className="bg-white w-full max-w-[480px] rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-6 sm:p-8 relative z-10 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2E4A] font-poppins">
                  Appointment Details
                </h2>
                <button
                  onClick={() => setViewingAppt(null)}
                  className="w-9 h-9 rounded-full bg-[#E6FAFF] text-[#00B2D6] hover:bg-[#D0F3FC] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer border-none outline-none"
                >
                  <X size={18} className="stroke-[2.5]" />
                </button>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-[#0F2E4A] font-sans mt-6">
                <div className="flex items-start gap-1.5">
                  <span className="font-extrabold whitespace-nowrap">Client Name:</span>
                  <span className="font-semibold text-slate-500">{viewingAppt.clientName}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="font-extrabold whitespace-nowrap">Client Email:</span>
                  <span className="font-semibold text-slate-500">{viewingAppt.clientEmail}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="font-extrabold whitespace-nowrap">Service Type:</span>
                  <span className="font-semibold text-slate-500">{viewingAppt.serviceType}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="font-extrabold whitespace-nowrap">Appointment Time:</span>
                  <span className="font-semibold text-slate-500">{viewingAppt.appointmentTime}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="font-extrabold whitespace-nowrap">Location:</span>
                  <span className="font-semibold text-slate-500">{viewingAppt.location}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="font-extrabold whitespace-nowrap">Status:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusClassName(
                      viewingAppt.status,
                    )}`}
                  >
                    {viewingAppt.status}
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setViewingAppt(null)}
                  className="w-full py-3 bg-[#00B2D6] hover:bg-[#009cb9] rounded-2xl text-white font-bold text-sm tracking-wide transition-all active:scale-[0.99] shadow-md shadow-cyan-100"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
