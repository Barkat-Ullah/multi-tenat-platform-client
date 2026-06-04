/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Spin } from "antd";
import Link from "next/link";
import img from "@/assets/home/hero-image.png";
import PropertyCard from "./FeaturCard";
import { useGetAllPropertiesQuery } from "@/redux/service/admin/propertiesApi";

/* ======================
   UI PROPERTY INTERFACE
====================== */
export interface UIProperty {
  id: string;
  title: string;
  price: number;
  propertyValue: number;
  address: string;
  location: string;
  timeAgo: string;
  listingType: "BUY" | "RENT";
  isFeatured: boolean;
  image: string; // single image URL for card
  propertyCondition: string;
  propertyType: string;
  yearBuilt: number;
  squareFoot: number;
  capRate: number;
  annualIncome: number;
  isFavorite: boolean;
  uuid: string;
}

const FeaturedProperties: React.FC = () => {
  const swiperRef = useRef<any>(null);

  const { data, isLoading } = useGetAllPropertiesQuery({
    page: 1,
    limit: 10,
  });

  /* ======================
     MAP API → UI SHAPE (CORRECTED)
  ====================== */
  const properties: UIProperty[] =
    data?.data.properties?.map((item: any) => {
      // Safely extract financial info
      const financial = item.financialInfos || {};
      
      return {
        id: item.id,
        title: item.title,
        price: typeof financial.askingPrice === 'number' ? financial.askingPrice : 0,
        propertyValue: typeof financial.askingPrice === 'number' ? financial.askingPrice : 0,
        address: item.address || "No address",
        location: item.address || "No location",
        timeAgo: new Date(item.createdAt).toLocaleDateString(),
        listingType: "BUY", // API doesn't provide listedFor in sample, default to BUY
        isFeatured: Boolean(item.verified),
        image: item.images?.[0] || img.src,
        propertyCondition: item.condition || "Unknown",
        propertyType: item.type || "OTHERS",
        yearBuilt: item.builtYear 
          ? new Date(item.builtYear).getFullYear() 
          : new Date().getFullYear(),
        squareFoot: typeof item.useableArea === 'number' ? item.useableArea : 0,
        capRate: typeof financial.grossYield === 'number' ? financial.grossYield : 0,
        annualIncome: typeof financial.grossAnnualRent === 'number' ? financial.grossAnnualRent : 0,
        isFavorite:item.isFavorite,
        uuid: item.uuid,
      };
    }) || [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Spin size="large" />
        <span className="text-sm text-gray-500">Loading properties...</span>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 pt-2 md:pt-0">
      <div className="w-full bg-white grid grid-cols-1 py-8 md:py-10">
        <div>
          {/* Header */}
          <div className="text-center mb-8 md:mb-10">
            <h2 className="md:text-3xl text-2xl font-bold text-gray-900">
              Find & Recherche Your Properties Right Here!
            </h2>
          </div>

          {/* Swiper */}
          <Swiper
            onBeforeInit={(swiper) => (swiperRef.current = swiper)}
            modules={[Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{ 
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              bulletClass:
                "swiper-pagination-bullet !w-3 !h-3 !bg-sky-600 !opacity-100",
              bulletActiveClass: "!bg-[#E2C59F] !w-8 !rounded-full",
            }}
            breakpoints={{
              0: { slidesPerView: 1.2, spaceBetween: 16 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
              1280: { slidesPerView: 4, spaceBetween: 30 },
            }}
            loop
            className="!pb-10 !pt-2"
          >
            {properties.length === 0 ? (
              <SwiperSlide>
                <div className="text-center text-gray-500 py-8">
                  No properties found
                </div>
              </SwiperSlide>
            ) : (
              properties.map((property) => (
                <SwiperSlide
                  key={property.id}
                  className="!flex !justify-center"
                >
                  <PropertyCard
                    id={property.id}
                    name={property.title}
                    price={property.price}
                    propertyValue={property.propertyValue}
                    image={property.image}
                    address={property.address}
                    location={property.location}
                    timeAgo={property.timeAgo}
                    listingType={property.listingType}
                    propertyCondition={property.propertyCondition}
                    propertyType={property.propertyType}
                    yearBuilt={property.yearBuilt}
                    squareFoot={property.squareFoot}
                    capRate={property.capRate}
                    annualIncome={property.annualIncome}
                    isFeatured={property.isFeatured}
                    isFavorite={property.isFavorite}
                    uuid={property.uuid}
                  />
                </SwiperSlide>
              ))
            )}
          </Swiper>
        </div>
      </div>

      <Link href="/all-property">
        <button className="bg-[#004E60] hover:bg-green-600 text-white py-3 px-8 rounded-lg mx-auto block mb-10 md:mb-12">
          View Listing
        </button>
      </Link>
    </section>
  );
};

export default FeaturedProperties;
