"use client";

import { useCallback, useMemo, useState } from "react";
import ScheduleCalendarView, {
  ScheduleCalendarAppointmentData,
} from "@/components/shared/ScheduleCalendarView";
import { useGetAdminClinicsQuery } from "@/redux/service/admin/cliniciansApi";
import { useGetAdminLocationsQuery } from "@/redux/service/admin/locationsApi";
import {
  AdminBookingCalendarEvent,
  useGetAdminBookingsCalendarQuery,
} from "@/redux/service/admin/bookingsApi";

const getInitialCalendarRange = () => {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = (day + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    rangeStartDay: monday.toISOString().slice(0, 10),
    rangeEndDay: sunday.toISOString().slice(0, 10),
  };
};

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

interface CalendarViewProps {
  title?: string;
  showFilters?: boolean;
  createScheduleHref?: string;
  createScheduleLabel?: string;
}

export default function CalendarView({
  title,
  showFilters = true,
  createScheduleHref,
  createScheduleLabel,
}: CalendarViewProps) {
  const [selectedClinicId, setSelectedClinicId] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [calendarRange, setCalendarRange] = useState(getInitialCalendarRange);

  const { data: clinicsResponse, isFetching: isFetchingClinics } =
    useGetAdminClinicsQuery(
      {
        page: 1,
        limit: 100,
      },
      { skip: !showFilters },
    );

  const { data: locationsResponse, isFetching: isFetchingLocations } =
    useGetAdminLocationsQuery(
      {
        page: 1,
        limit: 100,
      },
      { skip: !showFilters },
    );

  const {
    data: calendarResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAdminBookingsCalendarQuery({
    rangeStartDay: calendarRange.rangeStartDay,
    rangeEndDay: calendarRange.rangeEndDay,
    clinicId: selectedClinicId || undefined,
    locationId: selectedLocationId || undefined,
  });

  const clinicOptions = useMemo(
    () => [
      { value: "", label: "All Clinics" },
      ...(clinicsResponse?.data || []).map((clinic) => ({
        value: clinic.id,
        label: clinic.fullName || clinic.email || "N/A",
      })),
    ],
    [clinicsResponse?.data],
  );

  const locationOptions = useMemo(
    () => [
      { value: "", label: "All Locations" },
      ...(locationsResponse?.data || []).map((location) => ({
        value: location.id,
        label: location.locationName || "N/A",
      })),
    ],
    [locationsResponse?.data],
  );

  const appointments = mapCalendarAppointments(calendarResponse?.data.events);

  const handleVisibleRangeChange = useCallback(
    (range: { rangeStartDay: string; rangeEndDay: string }) => {
      setCalendarRange((currentRange) => {
        if (
          currentRange.rangeStartDay === range.rangeStartDay &&
          currentRange.rangeEndDay === range.rangeEndDay
        ) {
          return currentRange;
        }

        return range;
      });
    },
    [],
  );

  return (
    <ScheduleCalendarView
      title={title}
      appointments={appointments}
      showFilters={showFilters}
      clinicOptions={clinicOptions}
      locationOptions={locationOptions}
      selectedClinicId={selectedClinicId}
      selectedLocationId={selectedLocationId}
      onClinicChange={setSelectedClinicId}
      onLocationChange={setSelectedLocationId}
      filtersLoading={isFetchingClinics || isFetchingLocations}
      createScheduleHref={createScheduleHref}
      createScheduleLabel={createScheduleLabel}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={refetch}
      onVisibleRangeChange={handleVisibleRangeChange}
    />
  );
}
