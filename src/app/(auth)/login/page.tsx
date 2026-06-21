/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import React, { useState } from "react";
import logoImg from "@/assets/logo/logo.png";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ChevronDown } from "lucide-react";
import { useLoginUserMutation } from "@/redux/service/auth/authApi";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setUser } from "@/redux/features/auth";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { getDashboardPathByRole, normalizeRole } from "@/utils/roles";

// Define or import this type to match your JWT payload
interface UserType {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginUserMutation();

  const dispatch = useDispatch();
  const router = useRouter();

  const handleBackendlessLogin = (role: string, email: string) => {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 86400 * 30; // 30 days
    const payloadObj = {
      id: `mock-${role.toLowerCase()}-id`,
      email,
      role: role.toUpperCase(),
      iat,
      exp,
    };

    const jsonStr = JSON.stringify(payloadObj);
    const base64 = btoa(unescape(encodeURIComponent(jsonStr)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${base64}.mockSignature`;
    const refreshToken = "mock-refresh-token";

    const decodedUser = {
      ...payloadObj,
      role: normalizeRole(payloadObj.role),
    };

    dispatch(
      setUser({
        user: decodedUser,
        accessToken,
        refreshToken,
      })
    );

    const accessTokenExpiry = new Date(exp * 1000);
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 30);
    Cookies.set("accessToken", accessToken, { expires: accessTokenExpiry, path: "/" });
    Cookies.set("refreshToken", refreshToken, { expires: refreshTokenExpiry, path: "/" });

    router.push(getDashboardPathByRole(decodedUser.role));
    toast.success(`Logged in as ${role} (Backendless)`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "clinic@example.com" || email === "organizer@example.com") {
      const mappedRole = email === "clinic@example.com" ? "CLINIC" : "ORGINIZER";
      handleBackendlessLogin(mappedRole, email);
      return;
    }

    try {
      const payload = { email, password };
      const res = await login(payload).unwrap();

      if (res?.success) {
        if (!res.data) {
          toast.info(res.message || "Please verify your account.");
          // If the message contains 'verify', we can redirect to OTP page
          if (res.message?.toLowerCase().includes("verify")) {
            router.push(`/otp?email=${encodeURIComponent(email)}`);
          }
          return;
        }

        const { accessToken, refreshToken } = res.data;
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
            refreshToken,
          })
        );

        // Save tokens to cookies
        const accessTokenExpiry = new Date(decodedUser.exp * 1000); // convert seconds → ms
        const refreshTokenExpiry = new Date();
        refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 30); // 30 days
        Cookies.set("accessToken", accessToken, { expires: accessTokenExpiry, path: "/" });
        Cookies.set("refreshToken", refreshToken, { expires: refreshTokenExpiry, path: "/" });

        router.push(getDashboardPathByRole(decodedUser.role));
        // Show success & redirect
        toast.success(res.message || "You have successfully logged in.")
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
            Welcome Back
          </h1>

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
              href="/register"
              className="text-[#00B2D6] hover:underline font-bold transition-all ml-1"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Collapsible Guest Account Helper (Dev Mode only) */}
        <div className="mt-6 w-full">
          <details className="group bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm">
            <summary className="flex items-center justify-between px-5 py-3 text-xs font-bold text-slate-500 cursor-pointer hover:bg-slate-50/50 list-none select-none">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00B2D6] animate-pulse" />
                Quick Logins (Development / QA)
              </span>
              <ChevronDown className="h-4 w-4 text-slate-400 transform transition-transform group-open:rotate-180" />
            </summary>
            <div className="p-4 border-t border-slate-100 bg-white grid grid-cols-2 gap-2.5">
              {[
                { role: "Admin", email: "admin@example.com" },
                { role: "User", email: "agent@gmail.com" },
                { role: "Clinic", email: "clinic@example.com" },
                { role: "Organizer", email: "organizer@example.com" },
              ].map((guest) => (
                <button
                  key={guest.role}
                  type="button"
                  onClick={async () => {
                    const guestEmail = guest.email;
                    const guestPassword = "123456";
                    setEmail(guestEmail);
                    setPassword(guestPassword);

                    if (guest.role === "Clinic" || guest.role === "Organizer") {
                      const mappedRole = guest.role === "Clinic" ? "CLINIC" : "ORGINIZER";
                      handleBackendlessLogin(mappedRole, guestEmail);
                      return;
                    }

                    try {
                      const payload = { email: guestEmail, password: guestPassword };
                      const res = await login(payload).unwrap();
                      if (res?.success) {
                        const { accessToken, refreshToken } = res.data;
                        let decodedUser: UserType | null = null;
                        decodedUser = jwtDecode<UserType>(accessToken);
                        decodedUser = {
                          ...decodedUser,
                          role: normalizeRole(decodedUser.role),
                        };
                        dispatch(setUser({ user: decodedUser, accessToken, refreshToken }));
                        const accessTokenExpiry = new Date(decodedUser.exp * 1000);
                        const refreshTokenExpiry = new Date();
                        refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 30);
                        Cookies.set("accessToken", accessToken, { expires: accessTokenExpiry, path: "/" });
                        Cookies.set("refreshToken", refreshToken, { expires: refreshTokenExpiry, path: "/" });
                        router.push(getDashboardPathByRole(decodedUser.role));
                        toast.success(`Logged in as ${guest.role}`);
                      }
                    } catch {
                      toast.error(`${guest.role} login failed.`);
                    }
                  }}
                  className="flex flex-col items-center justify-center p-2 border border-slate-200 rounded-xl hover:border-[#00B2D6] hover:bg-slate-50 transition-all duration-200 group text-center"
                >
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#00B2D6] uppercase tracking-wider">Login as</span>
                  <span className="text-xs font-bold text-[#0F2E4A] group-hover:text-[#00B2D6]">{guest.role}</span>
                </button>
              ))}
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
