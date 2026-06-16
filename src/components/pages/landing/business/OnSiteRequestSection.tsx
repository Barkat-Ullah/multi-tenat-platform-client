"use client";

import React, { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { ArrowRight, ChevronLeft, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OnSiteRequestSection() {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    hasAccount: "no",
    medicalRequired: "",
    candidatesCount: "",
    additionalServices: "",
    preferredDate: "",
    preferredTime: "Morning (09:00 - 12:00)",
    address: "",
    postcode: "",
    notes: "",
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, hasAccount: value }));
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
    if (!formData.preferredDate) newErrors.preferredDate = "Preferred date is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.postcode.trim()) newErrors.postcode = "Postcode is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: document.getElementById("request-form-section")?.offsetTop || 300, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setStep(1);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep2()) {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: document.getElementById("request-form-section")?.offsetTop || 300, behavior: "smooth" });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      businessName: "",
      hasAccount: "no",
      medicalRequired: "",
      candidatesCount: "",
      additionalServices: "",
      preferredDate: "",
      preferredTime: "Morning (09:00 - 12:00)",
      address: "",
      postcode: "",
      notes: "",
    });
    setErrors({});
    setStep(1);
    setIsSubmitted(false);
  };

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
          
          {!isSubmitted && (
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
        <div className="w-full max-w-[650px] bg-white rounded-[2rem] border border-slate-100 p-6 sm:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <AnimatePresence mode="wait">
            {isSubmitted ? (
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
                    className={`w-full bg-white border ${
                      errors.name ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-[#00B2D6] focus:ring-[#00B2D6]/10"
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
                    className={`w-full bg-white border ${
                      errors.email ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-[#00B2D6] focus:ring-[#00B2D6]/10"
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
                    className={`w-full bg-white border ${
                      errors.phone ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-[#00B2D6] focus:ring-[#00B2D6]/10"
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
                    className={`w-full bg-white border ${
                      errors.businessName ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-[#00B2D6] focus:ring-[#00B2D6]/10"
                    } rounded-xl px-4 py-3 text-[#0F2E4A] font-medium placeholder-slate-400 text-sm sm:text-base outline-none transition-all`}
                  />
                  {errors.businessName && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.businessName}</p>}
                </div>

                {/* Account check radio field */}
                <div>
                  <label className="block text-[#0F2E4A] font-extrabold text-sm sm:text-[15px] mb-3">
                    Do You have an account
                  </label>
                  <div className="flex items-center gap-6">
                    <button
                      type="button"
                      onClick={() => handleRadioChange("yes")}
                      className="flex items-center gap-2.5 group outline-none"
                    >
                      <div className={`w-5 h-5 rounded-full border ${
                        formData.hasAccount === "yes" 
                          ? "border-[#00B2D6] bg-white flex items-center justify-center" 
                          : "border-slate-300 bg-white"
                      } transition-all duration-200`}>
                        {formData.hasAccount === "yes" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#00B2D6]" />
                        )}
                      </div>
                      <span className="text-slate-600 font-bold text-sm sm:text-base group-hover:text-[#0F2E4A] transition-colors">
                        Yes
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRadioChange("no")}
                      className="flex items-center gap-2.5 group outline-none"
                    >
                      <div className={`w-5 h-5 rounded-full border ${
                        formData.hasAccount === "no" 
                          ? "border-[#00B2D6] bg-white flex items-center justify-center" 
                          : "border-slate-300 bg-white"
                      } transition-all duration-200`}>
                        {formData.hasAccount === "no" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#00B2D6]" />
                        )}
                      </div>
                      <span className="text-slate-600 font-bold text-sm sm:text-base group-hover:text-[#0F2E4A] transition-colors">
                        No
                      </span>
                    </button>
                  </div>
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
                    className={`w-full bg-white border ${
                      errors.medicalRequired ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-[#00B2D6] focus:ring-[#00B2D6]/10"
                    } rounded-xl px-4 py-3 text-[#0F2E4A] font-medium placeholder-slate-400 text-sm sm:text-base outline-none transition-all appearance-none cursor-pointer`}
                  >
                    <option value="" disabled className="text-slate-400">
                      Medical Required
                    </option>
                    <option value="D4 Medicals">D4 Medicals (HGV/PCV)</option>
                    <option value="Taxi Medicals">Taxi Medicals</option>
                    <option value="Forklift Medicals">Forklift Medicals</option>
                    <option value="Pre-Employment Medicals">Pre-Employment Medicals</option>
                    <option value="Occupational Medicals">Occupational Medicals</option>
                    <option value="Other Medicals">Other / Mixed Assessments</option>
                  </select>
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
                    className={`w-full bg-white border ${
                      errors.candidatesCount ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-[#00B2D6] focus:ring-[#00B2D6]/10"
                    } rounded-xl px-4 py-3 text-[#0F2E4A] font-medium placeholder-slate-400 text-sm sm:text-base outline-none transition-all`}
                  />
                  {errors.candidatesCount && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.candidatesCount}</p>}
                </div>

                {/* Additional Services field */}
                <div>
                  <label htmlFor="additionalServices" className="block text-[#0F2E4A] font-extrabold text-sm sm:text-[15px] mb-2">
                    Additional Services
                  </label>
                  <input
                    type="text"
                    id="additionalServices"
                    name="additionalServices"
                    value={formData.additionalServices}
                    onChange={handleInputChange}
                    placeholder="Additional Services"
                    className={`w-full bg-white border ${
                      errors.additionalServices ? "border-red-400 focus:border-[#00B2D6]/20" : "border-slate-200 focus:border-[#00B2D6] focus:ring-[#00B2D6]/10"
                    } rounded-xl px-4 py-3 text-[#0F2E4A] font-medium placeholder-slate-400 text-sm sm:text-base outline-none transition-all`}
                  />
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
              // Step 2: Preferred Booking Date, Location & Notes
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
                {/* Preferred Date picker */}
                <div>
                  <label htmlFor="preferredDate" className="block text-[#0F2E4A] font-extrabold text-sm sm:text-[15px] mb-2">
                    Preferred Clinic Date
                  </label>
                  <input
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    className={`w-full bg-white border ${
                      errors.preferredDate ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-[#00B2D6] focus:ring-[#00B2D6]/10"
                    } rounded-xl px-4 py-3 text-[#0F2E4A] font-medium placeholder-slate-400 text-sm sm:text-base outline-none transition-all`}
                  />
                  {errors.preferredDate && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.preferredDate}</p>}
                </div>

                {/* Preferred Time block selection */}
                <div>
                  <label htmlFor="preferredTime" className="block text-[#0F2E4A] font-extrabold text-sm sm:text-[15px] mb-2">
                    Preferred Time Block
                  </label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-200 focus:border-[#00B2D6] focus:ring-[#00B2D6]/10 rounded-xl px-4 py-3 text-[#0F2E4A] font-medium text-sm sm:text-base outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="Early Morning (05:00 - 09:00)">Early Morning (05:00 - 09:00)</option>
                    <option value="Morning (09:00 - 12:00)">Morning (09:00 - 12:00)</option>
                    <option value="Afternoon (12:00 - 17:00)">Afternoon (12:00 - 17:00)</option>
                    <option value="Evening (17:00 - 23:00)">Evening (17:00 - 23:00)</option>
                  </select>
                </div>

                {/* Clinic Street Address */}
                <div>
                  <label htmlFor="address" className="block text-[#0F2E4A] font-extrabold text-sm sm:text-[15px] mb-2">
                    Clinic Site Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter Clinic Site Street Address"
                    className={`w-full bg-white border ${
                      errors.address ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-[#00B2D6] focus:ring-[#00B2D6]/10"
                    } rounded-xl px-4 py-3 text-[#0F2E4A] font-medium placeholder-slate-400 text-sm sm:text-base outline-none transition-all`}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.address}</p>}
                </div>

                {/* Postcode */}
                <div>
                  <label htmlFor="postcode" className="block text-[#0F2E4A] font-extrabold text-sm sm:text-[15px] mb-2">
                    Site Postcode
                  </label>
                  <input
                    type="text"
                    id="postcode"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    placeholder="Enter Site Postcode (e.g. LS1 1UR)"
                    className={`w-full bg-white border ${
                      errors.postcode ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-[#00B2D6] focus:ring-[#00B2D6]/10"
                    } rounded-xl px-4 py-3 text-[#0F2E4A] font-medium placeholder-slate-400 text-sm sm:text-base outline-none transition-all`}
                  />
                  {errors.postcode && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.postcode}</p>}
                </div>

                {/* Additional requirements/notes */}
                <div>
                  <label htmlFor="notes" className="block text-[#0F2E4A] font-extrabold text-sm sm:text-[15px] mb-2">
                    Any specific details or notes?
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Provide any additional clinic requirement details..."
                    className="w-full bg-white border border-slate-200 focus:border-[#00B2D6] focus:ring-[#00B2D6]/10 rounded-xl px-4 py-3 text-[#0F2E4A] font-medium placeholder-slate-400 text-sm sm:text-base outline-none transition-all resize-none"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-1/3 inline-flex items-center justify-center rounded-full border border-slate-200 hover:border-slate-300 bg-white font-bold text-slate-500 hover:text-slate-700 transition-all text-sm sm:text-base"
                    disabled={isSubmitting}
                  >
                    <ChevronLeft size={18} className="mr-1" />
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-2/3 inline-flex items-center justify-center rounded-full bg-[#00B2D6] py-3.5 font-bold text-white transition-all duration-300 hover:bg-[#0092B3] shadow-[0_4px_14px_rgba(0,178,214,0.15)] text-sm sm:text-base disabled:opacity-85"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
