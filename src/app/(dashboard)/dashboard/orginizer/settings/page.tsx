"use client";

import React, { useState } from "react";
import { Settings, Save } from "lucide-react";
import { toast } from "sonner";

export default function OrganizerSettingsPage() {
  const [name, setName] = useState("Osama Organizer");
  const [email] = useState("organizer@compliancemed.com");
  const [phone, setPhone] = useState("07700 900555");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
        Settings
      </h1>

      <div className="bg-white rounded-[24px] border border-slate-100 p-6 md:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.01)] max-w-2xl">
        <h2 className="text-[#0F2E4A] text-lg font-extrabold font-poppins pb-4 border-b border-slate-100 flex items-center gap-2">
          <Settings className="text-[#00B2D6]" />
          <span>Profile Settings</span>
        </h2>

        <form onSubmit={handleSave} className="space-y-5 mt-6">
          <div>
            <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
              First Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B2D6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-3 border border-slate-100 rounded-xl bg-slate-50 text-slate-450 cursor-not-allowed outline-none font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B2D6]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#00B2D6] hover:bg-[#009cb9] rounded-xl text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2"
          >
            <Save size={16} />
            <span>Save Profile</span>
          </button>
        </form>
      </div>
    </div>
  );
}
