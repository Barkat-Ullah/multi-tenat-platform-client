"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronUp, ClipboardList, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  type BookingService,
  useGetBookingServicesQuery,
} from "@/redux/service/user/userBookingFlowApi";

const PRIMARY_SERVICE_COUNT = 6;

const getServiceBookingHref = (service: BookingService) =>
  `/booking?type=${encodeURIComponent(
    service.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  )}`;

const ServiceCardSkeleton = () => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8" role="status" aria-label="Loading medical services">
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={index}
        className="flex animate-pulse flex-col gap-4 rounded-2xl border border-[#00B2D6]/10 bg-white p-4 shadow-sm xs:flex-row xs:items-center"
      >
        <div className="h-36 w-full shrink-0 rounded-xl bg-slate-100 xs:h-24 xs:w-24 sm:h-28 sm:w-28" />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="h-5 w-3/4 rounded bg-slate-100" />
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-8 w-28 rounded-full bg-slate-100" />
        </div>
      </div>
    ))}
    <span className="sr-only">Loading medical services...</span>
  </div>
);

const ServiceCard = ({ service }: { service: BookingService }) => (
  <Link
    href={getServiceBookingHref(service)}
    className="group flex flex-col gap-4 rounded-2xl border border-[#00B2D6]/10 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#00B2D6]/20 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#00B2D6]/30 xs:flex-row xs:items-center"
    aria-label={`Book ${service.title}`}
  >
    <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-[#E6FAFF] xs:h-24 xs:w-24 sm:h-28 sm:w-28">
      {service.files ? (
        <Image
          src={service.files}
          alt={service.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 96px, 112px"
          unoptimized
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs font-extrabold text-[#00B2D6]">
          Medical
        </div>
      )}
    </div>

    <div className="flex min-w-0 flex-1 flex-col items-start">
      <h3 className="w-full break-words text-base font-bold text-[#0F2E4A] transition-colors duration-200 group-hover:text-[#00B2D6] sm:text-lg">
        {service.title}
      </h3>
      <p className="mb-4 mt-1 w-full text-xs font-medium leading-relaxed text-[#55697A] sm:text-sm">
        {service.description || "Professional medical assessment service"}
      </p>
      <span className="inline-flex items-center justify-between rounded-full bg-[#00B2D6] py-1 pl-4 pr-1.5 text-xs font-bold text-white shadow-sm transition-all duration-300 group-hover:bg-[#0092B3] group-hover:shadow-md sm:text-sm">
        <span className="mr-3 tracking-wide">Book Now</span>
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#00B2D6] transition-transform duration-200 group-hover:translate-x-0.5">
          <ArrowRight size={12} strokeWidth={2.5} />
        </div>
      </span>
    </div>
  </Link>
);

export default function MedicalTypesSection() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetBookingServicesQuery({ page: 1, limit: 100 });

  const services = data?.data || [];
  const primaryServices = useMemo(
    () => services.slice(0, PRIMARY_SERVICE_COUNT),
    [services],
  );
  const otherServices = useMemo(
    () => services.slice(PRIMARY_SERVICE_COUNT),
    [services],
  );
  const isBusy = isLoading || isFetching;

  return (
    <section className="bg-white py-14 poppins sm:py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14 md:mb-16">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-[#0F2E4A] md:text-4xl lg:text-5xl">
            Choose Your Medical Type
          </h2>
          <p className="mt-3 text-sm font-medium text-[#55697A] md:text-base">
            Professional driver medicals approved by DVLA. Fast, convenient, and compliant.
          </p>
        </div>

        {isBusy ? (
          <ServiceCardSkeleton />
        ) : isError ? (
          <div className="mx-auto flex max-w-lg flex-col items-center rounded-3xl border border-red-100 bg-white p-10 text-center shadow-sm">
            <ClipboardList className="mb-4 h-12 w-12 text-red-200" />
            <h3 className="text-lg font-extrabold text-[#0F2E4A]">Failed to load medical services</h3>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              Please try again to see available services.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#00B2D6] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0092B3]"
            >
              <RefreshCw size={15} />
              Retry
            </button>
          </div>
        ) : services.length === 0 ? (
          <div className="mx-auto flex max-w-lg flex-col items-center rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center">
            <ClipboardList className="mb-4 h-12 w-12 text-slate-300" />
            <h3 className="text-lg font-extrabold text-[#0F2E4A]">No medical services found</h3>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              Medical services are not available right now.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {primaryServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            {otherServices.length > 0 && (
              <div className="w-full">
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="group flex w-full items-start justify-between gap-3 rounded-2xl border border-[#00B2D6]/10 bg-white p-4 text-left shadow-sm transition-all duration-300 hover:border-[#00B2D6]/20 hover:shadow-md sm:items-center sm:p-5 md:p-6"
                  aria-expanded={isOpen}
                >
                  <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EBFBFF] text-[#00B2D6] transition-transform duration-200 group-hover:scale-105">
                      <ClipboardList size={22} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-base font-bold text-[#00B2D6] transition-colors group-hover:text-[#0092B3] sm:text-lg">
                        Other Medicals
                      </h4>
                      <p className="mt-0.5 text-xs font-medium leading-relaxed text-[#55697A] sm:text-sm">
                        View and book more medical services
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 p-2 text-gray-400 transition-colors duration-200 hover:text-[#00B2D6]">
                    {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{
                        open: { opacity: 1, height: "auto" },
                        collapsed: { opacity: 0, height: 0 },
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 grid grid-cols-1 gap-4 rounded-2xl border border-[#00B2D6]/10 bg-gray-50/50 p-4 sm:p-6 md:grid-cols-2 lg:grid-cols-3">
                        {otherServices.map((service) => (
                          <Link
                            key={service.id}
                            href={getServiceBookingHref(service)}
                            className="group flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#00B2D6]/30 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00B2D6]/30 xs:flex-row xs:items-center xs:justify-between"
                            aria-label={`Book ${service.title}`}
                          >
                            <div className="min-w-0 pr-3">
                              <h5 className="break-words text-sm font-bold text-[#0F2E4A]">{service.title}</h5>
                              <p className="mt-0.5 text-xs font-medium leading-relaxed text-[#55697A]">
                                {service.description || "Professional medical assessment service"}
                              </p>
                            </div>
                            <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-[#00B2D6] group-hover:text-[#0092B3]">
                              <span className="tracking-wide">Book</span>
                              <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                            </span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
