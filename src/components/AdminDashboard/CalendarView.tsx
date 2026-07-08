"use client";

import { adminCalendarAppointments } from "@/app/data/AdminDashboardData";
import ScheduleCalendarView from "@/components/shared/ScheduleCalendarView";

export default function CalendarView() {
  return <ScheduleCalendarView appointments={adminCalendarAppointments} />;
}
