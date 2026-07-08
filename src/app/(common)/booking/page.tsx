"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/store";
import { useGetProfileDataQuery } from "@/redux/service/profile/profileApi";
import {
  type DriverBooking,
  useCreateDriverBookingMutation,
  useGetBookingServiceDetailsQuery,
  useGetBookingServicesQuery,
  useGetBookingSlotsQuery,
} from "@/redux/service/user/userBookingFlowApi";

import Step1MedicalType from "@/components/booking/Step1MedicalType";
import Step2YourLocation, {
  type BookingClinicDisplay,
} from "@/components/booking/Step2YourLocation";
import Step3SelectTimeSlot from "@/components/booking/Step3SelectTimeSlot";
import Step4YourDetails from "@/components/booking/Step4YourDetails";
import Step5Success from "@/components/booking/Step5Success";

const DEFAULT_BOOKING_PRICE = 49.99;

const getTypeSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const formatDateParam = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

const parseSlotStartToIso = (date: Date, startTime: string) => {
  const match = startTime.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  const scheduled = new Date(date);

  if (!match) {
    scheduled.setHours(0, 0, 0, 0);
    return scheduled.toISOString();
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();

  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  scheduled.setHours(hours, minutes, 0, 0);
  return scheduled.toISOString();
};

const getDistanceInMiles = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) => {
  const earthRadiusMiles = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusMiles * c;
};

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FCFDFE]">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[#00B2D6]" />
        </div>
      }
    >
      <BookingFlowCoordinator />
    </Suspense>
  );
}

function BookingFlowCoordinator() {
  const searchParams = useSearchParams();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const [step, setStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = useState<Date>(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [paymentMethod, setPaymentMethod] = useState<"Stripe" | "Paypal">("Stripe");
  const [createdBooking, setCreatedBooking] = useState<DriverBooking | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const {
    data: servicesResponse,
    isLoading: isServicesLoading,
    isFetching: isServicesFetching,
    isError: isServicesError,
    refetch: refetchServices,
  } = useGetBookingServicesQuery({ page: 1, limit: 100 });

  const services = servicesResponse?.data || [];
  const selectedService = services.find((service) => service.id === selectedServiceId) || null;

  const {
    data: serviceDetailsResponse,
    isLoading: isServiceDetailsLoading,
    isFetching: isServiceDetailsFetching,
    isError: isServiceDetailsError,
    refetch: refetchServiceDetails,
  } = useGetBookingServiceDetailsQuery(selectedServiceId || "", {
    skip: !selectedServiceId,
  });

  const {
    data: slotsResponse,
    isLoading: isSlotsLoading,
    isFetching: isSlotsFetching,
    isError: isSlotsError,
    refetch: refetchSlots,
  } = useGetBookingSlotsQuery(
    {
      serviceId: selectedServiceId || "",
      clinicId: selectedClinicId || "",
      date: formatDateParam(selectedDate),
    },
    {
      skip: !selectedServiceId || !selectedClinicId || step !== 3,
    },
  );

  const {
    data: profileResponse,
    isLoading: isProfileLoading,
    isFetching: isProfileFetching,
  } = useGetProfileDataQuery(undefined, {
    skip: !accessToken || step < 4,
  });

  const [createBooking, { isLoading: isCreatingBooking }] =
    useCreateDriverBookingMutation();

  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (!typeParam || selectedServiceId || services.length === 0) return;

    const normalizedTypeParam = typeParam.toLowerCase();
    const matched = services.find((service) => {
      const slug = getTypeSlug(service.title);
      return slug === normalizedTypeParam || service.title.toLowerCase().includes(normalizedTypeParam);
    });

    if (matched) {
      setSelectedServiceId(matched.id);
    }
  }, [searchParams, selectedServiceId, services]);

  const clinics = useMemo<BookingClinicDisplay[]>(() => {
    const query = searchQuery.toLowerCase().trim();
    const serviceClinics = serviceDetailsResponse?.data?.clinics || [];

    const mappedClinics = serviceClinics
      .filter((clinic) => {
        const locationName = clinic.location?.locationName || "";
        if (!query) return true;
        return (
          clinic.fullName.toLowerCase().includes(query) ||
          locationName.toLowerCase().includes(query) ||
          (clinic.email || "").toLowerCase().includes(query)
        );
      })
      .map((clinic) => {
        const locationName = clinic.location?.locationName || "N/A";
        const lat = clinic.location?.lat ?? 0;
        const lng = clinic.location?.lng ?? 0;
        const distance =
          userCoords && lat && lng
            ? getDistanceInMiles(userCoords.lat, userCoords.lng, lat, lng)
            : null;

        return {
          ...clinic,
          name: clinic.fullName,
          address: locationName,
          lat,
          lng,
          distance,
          distanceStr: distance === null ? "N/A" : `${distance.toFixed(1)} mi`,
          earliestDate: "Select date",
          parkingStr: clinic.isParking ? "Yes" : "No",
        };
      });

    if (userCoords) {
      mappedClinics.sort((a, b) => (a.distance ?? Number.MAX_VALUE) - (b.distance ?? Number.MAX_VALUE));
    }

    return mappedClinics;
  }, [searchQuery, serviceDetailsResponse?.data?.clinics, userCoords]);

  const selectedClinic =
    clinics.find((clinic) => clinic.id === selectedClinicId) || null;
  const slots = slotsResponse?.data?.slots || [];
  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId) || null;

  const handleSelectService = (id: string | null) => {
    setSelectedServiceId(id);
    setSelectedClinicId(null);
    setSelectedSlotId(null);
    setSearchQuery("");
    setVisibleCount(3);
  };

  const handleContinueToLocation = () => {
    if (!selectedServiceId) {
      toast.error("Please select a medical type to continue.");
      return;
    }
    setStep(2);
  };

  const handleBookClinic = (clinicId: string) => {
    setSelectedClinicId(clinicId);
    setSelectedSlotId(null);
    setStep(3);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setVisibleCount((count) => Math.max(count, 5));
        setIsLocating(false);
        toast.success("Showing nearest clinics around your current location.");
      },
      () => {
        setLocationError("Unable to retrieve your location. Please check browser permissions.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const handleResetLocation = () => {
    setUserCoords(null);
    setLocationError(null);
  };

  const handleContinueToDetails = () => {
    if (!selectedSlotId) {
      toast.error("Please select a time slot to continue.");
      return;
    }
    setStep(4);
  };

  const handleSubmitBooking = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!accessToken) {
      toast.error("Please log in as a driver before booking.");
      window.location.href = `/login?redirect=${encodeURIComponent("/booking")}`;
      return;
    }

    if (!selectedServiceId || !selectedClinicId || !selectedSlot) {
      toast.error("Please complete service, clinic, and slot selection.");
      return;
    }

    try {
      const response = await createBooking({
        clinicId: selectedClinicId,
        serviceId: selectedServiceId,
        timeSlotId: selectedSlot.id,
        scheduledAt: parseSlotStartToIso(selectedDate, selectedSlot.startTime),
        paymentType: paymentMethod,
        price: DEFAULT_BOOKING_PRICE,
      }).unwrap();

      setCreatedBooking(response.data.booking);
      toast.success(response.message || "Booking created successfully.");

      if (response.data.paymentUrl) {
        try {
          sessionStorage.setItem(
            "latestBooking",
            JSON.stringify({
              booking: response.data.booking,
              payment: response.data.payment,
            }),
          );
        } catch {
          // Ignore storage failures and continue to payment.
        }
        window.location.href = response.data.paymentUrl;
        return;
      }

      setStep(5);
    } catch (error) {
      const message =
        (error as { data?: { message?: string }; message?: string })?.data?.message ||
        (error as { message?: string })?.message ||
        "Failed to create booking.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFDFE] px-4 py-12 poppins sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <Step1MedicalType
                services={services}
                selectedServiceId={selectedServiceId}
                isLoading={isServicesLoading || isServicesFetching}
                isError={isServicesError}
                setSelectedServiceId={handleSelectService}
                onNext={handleContinueToLocation}
                onRetry={refetchServices}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <Step2YourLocation
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedClinicId={selectedClinicId}
                setSelectedClinicId={setSelectedClinicId}
                visibleCount={visibleCount}
                setVisibleCount={setVisibleCount}
                clinics={clinics}
                hasUserLocation={Boolean(userCoords)}
                isLocating={isLocating}
                locationError={locationError}
                isLoading={isServiceDetailsLoading || isServiceDetailsFetching}
                isError={isServiceDetailsError}
                onUseMyLocation={handleUseMyLocation}
                onResetLocation={handleResetLocation}
                onRetry={refetchServiceDetails}
                onBookClinic={handleBookClinic}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <Step3SelectTimeSlot
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedSlotId={selectedSlotId}
                setSelectedSlotId={setSelectedSlotId}
                slots={slots}
                isAvailable={Boolean(slotsResponse?.data?.isAvailable)}
                isLoading={isSlotsLoading || isSlotsFetching}
                isError={isSlotsError}
                calendarMonth={calendarMonth}
                setCalendarMonth={setCalendarMonth}
                onBack={() => setStep(2)}
                onContinue={handleContinueToDetails}
                onRetry={refetchSlots}
              />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Step4YourDetails
                selectedService={selectedService}
                selectedClinic={selectedClinic}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                profile={profileResponse?.data || null}
                isProfileLoading={isProfileLoading || isProfileFetching}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                price={DEFAULT_BOOKING_PRICE}
                isSubmitting={isCreatingBooking}
                onBack={() => setStep(3)}
                onSubmit={handleSubmitBooking}
              />
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <Step5Success booking={createdBooking} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
