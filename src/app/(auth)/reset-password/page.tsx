/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, Eye, EyeOff } from "lucide-react";
import logoImg from "@/assets/logo/logo.png";
import { useResetPasswordMutation } from "@/redux/service/auth/authApi";

const SetNewPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const params = useSearchParams();
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  useEffect(() => {
    setEmail(params.get("email") || localStorage.getItem("email"));
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      if (!email) {
        toast.error("Email not found. Please request a new reset code.");
        return;
      }

      const payload = { email, password };
      const res = await resetPassword(payload).unwrap();

      toast.success(res?.message || "Password reset successful!");
      localStorage.removeItem("email");
      localStorage.removeItem("authFlow");
      router.push("/login");
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
        {/* Main Card */}
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

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F2E4A] tracking-tight mb-4 text-center">
            Set Up New Password
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold text-[#55697A] uppercase tracking-wider mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-2.5 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] transition-all text-sm font-semibold text-[#0F2E4A] placeholder-slate-400"
                  placeholder="Enter Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-bold text-[#55697A] uppercase tracking-wider mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-2.5 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] transition-all text-sm font-semibold text-[#0F2E4A] placeholder-slate-400"
                  placeholder="Enter Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-[#00B2D6] hover:bg-[#0092B0] text-white font-bold py-3 px-6 rounded-full transition-all text-base shadow-sm hover:shadow-md active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? "Updating..." : "Continue"}
            </button>
          </form>

          {!email && (
            <div className="mt-4 text-center text-xs font-semibold text-red-500 bg-red-50 p-2.5 rounded-xl border border-red-100">
              Email not found. Please request a new reset code.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetNewPasswordPage;
