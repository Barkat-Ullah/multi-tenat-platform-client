/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import logoImg from "@/assets/logo/logo.png";
import Link from "next/link";
import { type RegisterRequest, useRegisterUserMutation } from "@/redux/service/auth/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, Mail, Phone, MapPin, Lock, Eye, EyeOff, CalendarDays } from "lucide-react";
import { BOOKING_AUTH_RETURN_KEY } from "@/utils/bookingResume";
import AuthBackButton from "@/components/auth/AuthBackButton";

const RegisterPage = () => {
  // Tab State: 'driver' | 'corporate'
  const [activeTab, setActiveTab] = useState<"driver" | "corporate">("driver");
  const [isBookingRegistration, setIsBookingRegistration] = useState(false);

  // Driver Fields
  const [driverName, setDriverName] = useState("");
  const [driverEmail, setDriverEmail] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [driverDob, setDriverDob] = useState("");
  const [driverPassword, setDriverPassword] = useState("");

  // Corporate Fields
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [companyPassword, setCompanyPassword] = useState("");

  // Visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  const [register, { isLoading }] = useRegisterUserMutation();
  const router = useRouter();
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate(),
  ).padStart(2, "0")}`;

  useEffect(() => {
    const bookingRegistration =
      new URLSearchParams(window.location.search).get("booking") === "1" ||
      Boolean(sessionStorage.getItem(BOOKING_AUTH_RETURN_KEY));

    setIsBookingRegistration(bookingRegistration);
    if (bookingRegistration) setActiveTab("driver");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload: RegisterRequest =
        activeTab === "driver"
          ? {
              fullName: driverName,
              email: driverEmail,
              phoneNumber: driverPhone,
              dob: driverDob,
              password: driverPassword,
              role: "USER",
            }
          : {
              fullName: companyName,
              email: companyEmail,
              phoneNumber: companyPhone,
              companyLocation,
              password: companyPassword,
              role: "ORGINIZER",
            };

      const res = await register(payload).unwrap();
      if (res?.success === true) {
        localStorage.setItem("email", activeTab === "driver" ? driverEmail : companyEmail);
        localStorage.setItem("authFlow", "registration");
        toast.success(res?.message || "Please verify OTP to continue.");
        router.push("/otp");
      } else {
        toast.error(res?.message || "Something went wrong.");
      }
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || err?.message || "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F6] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans select-none">
      <div className="w-full max-w-[480px]">
        {/* Main Register Card */}
        <div className="relative bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-6 sm:p-8">
          <AuthBackButton />

          {/* Logo Center */}
          <div className="flex justify-center mb-4">
            <Link href="/" className="transition-opacity hover:opacity-95">
              <Image
                src={logoImg}
                alt="Compliance Medicals Logo"
                width={280}
                height={60}
                priority
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Horizontal separator line */}
          <div className="border-t border-slate-100 my-4" />

          {/* Selector Tabs: As a Driver / As a Corporate */}
          <div className={`grid gap-4 mb-5 ${isBookingRegistration ? "grid-cols-1" : "grid-cols-2"}`}>
            <button
              type="button"
              onClick={() => {
                setActiveTab("driver");
                setShowPassword(false);
              }}
              className={`py-2.5 px-4 text-sm font-bold rounded-2xl border text-center transition-all duration-200 ${activeTab === "driver"
                  ? "bg-[#E6FAFF] border-[#00B2D6] text-[#0F2E4A]"
                  : "bg-white border-slate-200 text-[#55697A] hover:bg-slate-50/50"
                }`}
            >
              As a Driver
            </button>
            {!isBookingRegistration && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab("corporate");
                  setShowPassword(false);
                }}
                className={`py-2.5 px-4 text-sm font-bold rounded-2xl border text-center transition-all duration-200 ${activeTab === "corporate"
                    ? "bg-[#E6FAFF] border-[#00B2D6] text-[#0F2E4A]"
                    : "bg-white border-slate-200 text-[#55697A] hover:bg-slate-50/50"
                  }`}
              >
                As a Corporate
              </button>
            )}
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F2E4A] tracking-tight mb-4 text-center">
            Create An Account
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === "driver" ? (
              <>
                {/* Driver - Name */}
                <div>
                  <label
                    htmlFor="driverName"
                    className="block text-xs font-bold text-[#55697A] uppercase tracking-wider mb-2"
                  >
                    Name
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <User className="h-5 w-5" />
                    </span>
                    <input
                      type="text"
                      id="driverName"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      className="w-full pl-12 pr-4 py-2.5 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] transition-all text-sm font-semibold text-[#0F2E4A] placeholder-slate-400"
                      placeholder="Enter your Name"
                      required
                    />
                  </div>
                </div>

                {/* Driver - Email */}
                <div>
                  <label
                    htmlFor="driverEmail"
                    className="block text-xs font-bold text-[#55697A] uppercase tracking-wider mb-2"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail className="h-5 w-5" />
                    </span>
                    <input
                      type="email"
                      id="driverEmail"
                      value={driverEmail}
                      onChange={(e) => setDriverEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-2.5 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] transition-all text-sm font-semibold text-[#0F2E4A] placeholder-slate-400"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Driver - Phone */}
                <div>
                  <label
                    htmlFor="driverPhone"
                    className="block text-xs font-bold text-[#55697A] uppercase tracking-wider mb-2"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Phone className="h-5 w-5" />
                    </span>
                    <input
                      type="tel"
                      id="driverPhone"
                      value={driverPhone}
                      onChange={(e) => setDriverPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-2.5 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] transition-all text-sm font-semibold text-[#0F2E4A] placeholder-slate-400"
                      placeholder="Phone Number"
                      required
                    />
                  </div>
                </div>

                {/* Driver - Date of Birth */}
                <div>
                  <label
                    htmlFor="driverDob"
                    className="block text-xs font-bold text-[#55697A] uppercase tracking-wider mb-2"
                  >
                    Date of Birth
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <CalendarDays className="h-5 w-5" />
                    </span>
                    <input
                      type="date"
                      id="driverDob"
                      value={driverDob}
                      max={today}
                      onChange={(e) => setDriverDob(e.target.value)}
                      className="w-full pl-12 pr-4 py-2.5 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] transition-all text-sm font-semibold text-[#0F2E4A]"
                      required
                    />
                  </div>
                </div>

                {/* Driver - Password */}
                <div>
                  <label
                    htmlFor="driverPassword"
                    className="block text-xs font-bold text-[#55697A] uppercase tracking-wider mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock className="h-5 w-5" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="driverPassword"
                      value={driverPassword}
                      onChange={(e) => setDriverPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-2.5 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] transition-all text-sm font-semibold text-[#0F2E4A] placeholder-slate-400"
                      placeholder="Enter Password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Corporate - Company Name */}
                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-xs font-bold text-[#55697A] uppercase tracking-wider mb-2"
                  >
                    Company Name
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <User className="h-5 w-5" />
                    </span>
                    <input
                      type="text"
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full pl-12 pr-4 py-2.5 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] transition-all text-sm font-semibold text-[#0F2E4A] placeholder-slate-400"
                      placeholder="Enter Company Name"
                      required
                    />
                  </div>
                </div>

                {/* Corporate - Company Email */}
                <div>
                  <label
                    htmlFor="companyEmail"
                    className="block text-xs font-bold text-[#55697A] uppercase tracking-wider mb-2"
                  >
                    Company Email
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail className="h-5 w-5" />
                    </span>
                    <input
                      type="email"
                      id="companyEmail"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-2.5 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] transition-all text-sm font-semibold text-[#0F2E4A] placeholder-slate-400"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Corporate - Company Phone */}
                <div>
                  <label
                    htmlFor="companyPhone"
                    className="block text-xs font-bold text-[#55697A] uppercase tracking-wider mb-2"
                  >
                    Company Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Phone className="h-5 w-5" />
                    </span>
                    <input
                      type="tel"
                      id="companyPhone"
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-2.5 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] transition-all text-sm font-semibold text-[#0F2E4A] placeholder-slate-400"
                      placeholder="Phone Number"
                      required
                    />
                  </div>
                </div>

                {/* Corporate - Company Location */}
                <div>
                  <label
                    htmlFor="companyLocation"
                    className="block text-xs font-bold text-[#55697A] uppercase tracking-wider mb-2"
                  >
                    Company Location
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <input
                      type="text"
                      id="companyLocation"
                      value={companyLocation}
                      onChange={(e) => setCompanyLocation(e.target.value)}
                      className="w-full pl-12 pr-4 py-2.5 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] transition-all text-sm font-semibold text-[#0F2E4A] placeholder-slate-400"
                      placeholder="Enter Company Location"
                      required
                    />
                  </div>
                </div>

                {/* Corporate - Password */}
                <div>
                  <label
                    htmlFor="companyPassword"
                    className="block text-xs font-bold text-[#55697A] uppercase tracking-wider mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock className="h-5 w-5" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="companyPassword"
                      value={companyPassword}
                      onChange={(e) => setCompanyPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-2.5 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] transition-all text-sm font-semibold text-[#0F2E4A] placeholder-slate-400"
                      placeholder="Enter Password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Remember Me & Forgot Password Row (to match mockup exactly) */}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs sm:text-sm font-bold text-[#55697A]">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded-full border border-slate-300 text-[#00B2D6] focus:ring-[#00B2D6] focus:ring-offset-0 transition-all cursor-pointer accent-[#00B2D6]"
                />
                <span>Remember Me</span>
              </label>
              <Link
                href="/forget-password"
                className="text-[#00B2D6] hover:underline font-bold transition-all text-xs sm:text-sm"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00B2D6] hover:bg-[#0092B0] text-white font-bold py-3 px-6 rounded-full transition-all text-base shadow-sm hover:shadow-md active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Bottom Log In Prompt */}
          <div className="mt-6 text-center text-xs sm:text-sm font-bold text-[#55697A]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#00B2D6] hover:underline font-bold transition-all ml-1"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
