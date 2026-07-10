import { FileText, Glasses, ClipboardList, Pill } from "lucide-react";
import type { HgvBusWhatToBringData } from "@/app/data/HgvBusMedicalData";
import SectionEyebrow from "@/components/shared/SectionEyebrow";

interface HgvBusWhatToBringSectionProps {
  data: HgvBusWhatToBringData;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "document":
      return <FileText className="h-6 w-6" />;
    case "glasses":
      return <Glasses className="h-6 w-6" />;
    case "clipboard":
      return <ClipboardList className="h-6 w-6" />;
    case "pills":
      return <Pill className="h-6 w-6" />;
    default:
      return <FileText className="h-6 w-6" />;
  }
};

export default function HgvBusWhatToBringSection({ data }: HgvBusWhatToBringSectionProps) {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-28 poppins relative overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
          <SectionEyebrow>{data.eyebrow}</SectionEyebrow>

          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-[#0F2E4A] tracking-tight leading-tight mb-4">
            {data.title}
          </h2>
          <p className="text-[#55697A] text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* 4-Column Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch">
          {data.items.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center px-6 py-8 sm:py-10 bg-white border border-[#00B2D6]/10 shadow-[0_4px_25px_rgba(0,0,0,0.02)] rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#00B2D6]/20"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#EBFBFF] flex items-center justify-center text-[#00B2D6] mb-6 flex-shrink-0 group-hover:scale-105 transition-transform">
                {getIcon(item.iconName)}
              </div>
              <p className="text-[#55697A] font-semibold text-sm sm:text-base leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
