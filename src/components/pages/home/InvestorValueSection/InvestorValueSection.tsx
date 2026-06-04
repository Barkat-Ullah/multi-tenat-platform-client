import Image from "next/image";
import Link from "next/link";
import React from 'react';

const InvestorValueSection = () => {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-10 items-center">
          <div className="w-full md:w-1/2">
            <div className="relative h-72 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hero-image.png"
                alt="Investor value"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <p className="text-white text-3xl font-bold">Immediate Exposure</p>
                <p className="text-white/80">Reduce entry risk with leased assets.</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-5">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Acquire Cash Flow. <br /> Reduce Entry Risk.
            </h2>
            <p className="text-xl text-gray-700 font-medium">
              Real estate begins investing with income stability.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              By entering assets already leased, investors eliminate the vacancy phase and gain immediate exposure to recurring cash flow.
            </p>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xl font-bold text-gray-900 mb-2 italic">You are not buying potential. <br /> You are acquiring a revenue stream.</p>
            </div>
            <Link
              href="/all-property"
              className="inline-block bg-[#3BB273] hover:bg-green-600 text-white font-bold py-3.5 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              View Available Opportunities
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestorValueSection;
