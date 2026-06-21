import React from "react";
import { Phone, Star } from "lucide-react";
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";

export const TopBar = () => {
  return (
    <div className="w-full bg-[#E5F9FD] border-b border-[#D8F3F7] hidden xl:block">
      <div className="container mx-auto grid h-[60px] grid-cols-3 items-center px-8">
        {/* Left: Phone */}
        <a
          href="tel:02039855800"
          className="flex items-center gap-3 justify-self-start text-[18px] font-medium leading-none text-[#1F5662] transition-colors hover:text-[#00B2D6]"
        >
          <Phone size={17} strokeWidth={2.4} />
          <span>020 3985 5800</span>
        </a>
        
        {/* Center: Trustpilot */}
        <div className="flex h-full flex-col items-center justify-center justify-self-center">
          <div className="flex items-center gap-3 leading-none pt-3">
            <Star size={22} className="fill-[#00B67A] text-[#00B67A]" />
            <span className="text-[18px] font-semibold leading-none text-[#111827]">
              Trust Pilot
            </span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex h-[22px] w-[22px] items-center justify-center rounded-[3px] bg-[#00B67A]"
                >
                  <Star size={15} className="fill-white text-white" />
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-[13px] font-semibold leading-none text-[#111827]">
            Excellent
          </p>
        </div>
        
        {/* Right: Socials */}
        <div className="flex items-center gap-4 justify-self-end text-[#006173]">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#00B2D6]" aria-label="Facebook">
            <FaFacebook size={20} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#00B2D6]" aria-label="X">
            <FaXTwitter size={20} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#00B2D6]" aria-label="Instagram">
            <FaInstagram size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};
export default TopBar;
