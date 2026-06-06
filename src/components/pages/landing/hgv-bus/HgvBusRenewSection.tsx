import type { HgvBusRenewData } from "@/app/data/HgvBusMedicalData";

interface HgvBusRenewSectionProps {
  data: HgvBusRenewData;
}

export default function HgvBusRenewSection({ data }: HgvBusRenewSectionProps) {
  return (
    <section className="bg-[#FAFAFA] py-16 sm:py-20 lg:py-28 poppins">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        
        <h2 className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-[#0F2E4A] tracking-tight leading-tight mb-4 sm:mb-6">
          {data.title}
        </h2>
        
        <p className="text-[#00B2D6] font-medium text-sm sm:text-base mb-10 lg:mb-12 leading-relaxed max-w-3xl">
          {data.subtitle}
        </p>

        <div className="space-y-6 lg:space-y-8">
          {data.paragraphs.map((paragraph, index) => (
            <p 
              key={index} 
              className="text-[#55697A] text-sm sm:text-base leading-loose whitespace-pre-line"
            >
              {paragraph}
            </p>
          ))}
        </div>

      </div>
    </section>
  );
}
