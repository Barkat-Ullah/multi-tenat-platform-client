import React from 'react';
import { Search, FileCheck, BarChart3, Users, PiggyBank } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <Search className="w-8 h-8 text-[#3BB273]" />,
      text: "Access exclusively leased properties"
    },
    {
      icon: <FileCheck className="w-8 h-8 text-[#3BB273]" />,
      text: "Review lease duration and guarantees"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-[#3BB273]" />,
      text: "Analyze yield and contract structure"
    },
    {
      icon: <Users className="w-8 h-8 text-[#3BB273]" />,
      text: "Connect directly with the listing agency"
    },
    {
      icon: <PiggyBank className="w-8 h-8 text-[#3BB273]" />,
      text: "Generate income from day one"
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">A Structured Investment Process</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-sm border border-green-100">
                {step.icon}
              </div>
              <p className="text-gray-700 font-medium px-2">{step.text}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-4 h-0.5 bg-gray-200"></div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 md:mt-12 text-center">
            <p className="text-xl font-semibold text-gray-500 italic">
                Simple. Focused. Transparent.
            </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
