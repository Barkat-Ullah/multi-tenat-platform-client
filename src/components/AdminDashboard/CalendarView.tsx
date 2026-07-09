"use client";

import ScheduleCalendarView, {
  ScheduleCalendarAppointmentData,
} from "@/components/shared/ScheduleCalendarView";
import {
  AdminBookingCalendarEvent,
  useGetAdminBookingsCalendarQuery,
} from "@/redux/service/admin/bookingsApi";

const CALENDAR_RANGE_START_DAY = "2026-06-07";
const CALENDAR_RANGE_END_DAY = "2026-07-14";

type CalendarDay = ScheduleCalendarAppointmentData["day"];
type CalendarColor = ScheduleCalendarAppointmentData["color"];

const dayNames: CalendarDay[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const toDateKey = (value?: string | null) => {
  if (!value) return undefined;
  const parsed = new Date(value);

  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return value.slice(0, 10);
};

const formatTimeSlot = (value?: string | null) => {
  if (!value) return "N/A";

  const trimmed = value.trim();
  const parsedDate = new Date(trimmed);
  let hours24: number;
  let minutesValue: number;

  if (!Number.isNaN(parsedDate.getTime()) && trimmed.includes("T")) {
    hours24 = parsedDate.getHours();
    minutesValue = parsedDate.getMinutes();
  } else {
    const match = trimmed.match(/^(\d{1,2}):(\d{2})/);
    if (!match) return trimmed;

    hours24 = Number(match[1]);
    minutesValue = Number(match[2]);
  }

  const roundedMinutes = Math.floor(minutesValue / 30) * 30;
  const meridiem = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;

  return `${hours12}:${roundedMinutes.toString().padStart(2, "0")} ${meridiem}`;
};

const getScheduledDay = (date: string): CalendarDay => {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "MON";
  return dayNames[parsed.getDay()];
};

const getAppointmentColor = (status?: string): CalendarColor => {
  const normalizedStatus = status?.toUpperCase();
  return normalizedStatus === "CONFIRMED" || normalizedStatus === "COMPLETED" ? "navy" : "cyan";
};

const getAppointmentName = (event: AdminBookingCalendarEvent) => {
  if (event.type === "organizerRequest") {
    return event.payload?.companyName || event.payload?.organizer?.fullName || "N/A";
  }

  return event.payload?.driver?.fullName || "N/A";
};

const getAppointmentService = (event: AdminBookingCalendarEvent) =>
  event.payload?.service?.title || event.title || "N/A";

const mapCalendarAppointments = (events: AdminBookingCalendarEvent[] = []): ScheduleCalendarAppointmentData[] =>
  events
    .map<ScheduleCalendarAppointmentData | null>((event, index) => {
      const date = toDateKey(event.start || event.payload?.scheduledAt || event.payload?.createdAt);
      if (!date) return null;

      return {
        id: event.id || `${date}-${index}`,
        patientName: getAppointmentName(event),
        serviceType: getAppointmentService(event),
        day: getScheduledDay(date),
        date,
        timeSlot: formatTimeSlot(event.timeSlot?.startTime || event.start),
        color: getAppointmentColor(event.status || event.payload?.status),
      };
    })
    .filter((appointment): appointment is ScheduleCalendarAppointmentData => Boolean(appointment));

export default function CalendarView() {
  const {
    data: calendarResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAdminBookingsCalendarQuery({
    rangeStartDay: CALENDAR_RANGE_START_DAY,
    rangeEndDay: CALENDAR_RANGE_END_DAY,
  });

  const appointments = mapCalendarAppointments(calendarResponse?.data.events);

  return (
    <ScheduleCalendarView
      appointments={appointments}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={refetch}
    />
  );
}
