/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import logoImg from "@/assets/logo/logo.png";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useLoginUserMutation } from "@/redux/service/auth/authApi";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setUser } from "@/redux/features/auth";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { getDashboardPathByRole, normalizeRole, type BackendRole } from "@/utils/roles";
import {
  BOOKING_AUTH_RETURN_KEY,
  clearBookingResume,
} from "@/utils/bookingResume";
import {
  ONSITE_REQUEST_AUTH_RETURN_KEY,
  clearOnSiteRequestResume,
} from "@/utils/onSiteRequestResume";
import AuthBackButton from "@/components/auth/AuthBackButton";

// Define or import this type to match your JWT payload
interface UserType {
  id: string;
  email: string;
  role: BackendRole;
  iat: number;
  exp: number;
}

const BOOKING_ALLOWED_ROLES = new Set(["USER", "ADMIN", "SUPERADMIN"]);

const canCompleteBooking = (role?: string | null) =>
  Boolean(role && BOOKING_ALLOWED_ROLES.has(role));

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isBookingAuth, setIsBookingAuth] = useState(false);
  const [login, { isLoading }] = useLoginUserMutation();

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setIsBookingAuth(Boolean(sessionStorage.getItem(BOOKING_AUTH_RETURN_KEY)));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = { email, password };
      const res = await login(payload).unwrap();

      if (res?.success) {
        if (!res.data) {
          toast.info(res.message || "Please verify your account.");
          // If the message contains 'verify', we can redirect to OTP page
          if (res.message?.toLowerCase().includes("verify")) {
            localStorage.setItem("email", email);
            localStorage.setItem("authFlow", "registration");
            router.push(`/otp?email=${encodeURIComponent(email)}`);
          }
          return;
        }

        const { accessToken, refreshToken } = res.data;
        if (!accessToken) {
          toast.error("Login response did not include an access token.");
          return;
        }

        // Decode user from accessToken
        let decodedUser: UserType | null = null;
        decodedUser = jwtDecode<UserType>(accessToken);
        decodedUser = {
          ...decodedUser,
          role: normalizeRole(decodedUser.role),
        };

        // Dispatch to Redux
        dispatch(
          setUser({
            user: decodedUser,
            accessToken,
            refreshToken: refreshToken || null,
          })
        );

        // Save tokens to cookies
        const accessTokenExpiry = new Date(decodedUser.exp * 1000); // convert seconds → ms
        const refreshTokenExpiry = new Date();
        refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 30); // 30 days
        Cookies.set("accessToken", accessToken, { expires: accessTokenExpiry, path: "/" });
        if (refreshToken) {
          Cookies.set("refreshToken", refreshToken, { expires: refreshTokenExpiry, path: "/" });
        }

        const bookingReturn = sessionStorage.getItem(BOOKING_AUTH_RETURN_KEY);
        const onSiteRequestReturn = sessionStorage.getItem(ONSITE_REQUEST_AUTH_RETURN_KEY);
        if (onSiteRequestReturn) {
          if (decodedUser.role === "ORGINIZER") {
            sessionStorage.removeItem(ONSITE_REQUEST_AUTH_RETURN_KEY);
            toast.success(res.message || "You have successfully logged in.");
            router.push(onSiteRequestReturn);
            return;
          }

          clearOnSiteRequestResume();
          toast.error("Only organizer accounts can submit on-site requests.");
          router.push(getDashboardPathByRole(decodedUser.role));
          return;
        }

        if (bookingReturn) {
          if (canCompleteBooking(decodedUser.role)) {
            sessionStorage.removeItem(BOOKING_AUTH_RETURN_KEY);
            toast.success(res.message || "You have successfully logged in.");
            router.push(bookingReturn);
            return;
          }

          clearBookingResume();
          toast.error("Only drivers, admins, and super admins can complete a medical booking.");
          router.push(getDashboardPathByRole(decodedUser.role));
          return;
        }

        router.push(getDashboardPathByRole(decodedUser.role));
        toast.success(res.message || "You have successfully logged in.");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "An unexpected error occurred. Please try again.";
      toast.error(errorMessage)
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F6] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans select-none">
      <div className="w-full max-w-[480px]">
        {/* Main Login Card */}
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
            Welcome Back
          </h1>

          {/* Demo Quick Login Badges */}
          <div className="flex flex-wrap gap-2 mb-5 justify-center">
            {[
              { label: "Driver", email: "driver@demo.com", password: "Demo@123", color: "bg-primary-light hover:bg-primary-dark" },
              { label: "Clinic", email: "clinic@demo.com", password: "Demo@123", color: "bg-primary-light hover:bg-primary-dark" },
              { label: "Organizer", email: "organizer@demo.com", password: "Demo@123", color: "bg-primary-light hover:bg-primary-dark" },
              { label: "Admin", email: "admin@demo.com", password: "Demo@123", color: "bg-primary-light hover:bg-primary-dark" },
              { label: "Super Admin", email: "superadmin@demo.com", password: "Demo@123", color: "bg-primary-light hover:bg-primary-dark" },
            ].map((demo) => (
              <button
                key={demo.label}
                type="button"
                onClick={() => {
                  setEmail(demo.email);
                  setPassword(demo.password);
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold text-white transition-all shadow-sm hover:shadow-md active:scale-95 ${demo.color}`}
              >
                {demo.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold text-[#55697A] uppercase tracking-wider mb-2"
              >
                Enter your email
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

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
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
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* Remember Me & Forgot Password Row */}
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
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Bottom Register Prompt */}
          <div className="mt-6 text-center text-xs sm:text-sm font-bold text-[#55697A]">
            Don&apos;t have an account?{" "}
            <Link
              href={isBookingAuth ? "/register?booking=1" : "/register"}
              className="text-[#00B2D6] hover:underline font-bold transition-all ml-1"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
