import React from "react";
import Image from "next/image";
import logoImg from "@/assets/logo/logo.png";

export const Logo = () => (
  <div className="flex items-center select-none">
    <Image
      src={logoImg}
      alt="Compliance Medicals Logo"
      priority
      className="h-[40px] w-auto object-contain"
    />
  </div>
);
