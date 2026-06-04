/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import React, { useState } from "react";
import bg from "@/assets/auth/Secure login-amico 1.png";
import Link from "next/link";
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="container min-h-[90vh] flex items-center justify-center py-10">
        <div className="flex flex-col md:flex-row items-center gap-12 max-w-7xl w-full p-8">
          {/* Left Side - Illustration */}
          <div className="md:w-1/2 flex items-center justify-center">
            <Link href="/" className="w-full max-w-md">
              <Image
                width={600}
                height={400}
                src={bg}
                alt="Login illustration"
                className=""
              />
            </Link>
          </div>

          {/* Right Side - Login Form */}
          <div className="md:w-1/2">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Login Now</h1>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Sign in to your account</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="jane.doe@gmail.com"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.307-3.503M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3l18 18"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>

                  <div className="mt-1 text-right">
                    <Link href="/forget-password" className="text-sm text-blue-600 hover:text-blue-800">
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#004E60] hover:bg-[#003d4d] text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                >
                  {isLoading ? "Logging in..." : "Log In"}
                </button>


                <div className="grid grid-cols-2 gap-3">
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
                      className="flex flex-col items-center justify-center p-2 border border-gray-200 rounded-md hover:border-[#004E60] hover:bg-gray-50 transition-all duration-200 group"
                    >
                      <span className="text-xs font-semibold text-gray-500 group-hover:text-[#004E60]">Login as</span>
                      <span className="text-sm font-bold text-[#004E60]">{guest.role}</span>
                    </button>
                  ))}
                </div>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-green-600 hover:text-green-800 font-medium">
                  Register Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
