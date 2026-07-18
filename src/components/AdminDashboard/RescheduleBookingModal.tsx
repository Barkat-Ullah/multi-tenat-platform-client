"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Calendar, Clock, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import type { AdminBooking } from "@/redux/service/admin/bookingsApi";
import {
  useGetBookingSlotsQuery,
  type BookingSlot,
} from "@/redux/service/user/userBookingFlowApi";

interface RescheduleBookingModalProps {
  booking: AdminBooking | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    id: string;
    newTimeSlotId: string;
    newScheduledAt: string;
  }) => void;
}

const formatDateTime = (value?: string) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const getTodayFormatted = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
};

export default function RescheduleBookingModal({
  booking,
  isSubmitting,
  onClose,
  onSubmit,
}: RescheduleBookingModalProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayFormatted());
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [customSlotId, setCustomSlotId] = useState<string>("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (booking) {
      if (booking.scheduledAt) {
        const d = new Date(booking.scheduledAt);
        if (!Number.isNaN(d.getTime())) {
          setSelectedDate(d.toISOString().split("T")[0]);
        }
      }
      setSelectedSlotId("");
      setCustomSlotId("");
    }
  }, [booking]);

  useEffect(() => {
    if (!booking) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [booking]);

  const serviceId = booking?.serviceId || booking?.service?.id || "";
  const clinicId = booking?.clinicId || booking?.clinic?.id || "";

  const {
    data: slotsData,
    isLoading: isSlotsLoading,
    isFetching: isSlotsFetching,
  } = useGetBookingSlotsQuery(
    {
      serviceId,
      clinicId,
      date: selectedDate,
    },
    {
      skip: !serviceId || !clinicId || !selectedDate || !booking,
    },
  );

  const availableSlots: BookingSlot[] = slotsData?.data?.slots || [];
  const selectedSlot = availableSlots.find((s) => s.id === selectedSlotId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!booking) return;

    const slotIdToUse = selectedSlotId || customSlotId.trim();

    if (!slotIdToUse) {
      toast.error("Please select an available time slot or enter a Slot ID.");
      return;
    }

    if (!selectedDate) {
      toast.error("Please select a new date.");
      return;
    }

    let isoScheduledAt = "";

    if (selectedSlot && selectedSlot.startTime) {
      // Form ISO date string combining selectedDate (YYYY-MM-DD) and slot startTime (HH:mm)
      const dateStr = `${selectedDate}T${selectedSlot.startTime}:00Z`;
      const d = new Date(dateStr);
      isoScheduledAt = !Number.isNaN(d.getTime())
        ? d.toISOString()
        : new Date(`${selectedDate}T10:00:00Z`).toISOString();
    } else {
      isoScheduledAt = new Date(`${selectedDate}T10:00:00Z`).toISOString();
    }

    onSubmit({
      id: booking.id,
      newTimeSlotId: slotIdToUse,
      newScheduledAt: isoScheduledAt,
    });
  };

  if (!booking || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal background"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        disabled={isSubmitting}
      />

      <div className="relative z-10 w-full max-w-[560px] max-h-[90vh] overflow-y-auto rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] sm:p-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-poppins text-xl font-extrabold text-[#0F2E4A]">
              Reschedule Appointment
            </h3>
            <p className="mt-0.5 text-xs font-semibold text-slate-400">
              Booking ID: <span className="font-mono text-slate-600">{booking.id}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 disabled:opacity-50"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Booking Overview */}
        <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-400">Driver:</span>
            <span className="font-bold text-[#0F2E4A]">
              {booking.driver?.fullName || "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-400">Service:</span>
            <span className="font-semibold text-slate-700">
              {booking.service?.title || "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-400">Clinic:</span>
            <span className="font-semibold text-slate-700">
              {booking.clinic?.fullName || "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
            <span className="font-bold text-slate-400">Current Scheduled:</span>
            <span className="font-bold text-[#00B2D6]">
              {formatDateTime(booking.scheduledAt)}
            </span>
          </div>
        </div>

        {/* Reschedule Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Pick New Date */}
          <div>
            <label className="mb-2 flex items-center gap-1.5 text-xs font-bold text-[#0F2E4A]">
              <Calendar size={15} className="text-[#00B2D6]" />
              Select New Appointment Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedSlotId("");
              }}
              min={new Date().toISOString().split("T")[0]}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs font-semibold text-[#0F2E4A] transition-all focus:border-[#00B2D6] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00B2D6] sm:text-sm"
            />
          </div>

          {/* Time Slots Selection */}
          <div>
            <label className="mb-2 flex items-center justify-between text-xs font-bold text-[#0F2E4A]">
              <span className="flex items-center gap-1.5">
                <Clock size={15} className="text-[#00B2D6]" />
                Select Available Time Slot <span className="text-red-500">*</span>
              </span>
              {(isSlotsLoading || isSlotsFetching) && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-[#00B2D6]">
                  <RefreshCw size={12} className="animate-spin" /> Loading slots...
                </span>
              )}
            </label>

            {isSlotsLoading || isSlotsFetching ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 animate-pulse rounded-xl bg-slate-100"
                  />
                ))}
              </div>
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 max-h-[180px] overflow-y-auto p-1 border border-slate-100 rounded-xl bg-slate-50/30">
                {availableSlots.map((slot) => {
                  const isSelected = selectedSlotId === slot.id;
                  const isAvailable = !slot.isBooked && slot.booked < slot.capacity;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`rounded-xl border p-2.5 text-center text-xs font-bold transition-all ${
                        isSelected
                          ? "border-[#00B2D6] bg-[#00B2D6] text-white shadow-md"
                          : isAvailable
                          ? "border-slate-200 bg-white text-[#0F2E4A] hover:border-[#00B2D6] hover:bg-[#E6FAFF]"
                          : "border-slate-100 bg-slate-100 text-slate-300 cursor-not-allowed line-through"
                      }`}
                    >
                      {slot.startTime} - {slot.endTime}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50/50 p-4 text-center">
                <p className="text-xs font-bold text-amber-800">
                  No available time slots found for {selectedDate}.
                </p>
                <p className="mt-1 text-[11px] font-medium text-amber-600">
                  Please pick another date above, or enter a valid Time Slot ID below.
                </p>

                {/* Fallback Slot ID Input */}
                <div className="mt-3 text-left">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Slot ID (Manual Input)
                  </label>
                  <input
                    type="text"
                    value={customSlotId}
                    onChange={(e) => setCustomSlotId(e.target.value)}
                    placeholder="e.g. 6a2ccce97c920d65fed14ec8"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono text-slate-800 focus:border-[#00B2D6] focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (!selectedSlotId && !customSlotId.trim())}
              className="flex items-center gap-2 rounded-full bg-[#00B2D6] px-6 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#009cb9] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 shadow-md"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Rescheduling...
                </>
              ) : (
                "Confirm Reschedule"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
