import React from "react";
import { Phone, Facebook, Instagram } from "lucide-react";
import { StarIcon, XIcon } from "@/components/ui/Icons";

export const TopBar = () => {
  return (
    <div className="w-full bg-[#E5F9FD] border-b border-[#D8F3F7] py-2 hidden lg:block">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-8">
        {/* Left: Phone */}
        <div className="flex items-center gap-2 text-[14px] font-medium text-[#0F2E4A]">
          <Phone size={14} className="text-[#0F2E4A]" />
          <span>020 3985 5800</span>
        </div>
        
        {/* Center: Trustpilot */}
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-medium text-[#0F2E4A]">Trust Pilot</span>
          <div className="flex gap-1 items-center">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-[#0F2E4A] flex items-center justify-center rounded-[2px]">
                <StarIcon />
              </div>
            ))}
          </div>
        </div>
        
        {/* Right: Socials */}
        <div className="flex items-center gap-4 text-[#0F2E4A]">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#00B2D6] transition-colors">
            <Facebook size={16} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#00B2D6] transition-colors">
            <XIcon className="w-3.5 h-3.5" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#00B2D6] transition-colors">
            <Instagram size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};
export default TopBar;
