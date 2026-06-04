import Link from "next/link";
import React from 'react';

const FinalCTASection = () => {
  return (
    <section className="py-24 md:py-36 bg-white relative overflow-hidden">
      {/* Abstract Background Element */}
      <div className="absolute top-0 right-0 w-1/4 h-full bg-[#3BB273]/5 -skew-x-12 transform origin-top-right"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-full bg-[#3BB273]/5 -skew-x-12 transform origin-bottom-left"></div>
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-[#3BB273] font-bold tracking-widest uppercase text-sm mb-6 block">
            Start your journey
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-10">
            Enter Real Estate <br className="hidden md:block" /> Through Income.
          </h2>
          <div>
            <Link
              href="/all-property"
              className="inline-block bg-[#3BB273] hover:bg-green-600 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-green-500/30 transform hover:-translate-y-1 text-xl"
            >
              Explore Income-Producing Assets
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};


export default FinalCTASection;
