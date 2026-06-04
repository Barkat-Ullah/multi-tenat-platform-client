'use client'
import Image from "next/image";
import Link from "next/link";

export default function AboutUsSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row bg-[#F9FAFB] rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          {/* Left Content Section */}
          <div className="w-full md:w-1/2 px-8 py-12 md:py-20 lg:py-24 md:px-12 lg:px-16 flex items-center">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                iRendity Italian <br/> Real Estate
              </h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                iRendity is the first vertical marketplace dedicated exclusively to income-producing real estate in Italy. We bridge the gap between yield-oriented investors and professional agencies, offering a structured ecosystem where every asset is already leased and ready to generate cash flow from day one.
              </p>
              <Link href="/about" className="inline-block bg-[#3BB273] hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-green-500/20">
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="w-full md:w-1/2 relative h-[400px] md:h-auto overflow-hidden">
            <Image
              src="/images/hero-image.png"
              alt="Modern home with beautiful landscape"
              fill
              className="object-cover transform hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Subtle Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/5 md:block hidden"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
