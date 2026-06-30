"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { ChevronRight, Save, Eye, EyeOff } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import {
  useGetProfileDataQuery,
  useUpdateProfileDataMutation,
} from "@/redux/service/profile/profileApi";
import { useChangePasswordMutation } from "@/redux/service/auth/authApi";
import { getImageUrl } from "@/utils/getImageUrl";
import { toast } from "sonner";

export default function OrganizerSettingsView() {
  const { data: profileResponse, isLoading: isProfileLoading } =
    useGetProfileDataQuery();
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileDataMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  // Tab State: "profile" | "password"
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  // Profile Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Password Form States
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Hidden File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync API data to local states
  useEffect(() => {
    if (profileResponse?.data) {
      const u = profileResponse.data;
      setName(u.profile.name || "");
      setEmail(u.email || "");
      setPhone(u.profile.phone || "");
      setImagePreview(u.profile.avatar || null);
      setAvatarFile(null);
    }
  }, [profileResponse]);

  // Handle Photo selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File is too large. Max size is 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setAvatarFile(file);
    }
  };

  // Remove Photo handler
  const handleRemovePhoto = () => {
    setImagePreview(null);
    setAvatarFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.info("Photo removed. Remember to save changes.");
  };

  // Save profile changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      const payload = {
        name,
        phone,
      };

      formData.append("data", JSON.stringify(payload));
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      } else if (!imagePreview) {
        formData.append("avatar", "");
      }

      const res = await updateProfile(formData).unwrap();
      toast.success(res?.message || "Profile updated successfully!");
    } catch (err: any) {
      console.error("Save profile error:", err);
      toast.error(err?.data?.message || "Failed to save profile changes.");
    }
  };

  // Save password changes
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword.trim()) {
      toast.error("Old password is required.");
      return;
    }
    if (!newPassword.trim()) {
      toast.error("New password is required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      const payload = {
        oldPassword,
        newPassword,
      };
      const res = await changePassword(payload).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res?.message || "Password change failed.");
      }
    } catch (err: any) {
      console.error("Password change error:", err);
      toast.error(err?.data?.message || "Failed to change password.");
    }
  };

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  // Resolve avatar preview URL
  const resolvedAvatar = imagePreview
    ? imagePreview.startsWith("data:")
      ? imagePreview
      : getImageUrl(imagePreview)
    : null;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">
      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
        Settings
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
        {/* Left Sidebar Menu */}
        <aside className="w-full lg:w-[280px] shrink-0 bg-white border border-slate-100/90 rounded-3xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
          <h2 className="text-[#0F2E4A] text-sm sm:text-base font-extrabold font-poppins mb-4 px-2">
            Settings
          </h2>
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all border-none outline-none cursor-pointer ${
                activeTab === "profile"
                  ? "bg-[#00B2D6] text-white shadow-md shadow-cyan-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-[#0F2E4A] bg-transparent"
              }`}
            >
              <span>Profile</span>
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all border-none outline-none cursor-pointer ${
                activeTab === "password"
                  ? "bg-[#00B2D6] text-white shadow-md shadow-cyan-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-[#0F2E4A] bg-transparent"
              }`}
            >
              <span>Change Password</span>
              <ChevronRight size={16} />
            </button>
          </nav>
        </aside>

        {/* Right Content Form Block */}
        <main className="flex-1 bg-white border border-slate-100/90 p-6 sm:p-8 md:p-10 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.01)] w-full">
          {activeTab === "profile" ? (
            /* PROFILE TAB PANEL */
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <h2 className="text-[#0F2E4A] text-lg sm:text-xl font-extrabold font-poppins pb-2">
                Profile
              </h2>

              {/* Photo Upload Area */}
              <div className="space-y-3">
                <span className="block text-xs font-bold text-[#0F2E4A] font-sans">
                  Photo
                </span>
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Circular Avatar */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                    {resolvedAvatar ? (
                      <Image
                        src={resolvedAvatar}
                        alt="Profile avatar"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-3xl">👤</div>
                    )}
                  </div>

                  {/* Upload Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#00B2D6] hover:bg-[#009cb9] text-white px-4 py-2 rounded-full font-bold text-xs transition-all cursor-pointer border-none outline-none"
                    >
                      Change Photo
                    </button>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="border border-[#00B2D6] hover:bg-slate-50 text-[#00B2D6] bg-white px-4 py-2 rounded-full font-bold text-xs transition-all cursor-pointer outline-none"
                    >
                      Remove
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Input Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Osama Organizer"
                    className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-xs sm:text-sm text-[#0F2E4A] placeholder-slate-400 font-semibold transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    placeholder="example2345@gmail.com"
                    className="w-full px-4 py-3.5 border border-slate-100 rounded-2xl bg-slate-50 text-xs sm:text-sm text-slate-400 font-semibold cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              <div className="w-full">
                <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
                  Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g., 07700 900555"
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-xs sm:text-sm text-[#0F2E4A] placeholder-slate-400 font-semibold transition-all"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="bg-[#00B2D6] hover:bg-[#009cb9] text-white px-7 py-3 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md shadow-cyan-100/50 cursor-pointer border-none outline-none active:scale-[0.98] disabled:opacity-60"
                >
                  {isUpdatingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            /* CHANGE PASSWORD TAB PANEL */
            <form onSubmit={handleSavePassword} className="space-y-6">
              <h2 className="text-[#0F2E4A] text-lg sm:text-xl font-extrabold font-poppins pb-2">
                Change Password
              </h2>

              {/* Password Inputs */}
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
                    Old Password
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="********"
                      className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-xs sm:text-sm text-[#0F2E4A] placeholder-slate-400 font-semibold transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none outline-none cursor-pointer"
                    >
                      {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="********"
                      className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-xs sm:text-sm text-[#0F2E4A] placeholder-slate-400 font-semibold transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none outline-none cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="********"
                      className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-xs sm:text-sm text-[#0F2E4A] placeholder-slate-400 font-semibold transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none outline-none cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="bg-[#00B2D6] hover:bg-[#009cb9] text-white px-7 py-3 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md shadow-cyan-100/50 cursor-pointer border-none outline-none active:scale-[0.98] disabled:opacity-60"
                >
                  {isChangingPassword ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
