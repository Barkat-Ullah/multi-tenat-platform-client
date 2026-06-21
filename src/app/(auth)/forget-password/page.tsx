/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, ChevronLeft } from "lucide-react";
import logoImg from "@/assets/logo/logo.png";
import { useForgatPasswordMutation } from "@/redux/service/auth/authApi";

const ForgotPasswordPage = () => {
  const [forgatPassword, { isLoading }] = useForgatPasswordMutation();
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgatPassword({ email }).unwrap();
      toast.success("Please check your email!");
      localStorage.setItem("email", email);
      router.push("/otp");
    } catch (error: any) {
      const msg =
        error?.data?.message ||
        error?.error ||
        error?.message ||
        "Something went wrong";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F6] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans select-none">
      <div className="w-full max-w-[480px]">
        {/* Main Forget Password Card */}
        <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-6 sm:p-8">
          
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

          {/* Back to login */}
          <div className="mb-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#55697A] hover:text-[#0F2E4A] transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to login
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F2E4A] tracking-tight mb-4">
            Forget Password
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
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
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] transition-all text-sm font-semibold text-[#0F2E4A] placeholder-slate-400"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Description Text */}
            <p className="text-xs font-semibold text-[#55697A] leading-relaxed">
              Don&apos;t worry, happens to all of us. Enter your email below to recover your password
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00B2D6] hover:bg-[#0092B0] text-white font-bold py-3 px-6 rounded-full transition-all text-base shadow-sm hover:shadow-md active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? "Sending Code..." : "Send Code"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;