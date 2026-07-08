"use client";

import { clinicCalendarAppointments } from "@/app/data/ClinicDashboardData";
import ScheduleCalendarView from "@/components/shared/ScheduleCalendarView";

export default function ClinicScheduleView() {
  return (
    <ScheduleCalendarView
      appointments={clinicCalendarAppointments}
      showFilters={false}
      createScheduleHref="/dashboard/clinic/create-schedule"
      createScheduleLabel="Create Schedule"
    />
  );
}
