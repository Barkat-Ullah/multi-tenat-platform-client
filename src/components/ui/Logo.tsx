import React from "react";

export const Logo = () => (
  <div className="flex items-center gap-2.5 select-none">
    {/* Medical Cross Icon */}
    <div className="relative w-10 h-10 flex-shrink-0">
      <svg width="40" height="40" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Outer thick cyan cross outline with rounded ends */}
        <path
          d="M19 6C19 3.79086 20.7909 2 23 2H31C33.2091 2 35 3.79086 35 6V17H46C48.2091 17 50 18.7909 50 21V29C50 31.2091 48.2091 33 46 33H35V44C35 46.2091 33.2091 48 31 48H23C20.7909 48 19 46.2091 19 44V33H8C5.79086 33 4 31.2091 4 29V21C4 18.7909 5.79086 17 8 17H19V6Z"
          stroke="#00B2D6"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Inner thin navy cross outline */}
        <path
          d="M22.5 9.5C22.5 9.22386 22.7239 9 23 9H31C31.2761 9 31.5 9.22386 31.5 9.5V20.5H42.5C42.7761 20.5 43 20.7239 43 21V29C43 29.2761 42.7761 29.5 42.5 29.5H31.5V40.5C31.5 40.7761 31.2761 41 31 41H23C22.7239 41 22.5 40.7761 22.5 40.5V29.5H11.5C11.2239 29.5 11 29.2761 11 29V21C11 20.7239 11.2239 20.5 11.5 20.5H22.5V9.5Z"
          stroke="#0F2E4A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    
    {/* Typography */}
    <div className="flex flex-col justify-center leading-none">
      <span className="font-sans font-black tracking-[0.02em] text-[20px] text-[#0F2E4A] uppercase leading-[1]">
        Compliance
      </span>
      <span className="font-sans font-semibold tracking-[0.27em] text-[10px] text-[#00B2D6] uppercase mt-0.5 flex items-center leading-[1]">
        Medic
        <span className="relative inline-flex items-center justify-center mr-[0.27em]">
          a
          <span 
            className="absolute bottom-[1.5px] left-[0.5px] w-[5px] h-[4.5px] bg-[#00B2D6]" 
            style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
          ></span>
        </span>
        ls
      </span>
    </div>
  </div>
);
