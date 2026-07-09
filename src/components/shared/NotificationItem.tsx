"use client";

import React from "react";
import { Bell } from "lucide-react";

interface NotificationItemProps {
  title: string;
  location: string;
  time: string;
  isRead?: boolean;
  onClick?: () => void;
}

export default function NotificationItem({
  title,
  location,
  time,
  isRead = false,
  onClick,
}: NotificationItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-3xl border border-slate-100/80 bg-white p-5 text-left shadow-[0_2px_15px_rgba(0,0,0,0.01)] transition-all hover:border-slate-200/60 hover:shadow-[0_4px_25px_rgba(0,0,0,0.025)]"
    >
      <div className="flex items-center gap-4">
        {/* Bell Icon in Rounded Teal Box */}
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E6FAFF] text-[#00B2D6]">
          <Bell size={22} className="stroke-[2.25]" />
          {!isRead && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />}
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
    </button>
  );
}
