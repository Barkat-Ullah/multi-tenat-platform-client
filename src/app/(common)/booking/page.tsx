"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { medicalTypesData, otherMedicalsData } from "@/app/data/LandingPageData";
import { clinicLocations } from "@/app/data/LocationsData";
import { toast } from "sonner";

// Import modular step components
import Step1MedicalType from "@/components/booking/Step1MedicalType";
import Step2YourLocation from "@/components/booking/Step2YourLocation";
import Step3SelectTimeSlot from "@/components/booking/Step3SelectTimeSlot";
import Step4YourDetails from "@/components/booking/Step4YourDetails";
import Step5Success from "@/components/booking/Step5Success";

// Helper to convert title to query slug
const getTypeSlug = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("hgv") || t.includes("bus")) return "hgv-bus";
  if (t.includes("taxi") || t.includes("pco")) return "taxi-pco";
  if (t.includes("ambulance")) return "ambulance";
  if (t.includes("forklift") || t.includes("crane")) return "forklift-crane";
  if (t.includes("motorsport")) return "motorsport";
  if (t.includes("pre-employment")) return "pre-employment";
  return t.replace(/[^a-z0-9]+/g, "-");
};

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FCFDFE]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00B2D6]"></div>
      </div>
    }>
      <BookingFlowCoordinator />
    </Suspense>
  );
}

function BookingFlowCoordinator() {
  const searchParams = useSearchParams();

  // Booking Flow Steps: 1 = Medical Type, 2 = Your Location, 3 = Select Time Slot, 4 = Details Form, 5 = Success
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(3);

  // Calendar states defaulting to May 28, 2026 04:20 PM
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 4, 28));
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("04:20 PM");
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date(2026, 4, 1));
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe");

  // Details Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    phone: "",
    postcode: "",
    date: "2026-05-28",
    timeSlot: "04:20 PM",
    notes: ""
  });

  // URL Pre-selection
  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam) {
      const matchedPrimary = medicalTypesData.find(
        (m) => getTypeSlug(m.title) === typeParam || m.title.toLowerCase().includes(typeParam)
      );
      if (matchedPrimary) {
        setSelectedType(matchedPrimary.title);
      } else {
        const matchedOther = otherMedicalsData.find(
          (o) => getTypeSlug(o.name) === typeParam
        );
        if (matchedOther) {
          setSelectedType(matchedOther.name);
        }
      }
    }
  }, [searchParams]);

  // Process clinic location listings based on search text
  const filteredClinics = useMemo(() => {
    return clinicLocations.filter((clinic) => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      return (
        clinic.name.toLowerCase().includes(query) ||
        clinic.city.toLowerCase().includes(query) ||
        clinic.address.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  // Enrich clinic locations with mockup-specific stats (distance, date, parking)
  const enrichedClinics = useMemo(() => {
    return filteredClinics.map((clinic, index) => {
      let distanceStr = `${(index * 1.5 + 0.5).toFixed(1)} mile${index === 0 ? "" : "s"}`;
      let earliestDate = "6 Jun";
      let parkingStr = index % 2 === 0 ? "Yes (Free)" : "No";

      if (clinic.id === "derby-mckeever") {
        distanceStr = "0.5 mile";
        earliestDate = "6 Jun";
        parkingStr = "Yes (Free)";
      } else if (clinic.id === "royal-london") {
        distanceStr = "2 mile";
        earliestDate = "6 Jun";
        parkingStr = "No";
      } else if (clinic.id === "hca-healthcare") {
        distanceStr = "11.5 mile";
        earliestDate = "6 Jun";
        parkingStr = "Yes (Free)";
      }

      return {
        ...clinic,
        distanceStr,
        earliestDate,
        parkingStr
      };
    });
  }, [filteredClinics]);

  const selectedClinic = clinicLocations.find((c) => c.id === selectedClinicId);

  const handleCardBookNow = (title: string) => {
    setSelectedType(title);
    setStep(2);
  };

  const handleContinueToLocation = () => {
    if (!selectedType) {
      toast.error("Please select a medical type to continue.");
      return;
    }
    setStep(2);
  };

  const handleBookClinic = (clinicId: string) => {
    setSelectedClinicId(clinicId);
    setStep(3);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.dob || !formData.phone || !formData.postcode || !formData.date) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setStep(5);
    toast.success("Booking request sent successfully!");
  };

  return (
    <div className="bg-[#FCFDFE] min-h-screen poppins py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
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
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                isAccordionOpen={isAccordionOpen}
                setIsAccordionOpen={setIsAccordionOpen}
                onNext={handleContinueToLocation}
                onCardBookNow={handleCardBookNow}
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
                enrichedClinics={enrichedClinics}
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
                selectedTimeSlot={selectedTimeSlot}
                setSelectedTimeSlot={setSelectedTimeSlot}
                calendarMonth={calendarMonth}
                setCalendarMonth={setCalendarMonth}
                onBack={() => setStep(2)}
                onContinue={() => {
                  const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
                  setFormData(prev => ({
                    ...prev,
                    date: formattedDate,
                    timeSlot: selectedTimeSlot
                  }));
                  setStep(4);
                }}
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
                selectedType={selectedType}
                selectedClinic={selectedClinic}
                selectedDate={selectedDate}
                formData={formData}
                handleInputChange={handleInputChange}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
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
              <Step5Success 
                selectedType={selectedType}
                selectedClinic={selectedClinic}
                formData={formData}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
