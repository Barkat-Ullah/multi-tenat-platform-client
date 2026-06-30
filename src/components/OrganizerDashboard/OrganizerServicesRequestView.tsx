"use client";

import React, { useState } from "react";
import { toast } from "sonner";

export default function OrganizerServicesRequestView() {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [numberOfDriver, setNumberOfDriver] = useState("");
  const [servicesName, setServicesName] = useState("HGV bus Services");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !email.trim() || !phone.trim() || !location.trim() || !numberOfDriver.trim()) {
      toast.error("Please fill in all details before submitting.");
      return;
    }

    toast.success(`Service request submitted successfully for ${companyName}!`);
    
    // Reset Form
    setCompanyName("");
    setEmail("");
    setPhone("");
    setLocation("");
    setNumberOfDriver("");
    setServicesName("HGV bus Services");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          Service Request
        </h1>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl text-xs sm:text-sm text-[#0F2E4A] font-sans">
        
        {/* Full-width: Company Name */}
        <div>
          <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
            Company Name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="ABC Logistics Ltd"
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B2D6] text-xs sm:text-sm font-semibold text-[#0F2E4A] placeholder-slate-400"
          />
        </div>

        {/* Row 2 Grid: Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example2345@gmail.com"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B2D6] text-xs sm:text-sm font-semibold text-[#0F2E4A] placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
              Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0161 123 4567"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B2D6] text-xs sm:text-sm font-semibold text-[#0F2E4A] placeholder-slate-400"
            />
          </div>
        </div>

        {/* Full-width: Location */}
        <div>
          <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B2D6] text-xs sm:text-sm font-semibold text-[#0F2E4A] placeholder-slate-400"
          />
        </div>

        {/* Row 4 Grid: Number Of Driver & Services Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
              Number Of Driver
            </label>
            <input
              type="text"
              value={numberOfDriver}
              onChange={(e) => setNumberOfDriver(e.target.value)}
              placeholder="20"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B2D6] text-xs sm:text-sm font-semibold text-[#0F2E4A] placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
              Services Name
            </label>
            <select
              value={servicesName}
              onChange={(e) => setServicesName(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B2D6] text-xs sm:text-sm font-semibold text-[#0F2E4A] select-arrow"
            >
              <option>HGV bus Services</option>
              <option>Taxi Medicals</option>
              <option>HGV D4 Medicals</option>
              <option>Vision Assessment</option>
            </select>
          </div>
        </div>

        {/* Submit Button (Left-Aligned pill) */}
        <div className="pt-2">
          <button
            type="submit"
            className="px-8 py-2.5 bg-[#00B2D6] hover:bg-[#009cb9] rounded-full text-white font-extrabold text-xs sm:text-sm tracking-wide transition-all active:scale-[0.98] shadow-md shadow-cyan-100/50 border-none outline-none cursor-pointer"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
