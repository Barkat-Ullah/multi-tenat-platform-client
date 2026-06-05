"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Award, ShieldCheck, Clock, MapPin, Zap, Users, Sparkles } from "lucide-react";
import doctorHero from "@/assets/home/why-choose-doctor.png";
import whyChooseUsBg from "@/assets/home/whyChooseUsBg.png";
import { whyChooseUsLeftFeatures, whyChooseUsRightFeatures } from "@/app/data/LandingPageData";

export default function WhyChooseUsSection() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Award":
        return <Award className="h-5 w-5" />;
      case "ShieldCheck":
        return <ShieldCheck className="h-5 w-5" />;
      case "Clock":
        return <Clock className="h-5 w-5" />;
      case "MapPin":
        return <MapPin className="h-5 w-5" />;
      case "Zap":
        return <Zap className="h-5 w-5" />;
      case "Users":
        return <Users className="h-5 w-5" />;
      default:
        return null;
    }
  };
  return (
    <section className="py-14 sm:py-20 md:py-28 bg-[#FCFDFE] poppins relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 md:mb-24">
          <div className="flex items-center justify-center gap-4 mb-4">
            {/* Left Dot-Line Decorator */}
            <div className="flex items-center gap-0">
              <div className="h-1.5 w-1.5 rounded-full bg-[#00B2D6]" />
              <div className="h-[1.5px] w-8 sm:w-16 bg-gradient-to-r from-[#00B2D6] to-[#00B2D6]/20" />
            </div>
            <div className="flex items-center gap-1.5 text-[#00B2D6] font-bold text-xs sm:text-sm uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Why Choose Us</span>
            </div>
            {/* Right Line-Dot Decorator */}
            <div className="flex items-center gap-0">
              <div className="h-[1.5px] w-8 sm:w-16 bg-gradient-to-l from-[#00B2D6] to-[#00B2D6]/20" />
              <div className="h-1.5 w-1.5 rounded-full bg-[#00B2D6]" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0F2E4A] tracking-tight leading-tight">
            Why Choose Masters in Me?
          </h2>
          <p className="text-[#55697A] text-sm md:text-base font-medium mt-3">
            The UK's most trusted driver medical service
          </p>
        </div>

        {/* 3-Column Layout: Left Cards | Center Doctor with Background Rings | Right Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center max-w-7xl mx-auto">

          {/* Left Column (Benefits) */}
          <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8">
            {whyChooseUsLeftFeatures.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -4, boxShadow: "0 10px 30px rgba(0, 178, 214, 0.05)" }}
                className="flex items-start gap-3 sm:gap-4 px-4 sm:px-5 py-4 bg-white border border-[#00B2D6]/10 shadow-[0_4px_25px_rgba(0,0,0,0.02)] rounded-2xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-[#EBFBFF] flex items-center justify-center text-[#00B2D6] flex-shrink-0">
                  {getIcon(feature.iconName)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base md:text-lg font-bold text-[#0F2E4A]">
                    {feature.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[#55697A] font-medium mt-1 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Middle Column (Doctor Card + Animated Concentric Rings + Decorative SVGs) */}
          <div className="lg:col-span-4 flex justify-center items-center relative py-12 lg:py-0">

            {/* Concentric Circle Background Animations */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
              {/* Concentric Circle Illustration Image */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
                className="absolute w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] md:w-[540px] md:h-[540px] opacity-40"
              >
                <Image
                  src={whyChooseUsBg}
                  alt="Background illustration pattern"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 400px, 540px"
                />
              </motion.div>

              {/* Inner Dashed Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                className="absolute w-[240px] h-[240px] sm:w-[340px] sm:h-[340px] md:w-[430px] md:h-[430px] border border-dashed border-[#00B2D6]/20 rounded-full"
              />

              {/* Middle Thin Solid Ring */}
              <div className="absolute w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] border border-solid border-[#00B2D6]/5 rounded-full" />

              {/* Outer Dashed Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
                className="absolute w-[320px] h-[320px] sm:w-[460px] sm:h-[460px] md:w-[600px] md:h-[600px] border border-dashed border-[#00B2D6]/10 rounded-full"
              />
            </div>

            {/* Decorative Spiral Arrow: Top-Right */}
            <div className="absolute -top-10 -right-10 w-16 h-16 text-[#00B2D6]/80 hidden md:block select-none pointer-events-none">
              <svg viewBox="0 0 80 80" className="w-full h-full fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <motion.path
                  d="M60 20 C 50 10, 30 15, 25 30 C 20 45, 45 55, 50 40 C 55 25, 35 15, 25 20 L20 25"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                />
                <motion.path
                  d="M17 17 L22 26 L26 21"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.8 }}
                />
              </svg>
            </div>

            {/* Decorative Spiral Arrow: Bottom-Left */}
            <div className="absolute -bottom-10 left-10 w-16 h-16 text-[#00B2D6]/80 hidden md:block select-none pointer-events-none">
              <svg viewBox="0 0 80 80" className="w-full h-full fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <motion.path
                  d="M20 60 C 30 70, 50 65, 55 50 C 60 35, 35 25, 30 40 C 25 55, 45 65, 55 60 L60 55"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                />
                <motion.path
                  d="M63 63 L58 54 L54 59"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.8 }}
                />
              </svg>
            </div>

            {/* Doctor Portrait Card Wrapper */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.015 }}
              className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[2/3] rounded-[2rem] overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.06)] border border-slate-100 bg-[#EBFBFF] transition-shadow duration-500 hover:shadow-[0_20px_55px_rgba(0,0,0,0.1)] flex items-end justify-center"
            >
              <Image
                src={doctorHero}
                alt="Qualified Doctor thumbs up"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 280px, 320px"
                priority
              />
            </motion.div>
          </div>

          {/* Right Column (Benefits) */}
          <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8">
            {whyChooseUsRightFeatures.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -4, boxShadow: "0 10px 30px rgba(0, 178, 214, 0.05)" }}
                className="flex items-start gap-3 sm:gap-4 px-4 sm:px-5 py-4 sm:py-5 bg-white border border-[#00B2D6]/10 shadow-[0_4px_25px_rgba(0,0,0,0.02)] rounded-2xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-[#EBFBFF] flex items-center justify-center text-[#00B2D6] flex-shrink-0">
                  {getIcon(feature.iconName)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base md:text-lg font-bold text-[#0F2E4A]">
                    {feature.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[#55697A] font-medium mt-1 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
