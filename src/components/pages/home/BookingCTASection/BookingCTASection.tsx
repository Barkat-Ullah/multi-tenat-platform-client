"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import bookingBgLeft from "@/assets/home/bookingBgLeft.png";
import bookingBgRight from "@/assets/home/bookingBgRight.png";

export default function BookingCTASection() {
  return (
    <section className="py-14 sm:py-16 md:py-24 bg-[#FCFDFE] poppins relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Main Card Wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full rounded-3xl sm:rounded-[2.5rem] bg-white border border-[#00B2D6]/10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden py-12 sm:py-16 px-5 sm:px-12 md:py-24 text-center"
        >

          {/* Top-Left Glowing Flourish PNG */}
          <div className="absolute top-0 -left-24 sm:-left-16 w-[240px] sm:w-[380px] md:w-[480px] aspect-square pointer-events-none select-none opacity-80 sm:opacity-100">
            <Image
              src={bookingBgLeft}
              alt="Booking left background glow flourish"
              fill
              className="object-contain object-top-left"
              sizes="(max-width: 768px) 280px, 480px"
              priority
            />
          </div>

          {/* Bottom-Right Glowing Flourish PNG */}
          <div className="absolute bottom-0 -right-24 sm:-right-5 w-[240px] sm:w-[380px] md:w-[480px] aspect-square pointer-events-none select-none opacity-80 sm:opacity-100">
            <Image
              src={bookingBgRight}
              alt="Booking right background glow flourish"
              fill
              className="object-contain object-bottom-right"
              sizes="(max-width: 768px) 280px, 480px"
              priority
            />
          </div>

          {/* Card Content Area */}
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-extrabold text-[#0F2E4A] tracking-tight leading-tight mb-5 max-w-2xl">
              Book Your Driver Medical Now
            </h2>

            {/* Description */}
            <p className="text-[#55697A] text-sm sm:text-base md:text-lg font-medium leading-relaxed mb-10 max-w-2xl">
              Book your driver medical online in minutes. Choose a time and get instant confirmation. Or call <span className="text-[#0F2E4A] font-semibold">020 3963 9083</span>.
            </p>

            {/* Action Button */}
            <div>
              <Link
                href="/booking"
                className="inline-flex items-center justify-between rounded-full bg-[#00B2D6] pl-7 sm:pl-8 pr-2 py-2 font-sans font-bold text-white transition-all hover:bg-[#0092B3] group shadow-md hover:shadow-lg hover:scale-105 active:scale-95 duration-200"
              >
                <span className="text-sm sm:text-base font-semibold tracking-wide mr-6">Book Now</span>
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#00B2D6] group-hover:translate-x-0.5 transition-transform duration-200">
                  <ArrowRight size={18} strokeWidth={2.5} />
                </div>
              </Link>
            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}
