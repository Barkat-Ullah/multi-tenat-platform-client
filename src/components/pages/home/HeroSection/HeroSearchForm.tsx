/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetAllPropertiesQuery } from "@/redux/service/admin/propertiesApi";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import type React from "react";

const HeroSearchForm = () => {
  const router = useRouter();
  const [cityZip, setCityZip] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const { data: allProperties } = useGetAllPropertiesQuery({});

  const uniqueCities = useMemo(() => {
    const properties = allProperties?.data?.properties || [];
    const cities = properties
      .map((p: any) => p.city || p.location || p.address)
      .filter(Boolean);

    return Array.from(new Set(cities)) as string[];
  }, [allProperties]);

  const uniqueTypes = useMemo(() => {
    const properties = allProperties?.data?.properties || [];
    const types = properties.map((p: any) => p.type).filter(Boolean);

    return Array.from(new Set(types)) as string[];
  }, [allProperties]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (cityZip.trim()) {
      params.set("location", cityZip.trim());
    }

    if (propertyType.trim()) {
      params.set("type", propertyType.trim());
    }

    switch (priceRange) {
      case "under-100k":
        params.set("minPrice", "0");
        params.set("maxPrice", "100000");
        break;
      case "100k-300k":
        params.set("minPrice", "100000");
        params.set("maxPrice", "300000");
        break;
      case "300k-500k":
        params.set("minPrice", "300000");
        params.set("maxPrice", "500000");
        break;
      case "500k-plus":
        params.set("minPrice", "500000");
        params.set("maxPrice", "10000000");
        break;
      default:
        break;
    }

    router.push(`/all-property?${params.toString()}`);
  };

  return (
    <div className="rounded-[18px] bg-white/70 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-2xl border border-white/40 md:p-4">
      <form
        onSubmit={handleSearch}
        className="flex flex-col items-stretch justify-between gap-4 lg:flex-row lg:items-center"
      >
        {/* City Select */}
        <div className="relative flex-1 group ">
          {/* <label className="absolute -top-7 left-1 text-[11px] font-bold uppercase tracking-wider text-white/70 transition-colors group-focus-within:text-[#E2C59F]">Location</label> */}
          <select
            value={cityZip}
            onChange={(e) => setCityZip(e.target.value)}
            className="w-full rounded-xl border-none bg-white px-5 py-4 text-[#003944] font-medium shadow-sm ring-1 ring-black/5 transition-all focus:outline-none focus:ring-2 focus:ring-[#004E60] hover:bg-gray-50"
          >
            <option value="">Any City</option>
            {uniqueCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type Select */}
        <div className="relative flex-1 group">
          {/* <label className="absolute -top-7 left-1 text-[11px] font-bold uppercase tracking-wider text-white/70 transition-colors group-focus-within:text-[#E2C59F]">Type</label> */}
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full rounded-xl border-none bg-white px-5 py-4 text-[#003944] font-medium shadow-sm ring-1 ring-black/5 transition-all focus:outline-none focus:ring-2 focus:ring-[#004E60] hover:bg-gray-50"
          >
            <option value="">Any Type</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0) + type.slice(1).toLowerCase().replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Select */}
        <div className="relative flex-1 group">
          {/* <label className="absolute -top-7 left-1 text-[11px] font-bold uppercase tracking-wider text-white/70 transition-colors group-focus-within:text-[#E2C59F]">Budget</label> */}
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full rounded-xl border-none bg-white px-5 py-4 text-[#003944] font-medium shadow-sm ring-1 ring-black/5 transition-all focus:outline-none focus:ring-2 focus:ring-[#004E60] hover:bg-gray-50"
          >
            <option value="">Price Range</option>
            <option value="under-100k">Under $100K</option>
            <option value="100k-300k">$100K - $300K</option>
            <option value="300k-500k">$300K - $500K</option>
            <option value="500k-plus">$500K+</option>
          </select>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="mt-2 lg:mt-0 whitespace-nowrap rounded-xl bg-[#004E60] px-10 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:bg-[#003944] hover:scale-[1.02] active:scale-[0.98] lg:min-w-[140px]"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default HeroSearchForm;