"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { normalizeRole, getDashboardPathByRole } from "@/utils/roles";
import {
  ArrowRight,
  Server,
  Globe,
  Database,
  Shield,
  Lock,
  CreditCard,
  Bell,
  CalendarCheck,
  FileText,
  Users,
  Settings,
  BarChart3,
  MessageCircle,
  Truck,
  Building2,
  UserCog,
  Stethoscope,
  Smartphone,
  PieChart,
  Zap,
  Layers,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// ─── Types ───
interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// ─── Data ───
const frontendTech: FeatureCard[] = [
  {
    icon: <Globe className="w-4 h-4 xs:w-5 xs:h-5" />,
    title: "Next.js 15 + React 18",
    description:
      "Server-side rendering, App Router, Turbopack for lightning-fast development and SEO-friendly pages.",
  },
  {
    icon: <Smartphone className="w-4 h-4 xs:w-5 xs:h-5" />,
    title: "Tailwind CSS + Ant Design",
    description:
      "Utility-first styling with Ant Design component library, HeroUI, and Framer Motion animations.",
  },
  {
    icon: <Layers className="w-4 h-4 xs:w-5 xs:h-5" />,
    title: "Redux Toolkit + RTK Query",
    description:
      "State management with Redux Persist, efficient API caching, and automatic re-fetching.",
  },
  {
    icon: <BarChart3 className="w-4 h-4 xs:w-5 xs:h-5" />,
    title: "Recharts + Leaflet Maps",
    description:
      "Interactive data visualizations and map-based clinic location picker with real-time geometry.",
  },
  {
    icon: <MessageCircle className="w-4 h-4 xs:w-5 xs:h-5" />,
    title: "Real-time WebSocket",
    description:
      "Socket.io-powered live messaging between patients, clinics, and support teams.",
  },
  {
    icon: <FileText className="w-4 h-4 xs:w-5 xs:h-5" />,
    title: "TypeScript + Zod",
    description:
      "End-to-end type safety with shared validation schemas between frontend and backend.",
  },
];

const backendTech: FeatureCard[] = [
  {
    icon: <Server className="w-4 h-4 xs:w-5 xs:h-5" />,
    title: "Node.js + Express 5.x",
    description:
      "Enterprise-grade RESTful API with modular architecture, middleware pipeline, and rate limiting.",
  },
  {
    icon: <Database className="w-4 h-4 xs:w-5 xs:h-5" />,
    title: "MongoDB + Prisma 6 ORM",
    description:
      "Schema-first NoSQL database with auto-generated types, migrations, and Prisma Studio.",
  },
  {
    icon: <Zap className="w-4 h-4 xs:w-5 xs:h-5" />,
    title: "Redis + BullMQ",
    description:
      "In-memory caching with version-based invalidation and background job queue for emails/OTP.",
  },
  {
    icon: <CreditCard className="w-4 h-4 xs:w-5 xs:h-5" />,
    title: "Stripe Payments",
    description:
      "Secure payment processing with webhooks, subscription management, and payment method config.",
  },
  {
    icon: <Lock className="w-4 h-4 xs:w-5 xs:h-5" />,
    title: "JWT + OAuth 2.0",
    description:
      "JWT access/refresh tokens with blacklisting, plus Google & Facebook social login.",
  },
  {
    icon: <Shield className="w-4 h-4 xs:w-5 xs:h-5" />,
    title: "Multi-layered Security",
    description:
      "CORS, XSS sanitization, rate limiting, bcrypt encryption, and audit logging.",
  },
];

const projectFeatures: FeatureCard[] = [
  {
    icon: <CalendarCheck className="w-5 h-5 xs:w-6 xs:h-6" />,
    title: "Smart Booking System",
    description:
      "Patients book appointments with real-time slot availability. Clinics manage schedules, and organizers handle bulk requests.",
  },
  {
    icon: <FileText className="w-5 h-5 xs:w-6 xs:h-6" />,
    title: "Medical Records Management",
    description:
      "Upload, track, and manage compliance documents with secure cloud storage via S3, Cloudinary.",
  },
  {
    icon: <Bell className="w-5 h-5 xs:w-6 xs:h-6" />,
    title: "Real-time Notifications",
    description:
      "Push notifications, SSE, Firebase FCM, and in-app alerts for bookings, results, and messages.",
  },
  {
    icon: <Users className="w-5 h-5 xs:w-6 xs:h-6" />,
    title: "Multi-Tenant Role Access",
    description:
      "Five role levels: Patient, Clinic, Organizer, Admin, Super Admin — each with tailored dashboards.",
  },
  {
    icon: <Building2 className="w-5 h-5 xs:w-6 xs:h-6" />,
    title: "Organizer Portal",
    description:
      "Bulk compliance checks, driver assignment, and status tracking across all assigned personnel.",
  },
  {
    icon: <Stethoscope className="w-5 h-5 xs:w-6 xs:h-6" />,
    title: "Clinic Dashboard",
    description:
      "Manage services, locations, time slots, patient bookings, off-days, and upload examination results.",
  },
  {
    icon: <BarChart3 className="w-5 h-5 xs:w-6 xs:h-6" />,
    title: "Role-based Analytics",
    description:
      "Interactive dashboards with booking trends, top services, revenue reports, and audit trails.",
  },
  {
    icon: <Truck className="w-5 h-5 xs:w-6 xs:h-6" />,
    title: "Driver/Patient Portal",
    description:
      "Browse clinics, book appointments, view history, download receipts, and raise support tickets.",
  },
  {
    icon: <MessageCircle className="w-5 h-5 xs:w-6 xs:h-6" />,
    title: "Support Ticket System",
    description:
      "Raise, track, and manage support tickets with admin assignment and real-time status updates.",
  },
  {
    icon: <UserCog className="w-5 h-5 xs:w-6 xs:h-6" />,
    title: "Admin Controls",
    description:
      "Full user management, service/location configuration, FAQ, privacy, terms, and system settings.",
  },
  {
    icon: <PieChart className="w-5 h-5 xs:w-6 xs:h-6" />,
    title: "Super Admin Oversight",
    description:
      "Create admin accounts, global configuration, audit trails, error tracking, payment gateway setup.",
  },
  {
    icon: <Settings className="w-5 h-5 xs:w-6 xs:h-6" />,
    title: "Extensible Architecture",
    description:
      "Modular CRUD module scaffolding, shared middleware, Prisma query builder, environment-based config.",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: i * 0.04, ease: "easeOut" },
  }),
};

// ─── Component ───
export default function ShowcasePage() {
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!accessToken && !!user;
  const role = normalizeRole(user?.role);
  const dashboardHref = isAuthenticated
    ? getDashboardPathByRole(role)
    : "/login";

  const TechCard = ({ item, index }: { item: FeatureCard; index: number }) => (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20px" }}
      custom={index}
      whileHover={{ y: -2 }}
      className="group bg-white border border-[#00B2D6]/10 rounded-xl p-3 xs:p-3.5 sm:p-4 transition-all duration-300 hover:border-[#00B2D6]/30 hover:shadow-sm"
    >
      <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-lg bg-[#EBFBFF] flex items-center justify-center text-[#00B2D6] mb-2 xs:mb-2.5 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
        {item.icon}
      </div>
      <h3 className="text-xs xs:text-[13px] sm:text-sm font-bold text-[#0F2E4A] mb-0.5 xs:mb-1 leading-tight">
        {item.title}
      </h3>
      <p className="text-[10px] xs:text-[11px] sm:text-xs text-[#55697A] font-medium leading-relaxed">
        {item.description}
      </p>
    </motion.div>
  );

  return (
    <main className="bg-[#FCFDFE] font-sans w-full max-w-[100vw] overflow-x-hidden">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#EBFBFF] via-white to-[#E6FAFF] pt-12 xs:pt-14 sm:pt-16 md:pt-20 pb-10 xs:pb-12 sm:pb-14">
        <div className="absolute top-0 right-0 w-[200px] xs:w-[280px] sm:w-[350px] h-[200px] xs:h-[280px] sm:h-[350px] rounded-full bg-[#00B2D6]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[180px] xs:w-[230px] sm:w-[280px] h-[180px] xs:h-[230px] sm:h-[280px] rounded-full bg-[#3ECF8E]/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-3 xs:px-4 sm:px-6 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-1 px-2.5 xs:px-3 py-0.5 xs:py-1 rounded-full bg-[#00B2D6]/10 text-[#00B2D6] text-[9px] xs:text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 xs:mb-2.5 sm:mb-3">
              <Zap className="w-2.5 h-2.5 xs:w-3 xs:h-3" />
              Full Stack Platform
            </div>

            <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F2E4A] tracking-tight mb-2 xs:mb-2.5 sm:mb-3 leading-tight">
              Tech Stack & Features
            </h1>

            <p className="text-[11px] xs:text-xs sm:text-sm text-[#55697A] font-medium max-w-2xl mx-auto mb-4 xs:mb-5 sm:mb-6 leading-relaxed px-1 xs:px-2">
              A complete multi-tenant medical compliance platform built with
              modern technologies. Explore the frontend, backend, and powerful
              features that power MedComply.
            </p>

            <Link
              href={dashboardHref}
              className="inline-flex items-center justify-between rounded-full bg-[#00B2D6] pl-4 xs:pl-5 pr-1 xs:pr-1.5 py-1 xs:py-1.5 font-bold text-white transition-all hover:bg-[#0092B3] group shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-95 duration-200"
            >
              <span className="text-[11px] xs:text-xs sm:text-sm font-semibold tracking-wide mr-3 xs:mr-4 whitespace-nowrap">
                {isAuthenticated ? "Go to Dashboard" : "Explore Dashboard"}
              </span>
              <div className="w-6 h-6 xs:w-7 xs:h-7 rounded-full bg-white flex items-center justify-center text-[#00B2D6] group-hover:translate-x-0.5 transition-transform">
                <ArrowRight
                  size={12}
                  strokeWidth={2.5}
                  className="xs:w-3.5 xs:h-3.5"
                />
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── Frontend ─── */}
      <section className="py-8 xs:py-10 sm:py-12">
        <div className="max-w-[1440px] mx-auto px-3 xs:px-4 sm:px-6 md:px-8">
          <div className="text-center mb-4 xs:mb-5 sm:mb-6">
            <div className="inline-block px-2.5 xs:px-3 py-0.5 xs:py-1 rounded-full bg-[#EBFBFF] text-[#00B2D6] text-[9px] xs:text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1.5 xs:mb-2">
              Frontend
            </div>
            <h2 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-[#0F2E4A] tracking-tight mb-0.5 xs:mb-1">
              Client-Side Technology
            </h2>
            <p className="text-[11px] xs:text-xs sm:text-sm text-[#55697A] font-medium max-w-2xl mx-auto px-1 xs:px-2">
              Modern React ecosystem with Next.js 15, TypeScript, and a rich
              component library.
            </p>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-3 sm:gap-4">
            {frontendTech.map((item, i) => (
              <TechCard key={item.title} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Backend ─── */}
      <section className="py-8 xs:py-10 sm:py-12 bg-white">
        <div className="max-w-[1440px] mx-auto px-3 xs:px-4 sm:px-6 md:px-8">
          <div className="text-center mb-4 xs:mb-5 sm:mb-6">
            <div className="inline-block px-2.5 xs:px-3 py-0.5 xs:py-1 rounded-full bg-[#FFF4E9] text-[#FAAD14] text-[9px] xs:text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1.5 xs:mb-2">
              Backend
            </div>
            <h2 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-[#0F2E4A] tracking-tight mb-0.5 xs:mb-1">
              Server-Side Technology
            </h2>
            <p className="text-[11px] xs:text-xs sm:text-sm text-[#55697A] font-medium max-w-2xl mx-auto px-1 xs:px-2">
              Enterprise-grade Node.js API with Express, MongoDB, Redis, and
              microservices architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-3 sm:gap-4">
            {backendTech.map((item, i) => (
              <TechCard key={item.title} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Carousel ─── */}
      <section className="py-8 xs:py-10 sm:py-12">
        <div className="max-w-[1440px] mx-auto px-3 xs:px-4 sm:px-6 md:px-8">
          <div className="text-center mb-4 xs:mb-5 sm:mb-6">
            <div className="inline-block px-2.5 xs:px-3 py-0.5 xs:py-1 rounded-full bg-[#E8F8F8] text-[#3ECF8E] text-[9px] xs:text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1.5 xs:mb-2">
              Features
            </div>
            <h2 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-[#0F2E4A] tracking-tight mb-0.5 xs:mb-1">
              Platform Capabilities
            </h2>
            <p className="text-[11px] xs:text-xs sm:text-sm text-[#55697A] font-medium max-w-2xl mx-auto px-1 xs:px-2">
              Everything you need to manage medical compliance across your
              organization.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
          >
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={12}
              slidesPerView={1}
              centeredSlides={false}
              pagination={{ clickable: true, dynamicBullets: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{
                480: { slidesPerView: 1.5, spaceBetween: 12 },
                640: { slidesPerView: 2, spaceBetween: 14 },
                768: { slidesPerView: 2, spaceBetween: 16 },
                1024: { slidesPerView: 3, spaceBetween: 18 },
                1280: { slidesPerView: 4, spaceBetween: 20 },
              }}
              className="pb-8 xs:pb-10 sm:pb-12"
            >
              {projectFeatures.map((feature) => (
                <SwiperSlide key={feature.title} style={{ height: "auto" }}>
                  <div className="group bg-white border border-[#00B2D6]/10 rounded-xl p-3 xs:p-3.5 sm:p-4 h-full flex flex-col transition-all duration-300 hover:border-[#00B2D6]/30 hover:shadow-sm">
                    <div className="w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 rounded-lg xs:rounded-xl bg-[#EBFBFF] flex items-center justify-center text-[#00B2D6] mb-2 xs:mb-2.5 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xs xs:text-sm sm:text-base font-bold text-[#0F2E4A] mb-1 xs:mb-1.5 leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-[10px] xs:text-[11px] sm:text-xs text-[#55697A] font-medium leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="py-8 xs:py-10 sm:py-12 bg-white">
        <div className="max-w-[1440px] mx-auto px-3 xs:px-4 sm:px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative w-full rounded-xl xs:rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#00B2D6] to-[#0092B3] overflow-hidden py-6 xs:py-8 sm:py-10 px-3 xs:px-5 sm:px-8 text-center"
          >
            <div className="absolute top-0 -left-16 xs:-left-20 w-28 xs:w-36 sm:w-48 h-28 xs:h-36 sm:h-48 rounded-full bg-white/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 -right-16 xs:-right-20 w-28 xs:w-36 sm:w-48 h-28 xs:h-36 sm:h-48 rounded-full bg-white/5 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-xl xs:max-w-2xl mx-auto px-1">
              <h2 className="text-base xs:text-lg sm:text-2xl font-extrabold text-white tracking-tight mb-1.5 xs:mb-2 sm:mb-3">
                Ready to Get Started?
              </h2>
              <p className="text-white/80 text-[10px] xs:text-xs sm:text-sm font-medium leading-relaxed mb-4 xs:mb-5 sm:mb-6 max-w-lg mx-auto">
                Experience the full power of the MedComply platform. Explore
                role-based dashboards, manage bookings, and streamline your
                medical compliance workflow.
              </p>
              <div className="flex justify-center">
                <Link
                  href={dashboardHref}
                  className="inline-flex items-center justify-between rounded-full bg-white pl-4 xs:pl-5 pr-1 xs:pr-1.5 py-1 xs:py-1.5 font-bold text-[#00B2D6] transition-all hover:bg-gray-50 group shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-95 duration-200"
                >
                  <span className="text-[11px] xs:text-xs sm:text-sm font-semibold tracking-wide mr-3 xs:mr-4 whitespace-nowrap">
                    {isAuthenticated ? "Go to Dashboard" : "Explore Dashboard"}
                  </span>
                  <div className="w-6 h-6 xs:w-7 xs:h-7 rounded-full bg-[#00B2D6] flex items-center justify-center text-white group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight
                      size={12}
                      strokeWidth={2.5}
                      className="xs:w-3.5 xs:h-3.5"
                    />
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
