"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import testimonialHero from "@/assets/home/testimonialHero.png";
import { testimonialsData } from "@/app/data/LandingPageData";

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? testimonialsData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === testimonialsData.length - 1 ? 0 : prev + 1));
  };

  // Slider animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 150 : -150,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -150 : 150,
      opacity: 0,
    }),
  };

  const currentTestimonial = testimonialsData[currentIndex];

  return (
    <section className="py-14 sm:py-20 md:py-28 bg-white poppins overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">

        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-4 mb-4">
            {/* Left Dot-Line Decorator */}
            <div className="flex items-center gap-0">
              <div className="h-1.5 w-1.5 rounded-full bg-[#00B2D6]" />
              <div className="h-[1.5px] w-8 sm:w-16 bg-gradient-to-r from-[#00B2D6] to-[#00B2D6]/20" />
            </div>
            <div className="flex items-center gap-1.5 text-[#00B2D6] font-bold text-xs sm:text-sm uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Testimonial</span>
            </div>
            {/* Right Line-Dot Decorator */}
            <div className="flex items-center gap-0">
              <div className="h-[1.5px] w-8 sm:w-16 bg-gradient-to-l from-[#00B2D6] to-[#00B2D6]/20" />
              <div className="h-1.5 w-1.5 rounded-full bg-[#00B2D6]" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0F2E4A] tracking-tight leading-tight">
            What our clients say
          </h2>
          <p className="text-[#55697A] text-sm md:text-base font-medium mt-3">
            Trusted by drivers and transport companies across the UK for fast, professional, and reliable medical services.
          </p>
        </div>

        {/* Testimonial Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-7xl mx-auto">

          {/* Left Column: Dark Slider Card */}
          <div className="lg:col-span-6 flex">
            <div className="w-full bg-[#1A2530] text-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-between items-center text-center shadow-[0_15px_45px_rgba(0,0,0,0.08)] relative overflow-hidden min-h-[340px] sm:min-h-[420px] md:min-h-[460px]">

              {/* Subtle background glow decorator */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00B2D6]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

              {/* Slider content area with animated text */}
              <div className="flex-1 flex flex-col justify-center items-center w-full relative">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="w-full flex flex-col items-center"
                  >
                    {/* User Meta (Centered) */}
                    <div className="flex flex-wrap items-center justify-center gap-1.5 text-slate-300 font-semibold text-xs sm:text-sm tracking-wide mb-6 uppercase">
                      <span>{currentTestimonial.name}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-[#00B2D6]">{currentTestimonial.role} of {currentTestimonial.company}</span>
                    </div>

                    {/* Review Content */}
                    <blockquote className="text-base sm:text-xl md:text-2xl font-medium leading-relaxed tracking-tight text-white/95 max-w-[480px]">
                      &ldquo;{currentTestimonial.content}&rdquo;
                    </blockquote>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center gap-4 mt-8 relative z-20">
                <button
                  onClick={handlePrev}
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#1A2530] hover:bg-slate-100 transition-colors shadow-md hover:scale-105 active:scale-95 duration-200"
                  aria-label="Previous testimonial"
                >
                  <ArrowLeft size={18} strokeWidth={2.5} />
                </button>
                <button
                  onClick={handleNext}
                  className="w-12 h-12 rounded-full bg-[#00B2D6] flex items-center justify-center text-white hover:bg-[#0092B3] transition-colors shadow-md hover:scale-105 active:scale-95 duration-200"
                  aria-label="Next testimonial"
                >
                  <ArrowRight size={18} strokeWidth={2.5} />
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: Hero Driver Portrait Image */}
          <div className="lg:col-span-6 flex">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative w-full aspect-[4/3] lg:aspect-auto rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-500 min-h-[260px] sm:min-h-[300px]"
            >
              <Image
                src={testimonialHero}
                alt="Happy driver client giving thumbs up"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 550px"
                priority
              />
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
