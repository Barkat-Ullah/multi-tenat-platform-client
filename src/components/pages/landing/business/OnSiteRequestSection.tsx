"use client";

import React, { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { ChevronLeft, Check, Loader2, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import {
  useCreateOrganizerRequestMutation,
  useGetAllServicesQuery,
} from "@/redux/service/corporate/corporateDashboardApi";
import { normalizeRole } from "@/utils/roles";
import {
  clearOnSiteRequestResume,
  getOnSiteRequestDraft,
  saveOnSiteRequestDraft,
} from "@/utils/onSiteRequestResume";

const toServiceDateTimeIso = (date: string, time: string) => {
  const trimmedTime = time.trim();
  const timeMatch = trimmedTime.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);

  let hours = 0;
  let minutes = 0;

  if (timeMatch) {
    hours = Number(timeMatch[1]);
    minutes = Number(timeMatch[2] ?? "0");
    const period = timeMatch[3]?.toUpperCase();

    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
  }

  return new Date(Date.UTC(
    Number(date.slice(0, 4)),
    Number(date.slice(5, 7)) - 1,
    Number(date.slice(8, 10)),
    hours,
    minutes,
  )).toISOString();
};

export default function OnSiteRequestSection() {
  const [step, setStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const router = useRouter();
  const { accessToken, user } = useAppSelector((state) => state.auth);
  const isAuthenticated = Boolean(accessToken);
  const isOrganizer = isAuthenticated && normalizeRole(user?.role) === "ORGINIZER";
  const { data: servicesData, isLoading: isLoadingServices } = useGetAllServicesQuery();
  const [createOrganizerRequest, { isLoading: isSubmitting }] =
    useCreateOrganizerRequestMutation();
  const services = servicesData?.data ?? [];

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    medicalRequired: "",
    candidatesCount: "",
    // Step 2 fields
    siteContact: "",
    siteContactPhone: "",
    siteAddressLine1: "",
    siteAddressLine2: "",
    siteCityTown: "",
    dateRequired: "",
    startTimeRequired: "",
    roomSizeMet: "no" as "yes" | "no",
    parkingAvailable: "yes" as "yes" | "no",
    specialRequirements: "",
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOrganizer) return;

    const draft = getOnSiteRequestDraft();
    if (!draft) return;

    setFormData((prev) => ({
      ...prev,
      ...draft,
    }));
    setStep(2);
    setShowAuthPrompt(false);
    window.scrollTo({ top: document.getElementById("request-form-section")?.offsetTop || 300, behavior: "smooth" });
  }, [isOrganizer]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) newErrors.phone = "Telephone is required";
    if (!formData.businessName.trim()) newErrors.businessName = "Business name is required";
    if (!formData.medicalRequired) newErrors.medicalRequired = "Please select or enter the medical type";
    if (!formData.candidatesCount) {
      newErrors.candidatesCount = "Number of candidates is required";
    } else if (isNaN(Number(formData.candidatesCount)) || Number(formData.candidatesCount) <= 0) {
      newErrors.candidatesCount = "Please enter a valid number of candidates";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.siteContact.trim()) newErrors.siteContact = "Site contact name is required";
    if (!formData.siteContactPhone.trim()) newErrors.siteContactPhone = "Site contact telephone is required";
    if (!formData.siteAddressLine1.trim()) newErrors.siteAddressLine1 = "Site address line 1 is required";
    if (!formData.siteCityTown.trim()) newErrors.siteCityTown = "City/town is required";
    if (!formData.dateRequired) newErrors.dateRequired = "Date is required";
    if (!formData.startTimeRequired.trim()) newErrors.startTimeRequired = "Start time is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) return;

    if (!isAuthenticated) {
      saveOnSiteRequestDraft({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        businessName: formData.businessName,
        medicalRequired: formData.medicalRequired,
        candidatesCount: formData.candidatesCount,
      });
      setShowAuthPrompt(true);
      return;
    }

    if (!isOrganizer) {
      toast.error("Only organizer accounts can submit on-site requests.");
      return;
    }

    setStep(2);
    window.scrollTo({ top: document.getElementById("request-form-section")?.offsetTop || 300, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep(1);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOrganizer) {
      toast.error("Only organizer accounts can submit on-site requests.");
      return;
    }
    if (validateStep2()) {
      const siteAddress = [formData.siteAddressLine1.trim(), formData.siteAddressLine2.trim()]
        .filter(Boolean)
        .join(", ");
      const dataOfService = toServiceDateTimeIso(formData.dateRequired, formData.startTimeRequired);

      try {
        await createOrganizerRequest({
          serviceId: formData.medicalRequired,
          companyName: formData.businessName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          location: formData.siteCityTown.trim(),
          totalDriver: formData.candidatesCount.trim(),
          siteContact: formData.siteContact.trim(),
          siteContactPhone: formData.siteContactPhone.trim(),
          siteAddress,
          siteCity: formData.siteCityTown.trim(),
          dataOfService,
          startTime: formData.startTimeRequired.trim(),
          isSizeRequired: formData.roomSizeMet === "yes",
          isOnsiteParking: formData.parkingAvailable === "yes",
          specialText: formData.specialRequirements.trim(),
        }).unwrap();

        clearOnSiteRequestResume();
        toast.success("On-site request submitted successfully.");
        setIsSubmitted(true);
        window.scrollTo({ top: document.getElementById("request-form-section")?.offsetTop || 300, behavior: "smooth" });
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to submit on-site request.");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      businessName: "",
      medicalRequired: "",
      candidatesCount: "",
      siteContact: "",
      siteContactPhone: "",
      siteAddressLine1: "",
      siteAddressLine2: "",
      siteCityTown: "",
      dateRequired: "",
      startTimeRequired: "",
      roomSizeMet: "no",
      parkingAvailable: "yes",
      specialRequirements: "",
    });
    setErrors({});
    setStep(1);
    setIsSubmitted(false);
    clearOnSiteRequestResume();
  };

  const goToAuth = (path: "/login" | "/register") => {
    saveOnSiteRequestDraft({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      businessName: formData.businessName,
      medicalRequired: formData.medicalRequired,
      candidatesCount: formData.candidatesCount,
    });
    router.push(path);
  };

  const isBlockedAuthenticatedUser = isAuthenticated && !isOrganizer;

  return (
    <section
      id="request-form-section"
      className="bg-[#F8FAFC] py-16 sm:py-20 lg:py-24 poppins relative overflow-hidden border-b border-slate-100"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">

        {/* Top Header Section */}
        <div className="text-center mb-8 w-full max-w-[650px] flex flex-col items-center">
          <div className="mb-4">
            <Logo />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] tracking-tight mb-2">
            On-Site Request
          </h2>

          {!isSubmitted && !isBlockedAuthenticatedUser && (
            <>
              {/* Step indicator */}
              <p className="text-[#00B2D6] font-bold text-sm tracking-wider uppercase mb-3">
                Step:0{step}/02
              </p>

              {/* Custom Progress Bar */}
              <div className="w-[300px] h-2 bg-slate-200 rounded-full overflow-hidden mb-8 relative">
                <div
                  className="h-full bg-[#00B2D6] rounded-full transition-all duration-500 ease-out"
                  style={{ width: step === 1 ? "50%" : "100%" }}
                />
              </div>
            </>
          )}
        </div>

        {/* Form Container Card */}
        <div className="w-full max-w-[650px] bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <AnimatePresence mode="wait">
            {isBlockedAuthenticatedUser ? (
              <motion.div
                key="organizer-only"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="text-center py-8 flex flex-col items-center"
              >
                <h3 className="text-2xl font-bold text-[#0F2E4A] mb-4">
                  Organizer Access Required
                </h3>
                <p className="text-[#55697A] font-medium text-sm sm:text-base leading-relaxed max-w-md mx-auto">
                  Please log in with an organizer account to submit an on-site request for your drivers.
                </p>
              </motion.div>
            ) : isSubmitted ? (
              // Success Message State
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="text-center py-8 flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-[#00B2D6]/10 rounded-full flex items-center justify-center text-[#00B2D6] mb-6 animate-pulse">
                  <Check size={36} className="stroke-[3]" />
                </div>
                <h3 className="text-2xl font-bold text-[#0F2E4A] mb-4">
                  Request Submitted!
                </h3>
                <p className="text-[#55697A] font-medium text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-8">
                  Thank you for your request. Our medical bookings team will contact you shortly at
                  <strong className="text-[#0F2E4A]"> {formData.email} </strong> or via phone to confirm dates, medical candidate details, and finalize your booking.
                </p>
                <button
                  onClick={resetForm}
                  className="inline-flex items-center justify-center rounded-full bg-[#00B2D6] px-8 py-3.5 font-bold text-white transition-all duration-300 hover:bg-[#0092B3] shadow-[0_4px_14px_rgba(0,178,214,0.15)]"
                >
                  Submit Another Request
                </button>
              </motion.div>
            ) : step === 1 ? (
              // Step 1: Basic Information
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleNext}
                className="space-y-6"
                noValidate
              >
                {/* Name field */}
                <div>
                  <label htmlFor="name" className="block text-[#0F2E4A] font-extrabold text-sm sm:text-[15px] mb-2">
                    Enter Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter Your Name"
                    className={`w-full bg-white border ${errors.name ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-[#00B2D6] focus:ring-[#00B2D6]/10"
                      } rounded-xl px-4 py-3 text-[#0F2E4A] font-medium placeholder-slate-400 text-sm sm:text-base outline-none transition-all`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.name}</p>}
                </div>

                {/* Email field */}
                <div>
                  <label htmlFor="email" className="block text-[#0F2E4A] font-extrabold text-sm sm:text-[15px] mb-2">
                    Enter Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter Your Email"
                    className={`w-full bg-white border ${errors.email ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-[#00B2D6] focus:ring-[#00B2D6]/10"
                      } rounded-xl px-4 py-3 text-[#0F2E4A] font-medium placeholder-slate-400 text-sm sm:text-base outline-none transition-all`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.email}</p>}
                </div>

                {/* Telephone field */}
                <div>
                  <label htmlFor="phone" className="block text-[#0F2E4A] font-extrabold text-sm sm:text-[15px] mb-2">
                    Telephone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter Your Telephone"
                    className={`w-full bg-white border ${errors.phone ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-[#00B2D6] focus:ring-[#00B2D6]/10"
                      } rounded-xl px-4 py-3 text-[#0F2E4A] font-medium placeholder-slate-400 text-sm sm:text-base outline-none transition-all`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.phone}</p>}
                </div>

                {/* Business Name field */}
                <div>
                  <label htmlFor="businessName" className="block text-[#0F2E4A] font-extrabold text-sm sm:text-[15px] mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Enter Your Business Name"
                    className={`w-full bg-white border ${errors.businessName ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-[#00B2D6] focus:ring-[#00B2D6]/10"
                      } rounded-xl px-4 py-3 text-[#0F2E4A] font-medium placeholder-slate-400 text-sm sm:text-base outline-none transition-all`}
                  />
                  {errors.businessName && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.businessName}</p>}
                </div>

                {/* Medical Required field */}
                <div>
                  <label htmlFor="medicalRequired" className="block text-[#0F2E4A] font-extrabold text-sm sm:text-[15px] mb-2">
                    Medical Required
                  </label>
                  <select
                    id="medicalRequired"
                    name="medicalRequired"
                    value={formData.medicalRequired}
                    onChange={handleInputChange}
                    disabled={isLoadingServices}
                    className={`w-full bg-white border ${errors.medicalRequired ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-[#00B2D6] focus:ring-[#00B2D6]/10"
                      } rounded-xl px-4 py-3 text-[#0F2E4A] font-medium placeholder-slate-400 text-sm sm:text-base outline-none transition-all appearance-none cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`}
                  >
                    <option value="" disabled className="text-slate-400">
                      {isLoadingServices ? "Loading medical services..." : "Medical Required"}
                    </option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                  {!isLoadingServices && services.length === 0 && (
                    <p className="text-red-500 text-xs mt-1.5 font-semibold">
                      No medical services are available right now.
                    </p>
                  )}
                  {errors.medicalRequired && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.medicalRequired}</p>}
                </div>

                {/* Candidates Count field */}
                <div>
                  <label htmlFor="candidatesCount" className="block text-[#0F2E4A] font-extrabold text-sm sm:text-[15px] mb-2">
                    No of Candidates
                  </label>
                  <input
                    type="number"
                    id="candidatesCount"
                    name="candidatesCount"
                    value={formData.candidatesCount}
                    onChange={handleInputChange}
                    placeholder="No of Candidates"
                    min="1"
                    className={`w-full bg-white border ${errors.candidatesCount ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-[#00B2D6] focus:ring-[#00B2D6]/10"
                      } rounded-xl px-4 py-3 text-[#0F2E4A] font-medium placeholder-slate-400 text-sm sm:text-base outline-none transition-all`}
                  />
                  {errors.candidatesCount && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.candidatesCount}</p>}
                </div>

                {/* Button Next */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center rounded-full bg-[#00B2D6] py-3.5 font-bold text-white transition-all duration-300 hover:bg-[#0092B3] shadow-[0_4px_14px_rgba(0,178,214,0.15)] text-sm sm:text-base"
                  >
                    Next
                  </button>
                </div>
              </motion.form>
            ) : (
              // Step 2: Site details, requirements & submission
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-6"
                noValidate
              >
                {/* Site Contact */}
                <div>
                  <label htmlFor="siteContact" className="block text-[#0F2E4A] font-extrabold text-sm sm:text-[15px] mb-2">
                    Site Contact
                  </label>
                  <input
                    type="text"
                    id="siteContact"
                    name="siteContact"
                    value={formData.siteContact}
                    onChange={handleInputChange}
                    placeholder="Enter Your Site Contact"
                    className={`w-full bg-white border ${errors.siteContact ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-[#00B2D6] focus:ring-[#00B2D6]/10"
                      } rounded-xl px-4 py-3 text-[#0F2E4A] font-medium placeholder-slate-400 text-sm sm:text-base outline-none transition-all`}
                  />
                  {errors.siteContact && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.siteContact}</p>}
                </div>

                {/* Site Contact Telephone */}
                <div>
                  <label htmlFor="siteContactPhone" className="block text-[#0F2E4A] font-extrabold text-sm sm:text-[15px] mb-2">
                    Site Contact Telephone
                  </label>
                  <input
                    type="tel"
                    id="siteContactPhone"
                    name="siteContactPhone"
                    value={formData.siteContactPhone}
                    onChange={handleInputChange}
                    placeholder="Enter Your Site Contact Telephone"
                    className={`w-full bg-white border ${errors.siteContactPhone ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-[#00B2D6] focus:ring-[#00B2D6]/10"
                      } rounded-xl px-4 py-3 text-[#0F2E4A] font-medium placeholder-slate-400 text-sm sm:text-base outline-none transition-all`}
                  />
                  {errors.siteContactPhone && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.siteContactPhone}</p>}
                </div>

                {/* Site Address Line 1 */}
                <div>
                  <label htmlFor="siteAddressLine1" className="block text-[#0F2E4A] font-extrabold text-sm sm:text-[15px] mb-2">
                    Site Address Line 1
                  </label>
                  <input
                    type="text"
                    id="siteAddressLine1"
                    name="siteAddressLine1"
                    value={formData.siteAddressLine1}
                    onChange={handleInputChange}
                    placeholder="Enter Your Site Address Line 1"
                    className={`w-full bg-white border ${errors.siteAddressLine1 ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-[#00B2D6] focus:ring-[#00B2D6]/10"
                      } rounded-xl px-4 py-3 text-[#0F2E4A] font-medium placeholder-slate-400 text-sm sm:text-base outline-none transition-all`}
                  />
                  {errors.siteAddressLine1 && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.siteAddressLine1}</p>}
                </div>

                {/* Site Address Line 2 */}
                <div>
                  <label htmlFor="siteAddressLine2" className="block text-[#0F2E4A] font-extrabold text-sm sm:text-[15px] mb-2">
                    Site Address Line 2
                  </label>
                  <input
                    type="text"
                    id="siteAddressLine2"
                    name="siteAddressLine2"
                    value={formData.siteAddressLine2}
                    onChange={handleInputChange}
                    placeholder="Enter Your Site Address Line 2"
                    className="w-full bg-white border border-slate-200 focus:border-[#00B2D6] focus:ring-[#00B2D6]/10 rounded-xl px-4 py-3 text-[#0F2E4A] font-medium placeholder-slate-400 text-sm sm:text-base outline-none transition-all"
                  />
                </div>

                {/* Site City/Town */}
                <div>
                  <label htmlFor="siteCityTown" className="block text-[#0F2E4A] font-extrabold text-sm sm:text-[15px] mb-2">
                    Site City/Town
                  </label>
                  <input
                    type="text"
                    id="siteCityTown"
                    name="siteCityTown"
                    value={formData.siteCityTown}
                    onChange={handleInputChange}
                    placeholder="Enter Your City/Town"
                    className={`w-full bg-white border ${errors.siteCityTown ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-[#00B2D6] focus:ring-[#00B2D6]/10"
                      } rounded-xl px-4 py-3 text-[#0F2E4A] font-medium placeholder-slate-400 text-sm sm:text-base outline-none transition-all`}
                  />
                  {errors.siteCityTown && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.siteCityTown}</p>}
                </div>

                {/* Date Required */}
                <div>
                  <label htmlFor="dateRequired" className="block text-[#0F2E4A] font-extrabold text-sm sm:text-[15px] mb-2">
                    Date Required
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="dateRequired"
                      name="dateRequired"
                      value={formData.dateRequired}
                      onChange={handleInputChange}
                      className={`w-full bg-white border ${errors.dateRequired ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-[#00B2D6] focus:ring-[#00B2D6]/10"
                        } rounded-xl px-4 py-3 pr-12 text-[#0F2E4A] font-medium outline-none transition-all`}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#00B2D6]">
                      <Calendar size={20} />
                    </div>
                  </div>
                  {errors.dateRequired && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.dateRequired}</p>}
                </div>

                {/* Start Time Required */}
                <div>
                  <label htmlFor="startTimeRequired" className="block text-[#0F2E4A] font-extrabold text-sm sm:text-[15px] mb-2">
                    Start Time Required
                  </label>
                  <input
                    type="text"
                    id="startTimeRequired"
                    name="startTimeRequired"
                    value={formData.startTimeRequired}
                    onChange={handleInputChange}
                    placeholder="AM / PM"
                    className={`w-full bg-white border ${errors.startTimeRequired ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-[#00B2D6] focus:ring-[#00B2D6]/10"
                      } rounded-xl px-4 py-3 text-[#0F2E4A] font-medium placeholder-slate-400 text-sm sm:text-base outline-none transition-all`}
                  />
                  {errors.startTimeRequired && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.startTimeRequired}</p>}
                </div>

                {/* Does the room meet size requirements? */}
                <div>
                  <label className="block text-[#0F2E4A] font-extrabold text-sm sm:text-[15px] mb-3">
                    Does the room meet the size requirements stipulated?
                  </label>
                  <div className="flex items-center gap-6">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, roomSizeMet: "yes" }))}
                      className="flex items-center gap-2.5 group outline-none"
                    >
                      <div className={`w-5 h-5 rounded-full border ${formData.roomSizeMet === "yes"
                          ? "border-[#00B2D6] bg-white flex items-center justify-center"
                          : "border-slate-300 bg-white"
                        } transition-all duration-200`}>
                        {formData.roomSizeMet === "yes" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#00B2D6]" />
                        )}
                      </div>
                      <span className="text-slate-600 font-bold text-sm sm:text-base group-hover:text-[#0F2E4A] transition-colors">
                        Yes
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, roomSizeMet: "no" }))}
                      className="flex items-center gap-2.5 group outline-none"
                    >
                      <div className={`w-5 h-5 rounded-full border ${formData.roomSizeMet === "no"
                          ? "border-[#00B2D6] bg-white flex items-center justify-center"
                          : "border-slate-300 bg-white"
                        } transition-all duration-200`}>
                        {formData.roomSizeMet === "no" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#00B2D6]" />
                        )}
                      </div>
                      <span className="text-slate-600 font-bold text-sm sm:text-base group-hover:text-[#0F2E4A] transition-colors">
                        No
                      </span>
                    </button>
                  </div>
                </div>

                {/* Is on-site parking available? */}
                <div>
                  <label className="block text-[#0F2E4A] font-extrabold text-sm sm:text-[15px] mb-3">
                    Is On-site Parking Available?
                  </label>
                  <div className="flex items-center gap-6">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, parkingAvailable: "yes" }))}
                      className="flex items-center gap-2.5 group outline-none"
                    >
                      <div className={`w-5 h-5 rounded-full border ${formData.parkingAvailable === "yes"
                          ? "border-[#00B2D6] bg-white flex items-center justify-center"
                          : "border-slate-300 bg-white"
                        } transition-all duration-200`}>
                        {formData.parkingAvailable === "yes" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#00B2D6]" />
                        )}
                      </div>
                      <span className="text-slate-600 font-bold text-sm sm:text-base group-hover:text-[#0F2E4A] transition-colors">
                        Yes
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, parkingAvailable: "no" }))}
                      className="flex items-center gap-2.5 group outline-none"
                    >
                      <div className={`w-5 h-5 rounded-full border ${formData.parkingAvailable === "no"
                          ? "border-[#00B2D6] bg-white flex items-center justify-center"
                          : "border-slate-300 bg-white"
                        } transition-all duration-200`}>
                        {formData.parkingAvailable === "no" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#00B2D6]" />
                        )}
                      </div>
                      <span className="text-slate-600 font-bold text-sm sm:text-base group-hover:text-[#0F2E4A] transition-colors">
                        No
                      </span>
                    </button>
                  </div>
                </div>

                {/* Any further or special requirements? */}
                <div>
                  <label htmlFor="specialRequirements" className="block text-[#0F2E4A] font-extrabold text-sm sm:text-[15px] mb-2">
                    Any further or special requirements?
                  </label>
                  <textarea
                    id="specialRequirements"
                    name="specialRequirements"
                    rows={4}
                    value={formData.specialRequirements}
                    onChange={handleInputChange}
                    placeholder="e.g. call site contact 10 minutes prior to arrival, security key to gain access to site..."
                    className="w-full bg-white border border-slate-200 focus:border-[#00B2D6] focus:ring-[#00B2D6]/10 rounded-xl px-4 py-3 text-[#0F2E4A] font-medium placeholder-slate-400 text-sm sm:text-base outline-none transition-all resize-none"
                  />
                </div>

                {/* Action buttons stacked vertically */}
                <div className="flex flex-col gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-full inline-flex items-center justify-center rounded-full border border-[#00B2D6] py-3.5 font-bold text-[#00B2D6] hover:bg-[#00B2D6]/5 transition-all text-sm sm:text-base"
                    disabled={isSubmitting}
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center rounded-full bg-[#00B2D6] py-3.5 font-bold text-white transition-all duration-300 hover:bg-[#0092B3] shadow-[0_4px_14px_rgba(0,178,214,0.15)] text-sm sm:text-base disabled:opacity-85"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

      </div>
      <AnimatePresence>
        {showAuthPrompt && (
          <motion.div
            key="onsite-auth-prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F2E4A]/45 px-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="onsite-auth-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-[460px] rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(15,46,74,0.18)] sm:p-8"
            >
              <h3 id="onsite-auth-title" className="mb-3 text-2xl font-extrabold text-[#0F2E4A]">
                Continue as an organizer
              </h3>
              <p className="mb-6 text-sm font-medium leading-relaxed text-[#55697A] sm:text-base">
                Your first step details are saved. Please log in or register as an organizer to continue to the site details step.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => goToAuth("/login")}
                  className="w-full rounded-full bg-[#00B2D6] py-3.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(0,178,214,0.15)] transition-all hover:bg-[#0092B3] sm:text-base"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => goToAuth("/register")}
                  className="w-full rounded-full border border-[#00B2D6] py-3.5 text-sm font-bold text-[#00B2D6] transition-all hover:bg-[#00B2D6]/5 sm:text-base"
                >
                  Register
                </button>
                <button
                  type="button"
                  onClick={() => setShowAuthPrompt(false)}
                  className="w-full rounded-full py-2.5 text-sm font-bold text-slate-500 transition-all hover:text-[#0F2E4A]"
                >
                  Continue Editing
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
