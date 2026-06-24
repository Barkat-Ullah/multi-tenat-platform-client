"use client";

import React from "react";
import { Bell } from "lucide-react";

interface NotificationItemProps {
  title: string;
  location: string;
  time: string;
}

export default function NotificationItem({ title, location, time }: NotificationItemProps) {
  return (
    <div className="flex items-center justify-between p-5 bg-white border border-slate-100/80 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.01)] transition-all hover:shadow-[0_4px_25px_rgba(0,0,0,0.025)] hover:border-slate-200/60">
      <div className="flex items-center gap-4">
        {/* Bell Icon in Rounded Teal Box */}
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#E6FAFF] text-[#00B2D6] shrink-0">
          <Bell size={22} className="stroke-[2.25]" />
        </div>
        
        {/* Title and Hospital Location */}
        <div>
          <h3 className="text-[15px] sm:text-base font-bold text-[#0F2E4A] leading-tight font-sans">
            {title}
          </h3>
          <p className="text-xs sm:text-[13px] font-semibold text-slate-400 mt-1 font-sans">
            {location}
          </p>
        </div>
      </div>
      
      {/* Timestamp */}
      <span className="text-xs sm:text-[13px] font-semibold text-slate-400 font-sans whitespace-nowrap ml-4">
        {time}
      </span>
    </div>
  );
}
