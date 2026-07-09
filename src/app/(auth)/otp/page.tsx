/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { appAlert } from "@/utils/appAlert";
import logoImg from "@/assets/logo/logo.png";
import { useResendOtpMutation, useVerifyUserMutation } from "@/redux/service/auth/authApi";
import { toast } from "sonner";
import AuthBackButton from "@/components/auth/AuthBackButton";

const OTP_LENGTH = 4;

const OTPage = () => {
  const [otp, setOtp] = useState<string[]>(() =>
    Array.from({ length: OTP_LENGTH }, () => ""),
  );
  const [email, setEmail] = useState<string | null>(null);
  const [authFlow, setAuthFlow] = useState<"registration" | "forgot-password">("registration");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [verifyUser, { isLoading }] = useVerifyUserMutation();
  const [resendOtp, { isLoading: isResendingOtp }] = useResendOtpMutation();
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("email");
    const storedFlow = localStorage.getItem("authFlow");

    setEmail(stored);
    setAuthFlow(storedFlow === "forgot-password" ? "forgot-password" : "registration");
  }, []);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim().slice(0, OTP_LENGTH);
    if (!new RegExp(`^\\d{1,${OTP_LENGTH}}$`).test(paste)) return;

    const digits = paste.split("");
    const filled = Array.from(
      { length: OTP_LENGTH },
      (_, i) => digits[i] ?? "",
    );
    setOtp(filled);

    const nextIndex = Math.min(digits.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== OTP_LENGTH) {
      appAlert.fire({
        icon: "error",
        title: "Invalid OTP",
        text: `Please enter the ${OTP_LENGTH}-digit OTP.`,
      });
      return;
    }

    try {
      if (!email) {
        appAlert.fire({
          icon: "error",
          title: "Verification failed",
          text: "Email not found. Please register again.",
        });
        return;
      }

      const res = await verifyUser({ email, otp: otpValue }).unwrap();

      if (res?.success) {
        appAlert.fire({
          icon: "success",
          title: "Verification successful",
          text: res?.message || "Your code has been verified.",
        });

        if (authFlow === "forgot-password") {
          router.push("/reset-password");
          return;
        }

        localStorage.removeItem("email");
        localStorage.removeItem("authFlow");
        router.push("/login");
      } else {
        appAlert.fire({
          icon: "error",
          title: "Verification failed",
          text: res?.message || "Invalid OTP.",
        });
      }
    } catch (err: any) {
      appAlert.fire({
        icon: "error",
        title: "Verification failed",
        text: err?.data?.message || err?.message || "Something went wrong.",
      });
    }
  };

  const handleResendOtp = async () => {
    try {
      if (!email) {
        toast.error("Email not found. Please register again.");
        return;
      }
      await resendOtp({ email }).unwrap();
      toast.success("OTP resend success!");
    } catch (error: any) {
      const msg =
        error?.data?.message ||
        error?.error ||
        error?.message ||
        "Something went wrong. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F6] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans select-none">
      <div className="w-full max-w-[480px]">
        {/* Main Verify Code Card */}
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

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F2E4A] tracking-tight mb-4 text-center">
            Verify Code
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-[#0F2E4A] uppercase tracking-wider mb-3 text-center">
                Enter Code
              </label>
              
              {/* OTP Inputs Grid */}
              <div 
                className="flex justify-center gap-2 sm:gap-3"
                onPaste={handlePaste}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    inputMode="numeric"
                    className="w-10 h-10 sm:w-12 sm:h-12 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-center text-sm sm:text-base font-bold text-[#0F2E4A] transition-all bg-white"
                    required
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00B2D6] hover:bg-[#0092B0] text-white font-bold py-3 px-6 rounded-full transition-all text-base shadow-sm hover:shadow-md active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? "Verifying..." : "Continue"}
            </button>
          </form>

          {/* Bottom Actions */}
          <div className="mt-6 text-center text-xs sm:text-sm font-bold text-[#55697A]">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResendingOtp}
              className="text-[#00B2D6] hover:underline font-bold transition-all disabled:opacity-50 ml-1"
            >
              {isResendingOtp ? "Resending..." : "Resend again"}
            </button>
          </div>

          {!email && (
            <div className="mt-4 text-center text-xs font-semibold text-red-500 bg-red-50 p-2.5 rounded-xl border border-red-100">
              Email not found in storage. Please go back and register again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPage;
