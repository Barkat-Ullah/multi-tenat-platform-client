/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { Spin } from "antd";
import location from "@/assets/tableIcon/location-2.png";
import Calender from "@/assets/tableIcon/calender.png";
import {
  useGetAllPropertiesQuery,
  type PublicProperty,
} from "@/redux/service/admin/propertiesApi";

type UIFinancial = NonNullable<PublicProperty["financialInfos"]> | null;

type UIActiveProperty = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  address: string;
  city: string | null;
  createdAt: string;
  type: string;
  condition: string;
  useableArea: number;
  builtYear: string;
  financialInfos: UIFinancial;
  uuid: string;
};

function formatNumber(n?: number | null) {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return n.toLocaleString();
}

function timeAgoFromISO(iso: string) {
  const t = new Date(iso).getTime();
  if (!t) return "—";
  const now = Date.now();
  const diff = Math.max(0, now - t);
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hours ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} months ago`;
}

function prettifyEnum(s: string) {
  return (s || "—")
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function ActivePropertyCard({ p }: { p: UIActiveProperty }) {
  const imgSrc = p.image || "/api/placeholder/450/280";
  const capRate = p.financialInfos?.grossYield ?? null;
  const annualIncome = p.financialInfos?.grossAnnualRent ?? null;
  const price = p.financialInfos?.askingPrice ?? null;

  // const description = useMemo(() => {
  //   const t = prettifyEnum(p.type);
  //   const c = prettifyEnum(p.condition);
  //   const area = `${p.useableArea} m²`;
  //   const year = p.builtYear ? new Date(p.builtYear).getFullYear() : null;
  //   const yearText = year ? `Built in ${year}` : "Built year —";
  //   return `${t} property in ${c} condition. ${area}. ${yearText}.`;
  // }, [p.type, p.condition, p.useableArea, p.builtYear]);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm h-full">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 h-full">
        <div className="relative w-full lg:w-4/12 lg:min-w-[270] aspect-video lg:aspect-auto rounded-tl-xl rounded-bl-xl overflow-hidden bg-gray-100">
          <Image
            src={imgSrc}
            alt={p.title}
            fill
            className="object-cover"
            sizes=""
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col p-4 lg:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col min-w-0">
              <h3 className="text-lg lg:text-[18px] font-semibold text-[#1F1F1F] leading-tight line-clamp-1">
                {p.title}
              </h3>
              <span className="text-[10px] text-gray-400 font-poppins">ID: {p.uuid || p.id.slice(-6).toUpperCase()}</span>
            </div>
            <Link
              href={`/all-property/${p.id}`}
              className="text-center justify-center items-center flex gap-2 hover:text-black text-[#004E60] bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Details
            </Link>
          </div>

          <div className="mt-3 flex items-center gap-6 text-sm lg:text-[14px]">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                <Image src={location} width={15} height={15} alt="location" />
              </div>
              <div className="text-[#6B6B6B] truncate">
                {p.address}{p.city ? `, ${p.city}` : ""}
              </div>
            </div>
            <div className="flex items-center gap-2 text-[#6B6B6B] shrink-0">
              <div className="w-7 h-7 rounded-full flex items-center justify-center">
                <Image src={Calender} width={20} height={20} alt="calender" />
              </div>
              <span>{timeAgoFromISO(p.createdAt)}</span>
            </div>
          </div>

          <p className="mt-4 text-sm lg:text-[14px] text-[#7A7A7A] leading-snug line-clamp-2">
            {p.description}
          </p>

          <div className="flex-1" />

          <div className="mt-3 flex items-center justify-between text-sm lg:text-[14px]">
            <div className="text-[#A88D63] font-semibold">
              Annual Income <span className="font-semibold">{annualIncome === null ? "—" : `${formatNumber(annualIncome)}$`}</span>
            </div>
            <div className="text-[#23C836] font-semibold">
              Cap Rate <span className="font-semibold">{capRate === null ? "—" : `${formatNumber(capRate)}%`}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-base lg:text-[16px] font-semibold text-[#1F1F1F]">
              Price: <span className="font-semibold">{price === null ? "—" : `$${formatNumber(price)}`}</span>
            </div>
            <div className="flex items-center gap-2 text-[#6B6B6B]">
              <div className="w-7 h-7 rounded-full bg-[#F3EFE8] flex items-center justify-center text-[#A88D63]">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18" />
                  <path d="M5 21V7l7-4 7 4v14" />
                  <path d="M9 21v-6h6v6" />
                </svg>
              </div>
              <span className="font-semibold text-[#1F1F1F]">{prettifyEnum(p.type)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ActivePropertiesSection() {
  const horizontalSwiperRef = useRef<SwiperClass | null>(null);
  const verticalSwiperRef = useRef<SwiperClass | null>(null);

  const { data, isLoading } = useGetAllPropertiesQuery({ page: 1, limit: 10 });
  const apiProperties: PublicProperty[] = data?.data?.properties ?? [];

  const properties: UIActiveProperty[] = useMemo(() => {
    return apiProperties.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description || "No description available.",
      image: item.images?.[0] ?? null,
      address: item.address || "No address",
      city: item.city ?? null,
      createdAt: item.createdAt,
      type: item.type || "OTHERS",
      condition: item.condition || "UNKNOWN",
      useableArea: typeof item.useableArea === "number" ? item.useableArea : 0,
      builtYear: item.builtYear,
      financialInfos: item.financialInfos ?? null,
      uuid: item.id, // Using id as fallback for uuid display
    }));
  }, [apiProperties]);

  const CARD_H = 210;
  const GAP = 18;
  const WRAP_H = CARD_H * 3.8 + GAP * 2;

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl lg:text-[32px] font-bold text-[#1F1F1F]">Active Property</h2>

        {/* Horizontal nav for small + medium */}
        <div className="lg:hidden flex gap-2">
          <button
            aria-label="Previous"
            onClick={() => horizontalSwiperRef.current?.slidePrev()}
            className="w-11 h-11 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            aria-label="Next"
            onClick={() => horizontalSwiperRef.current?.slideNext()}
            className="w-11 h-11 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Vertical nav for large */}
        <div className="hidden lg:flex gap-2">
          <button
            aria-label="Up"
            onClick={() => verticalSwiperRef.current?.slidePrev()}
            className="w-11 h-11 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
          <button
            aria-label="Down"
            onClick={() => verticalSwiperRef.current?.slideNext()}
            className="w-11 h-11 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <Spin size="large" />
          <span className="text-sm text-gray-500">Loading properties...</span>
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center text-gray-500">
          No active properties found.
        </div>
      ) : (
        <>
          {/* Horizontal Swiper - Small (1) + Medium (2) */}
          <div className="lg:hidden">
            <Swiper
              onBeforeInit={(swiper) => { horizontalSwiperRef.current = swiper; }}
              modules={[Navigation]}
              direction="horizontal"
              slidesPerView={1}
              spaceBetween={20}
              breakpoints={{
                768: { slidesPerView: 2, spaceBetween: 24 }
              }}
              className="!pb-10"
            >
              {properties.map((p) => (
                <SwiperSlide key={p.id}>
                  <ActivePropertyCard p={p} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Vertical Swiper - Large devices only */}
          <div className="hidden lg:block">
            <div style={{ height: WRAP_H }}>
              <Swiper
                onBeforeInit={(swiper) => { verticalSwiperRef.current = swiper; }}
                modules={[Navigation]}
                direction="vertical"
                slidesPerView={3}
                spaceBetween={GAP}
                style={{ height: WRAP_H }}
                className="!pb-0"
              >
                {properties.map((p) => (
                  <SwiperSlide key={p.id} style={{ height: CARD_H }}>
                    <ActivePropertyCard p={p} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </>
      )}
    </div>
  );
}