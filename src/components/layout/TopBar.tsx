import { Phone } from "lucide-react";
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";

import Image from "next/image";
import trustpilotImg from "@/assets/logo/trustpilot.png";

export const TopBar = () => {
  return (
    <div className="w-full h-[45px] overflow-hidden bg-[#E5F9FD] border-b border-[#D8F3F7] hidden xl:block">
      <div className="container mx-auto grid h-[45px] grid-cols-3 items-center px-8">
        {/* Left: Phone */}
        <a
          href="tel:02039855800"
          className="flex items-center gap-3 justify-self-start text-[18px] font-medium leading-none text-[#1F5662] transition-colors hover:text-[#00B2D6]"
        >
          <Phone size={17} strokeWidth={2.4} />
          <span>020 3985 5800</span>
        </a>
        
        {/* Center: Trustpilot */}
        <div className="flex h-full items-center justify-center justify-self-center">
          <Image
            src={trustpilotImg}
            alt="Trustpilot Rating"
            priority
            className="h-[35px] w-auto object-contain"
          />
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
