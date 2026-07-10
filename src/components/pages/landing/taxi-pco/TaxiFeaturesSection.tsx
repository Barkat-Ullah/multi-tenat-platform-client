import { Calendar, ClipboardList, CarFront, Stethoscope, Divide } from "lucide-react";
import type { TaxiFeatureItem } from "@/app/data/TaxiMedicalData";

const iconMap: Record<string, any> = {
  Calendar,
  ClipboardList,
  CarFront,
  Stethoscope,
};

interface TaxiFeaturesSectionProps {
  features: TaxiFeatureItem[];
}

export default function TaxiFeaturesSection({ features }: TaxiFeaturesSectionProps) {
  return (
    <section className="bg-white py-12 md:py-16 lg:py-20 poppins border-b border-slate-100">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.iconName] || Stethoscope;
            
            return (
              <div 
                key={index} 
                className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col items-center text-center shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
              >
                {/* Icon Wrapper */}
                <div className="w-[68px] h-[68px] rounded-full bg-[#E6F8FC] flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-[#00B2D6] stroke-[2]" />
                </div>
                
                {/* Text Content */}
                <h3 className="text-[17px] font-bold text-[#4B5563] mb-3 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-[14px] text-slate-500 leading-relaxed max-w-[240px]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
