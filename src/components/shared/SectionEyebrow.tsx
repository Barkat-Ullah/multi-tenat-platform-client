import { Sparkles } from "lucide-react";
import type React from "react";

interface SectionEyebrowProps {
  children: React.ReactNode;
  align?: "center" | "start";
  className?: string;
}

export default function SectionEyebrow({
  children,
  align = "center",
  className = "",
}: SectionEyebrowProps) {
  const justifyClass = align === "start" ? "justify-start" : "justify-center";

  return (
    <div className={`mb-4 flex items-center gap-4 ${justifyClass} ${className}`}>
      <div className="flex origin-center rotate-180 items-center gap-0">
        <div className="h-1.5 w-1.5 rounded-full bg-[#00B2D6]" />
        <div className="h-[1.5px] w-8 bg-gradient-to-r from-[#00B2D6] to-[#00B2D6]/20 sm:w-16" />
      </div>

      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#00B2D6] sm:text-sm">
        <Sparkles className="h-3.5 w-3.5" />
        <span>{children}</span>
      </div>

      <div className="flex origin-center rotate-180 items-center gap-0">
        <div className="h-[1.5px] w-8 bg-gradient-to-l from-[#00B2D6] to-[#00B2D6]/20 sm:w-16" />
        <div className="h-1.5 w-1.5 rounded-full bg-[#00B2D6]" />
      </div>
    </div>
  );
}
