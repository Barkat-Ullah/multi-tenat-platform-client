/* eslint-disable @typescript-eslint/no-explicit-any */
// ChangePasswordForm.tsx
"use client";

import { useChangePasswordMutation } from "@/redux/service/auth/authApi";
import type React from "react";
import { useState } from "react";
import { appAlert } from "@/utils/appAlert";
import { Eye, EyeOff } from "lucide-react"; // ✅ Lucide icons

export default function ChangePasswordForm() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [changesPassword,{isLoading}] = useChangePasswordMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword.trim()) {
      setError("Current password is required");
      return;
    }

    if (!newPassword.trim()) {
      setError("New password is required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      const payload = {
        oldPassword: currentPassword,
        newPassword: newPassword,
      };

      const res = await changesPassword(payload).unwrap();

      if (res?.success) {
        appAlert.fire({
          icon: "success",
          title: "Password Updated 🎉",
          text: res?.message || "Your password has been updated.",
          position: "center",
          timer: 2000,
          showConfirmButton: false,
        });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        throw new Error(res?.message || "Update failed");
      }
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";
      appAlert.fire({
        icon: "error",
        title: "Update failed",
        text: message,
        position: "center",
        timer: 2000,
        showConfirmButton: false,
      });
      console.error("Password change error:", err);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Current Password */}
      <div>
        <label
          htmlFor="currentPassword"
          className="block text-sm font-medium text-gray-900 mb-2"
        >
          Current Password
        </label>
        <div className="relative">
          <input
            id="currentPassword"
            type={showPassword ? "text" : "password"}
            name="currentPassword"
            placeholder="Enter current password"
            value={passwordData.currentPassword}
            onChange={handleInputChange}
            className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* New Password */}
      <div>
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-gray-900 mb-2"
        >
          New Password
        </label>
        <div className="relative">
          <input
            id="newPassword"
            type={showPassword ? "text" : "password"}
            name="newPassword"
            placeholder="Enter new password"
            value={passwordData.newPassword}
            onChange={handleInputChange}
            className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-900 mb-2"
        >
          Confirm New Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm new password"
            value={passwordData.confirmPassword}
            onChange={handleInputChange}
            className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 py-2 rounded-lg transition-colors w-full sm:w-auto"
      >
{isLoading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}