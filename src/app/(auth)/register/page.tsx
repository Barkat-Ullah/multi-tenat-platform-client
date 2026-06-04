/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import React, { useState } from "react";
import bg from "@/assets/auth/Authentication-rafiki 1.png";
import Link from "next/link";
import { useLoginUserMutation, useRegisterUserMutation } from "@/redux/service/auth/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/auth";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { getDashboardPathByRole, normalizeRole } from "@/utils/roles";

interface UserType {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}
const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [register, { isLoading }] = useRegisterUserMutation();
  const [login] = useLoginUserMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = { name, email, password };
      const res = await register(payload).unwrap();
      if (res?.success === true) {
        //  SAVE EMAIL FOR OTP VERIFICATION
        localStorage.setItem("email", email);
        toast.success(res?.message || "Please verify OTP to continue.")

        router.push("/otp");
      } else {
        toast.error(res?.message || "Something went wrong.",)

      }
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMessage || "Something went wrong.",)

    }
  };


  return (
    <div className=" flex items-center justify-center p-4">
      <div className="container min-h-[90vh] flex items-center justify-center py-10">
        <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl w-full p-8">
          {/* Left Side - Illustration */}
          <div className="w-full md:w-1/2 md:flex hidden items-center justify-center">
            <div className="w-full max-w-md">
              <Image
                src={bg}
                alt="Register illustration"
                width={600}
                height={400}
                priority
              />
            </div>
          </div>

          {/* Right Side - Register Form */}
          <div className="w-full md:w-1/2">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Register Now</h1>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">
                Sign up to your account
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Patryk"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md
                      focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Email */}
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
                    placeholder="pat@shuffle.dev"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md
                      focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Password */}
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
                      placeholder="••••••••••••"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2
                        text-gray-400 hover:text-gray-600"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
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
                            d="M3 3l18 18"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19
                               c-4.478 0-8.268-2.943-9.542-7
                               a9.956 9.956 0 012.307-3.503"
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
                            d="M2.458 12C3.732 7.943 7.523 5 12 5
                               c4.478 0 8.268 2.943 9.542 7
                               -1.274 4.057-5.064 7-9.542 7
                               -4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#004E60] hover:bg-[#004E60]
    disabled:opacity-50 disabled:cursor-not-allowed
    text-white font-medium py-2 px-4 rounded-md transition"
                >
                  {isLoading ? "Registering..." : "Register"}
                </button>

                {/* Divider */}

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { role: "Admin", email: "admin@example.com" },
                      { role: "User", email: "agent@gmail.com" },
                    ].map((guest) => (
                      <button
                        key={guest.role}
                        type="button"
                        onClick={async () => {
                          const guestEmail = guest.email;
                          const guestPassword = "123456";
                          setEmail(guestEmail);
                          setPassword(guestPassword);

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
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-green-600 hover:text-green-800 font-medium"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
