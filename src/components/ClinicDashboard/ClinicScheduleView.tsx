"use client";

import CalendarView from "@/components/AdminDashboard/CalendarView";

export default function ClinicScheduleView() {
  return (
    <CalendarView
      title="My Schedule"
      showFilters={false}
      createScheduleHref="/dashboard/clinic/create-schedule"
      createScheduleLabel="Create Schedule"
    />
  );
}
