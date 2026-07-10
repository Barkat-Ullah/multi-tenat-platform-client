"use client";

import Link from "next/link";
import { MapPin, Clock, Car, ArrowRight } from "lucide-react";
import type { HgvBusNearestClinicData } from "@/app/data/HgvBusMedicalData";
import SectionEyebrow from "@/components/shared/SectionEyebrow";
import { useMemo, useState } from "react";
import {
  type BookingServiceClinic,
  useGetBookingServiceDetailsQuery,
  useGetBookingServicesQuery,
} from "@/redux/service/user/userBookingFlowApi";
import {
  type PublicLocation,
  useGetPublicLocationsQuery,
} from "@/redux/service/locations/locationsApi";

interface HgvBusNearestClinicSectionProps {
  data: HgvBusNearestClinicData;
}

type HgvBusClinicDisplay = {
  id: string;
  fullName: string;
  email?: string | null;
  locationName: string;
  status?: string;
  isParking?: boolean;
  parkingLabel: string;
  lat: number | null;
  lng: number | null;
  distance: number | null;
  distanceLabel: string;
};

const getTypeSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const getDistanceInMiles = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) => {
  const earthRadiusMiles = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusMiles * c;
};

const ClinicsSkeleton = () => (
  <div className="h-full space-y-6" role="status" aria-label="Loading HGV clinics">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
        <div className="flex items-start justify-between gap-4">
          <div className="w-full space-y-3">
            <div className="h-3 w-16 animate-pulse rounded-full bg-slate-100" />
            <div className="h-5 w-2/3 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
          </div>
          <div className="h-10 w-28 shrink-0 animate-pulse rounded-full bg-slate-100" />
        </div>
        <div className="mt-5 grid grid-cols-3 gap-4">
          <div className="h-8 animate-pulse rounded bg-slate-100" />
          <div className="h-8 animate-pulse rounded bg-slate-100" />
          <div className="h-8 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
    ))}
    <span className="sr-only">Loading HGV clinics...</span>
  </div>
);

export default function HgvBusNearestClinicSection({ data }: HgvBusNearestClinicSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const {
    data: servicesResponse,
    isLoading: isServicesLoading,
    isFetching: isServicesFetching,
    isError: isServicesError,
    refetch: refetchServices,
  } = useGetBookingServicesQuery({ page: 1, limit: 100 });

  const hgvService = useMemo(() => {
    const services = servicesResponse?.data || [];
    return (
      services.find((service) => getTypeSlug(service.title) === "hgv-bus-medicals") ||
      services.find((service) => getTypeSlug(service.title) === "hgv-bus") ||
      services.find((service) => /hgv|bus|lgv/i.test(service.title))
    );
  }, [servicesResponse?.data]);

  const {
    data: serviceDetailsResponse,
    isLoading: isClinicsLoading,
    isFetching: isClinicsFetching,
    isError: isClinicsError,
    refetch: refetchClinics,
  } = useGetBookingServiceDetailsQuery(hgvService?.id || "", {
    skip: !hgvService?.id,
  });

  const {
    data: locationsResponse,
    isLoading: isLocationsLoading,
    isFetching: isLocationsFetching,
    isError: isLocationsError,
    refetch: refetchLocations,
  } = useGetPublicLocationsQuery({ page: 1, limit: 100 });

  const clinics = useMemo<HgvBusClinicDisplay[]>(() => {
    const query = submittedSearch.toLowerCase().trim();
    const serviceClinics = serviceDetailsResponse?.data?.clinics || [];
    const publicLocations = locationsResponse?.data || [];

    const sourceClinics = serviceClinics.length > 0
      ? serviceClinics.map((clinic: BookingServiceClinic) => {
          const lat = clinic.location?.lat ?? null;
          const lng = clinic.location?.lng ?? null;

          return {
            id: clinic.id,
            fullName: clinic.fullName || "N/A",
            email: clinic.email,
            locationName: clinic.location?.locationName || "N/A",
            status: clinic.status || "Online",
            isParking: clinic.isParking,
            parkingLabel: clinic.isParking ? "Yes" : "No",
            lat,
            lng,
          };
        })
      : publicLocations.map((location: PublicLocation) => ({
          id: location.id,
          fullName: location.locationName,
          email: null,
          locationName: `${location.totalClinicsAdded} clinic${
            location.totalClinicsAdded === 1 ? "" : "s"
          } available at this location`,
          status: "Online",
          parkingLabel: "N/A",
          lat: location.lat,
          lng: location.lng,
        }));

    const mappedClinics = sourceClinics
      .filter((clinic) => {
        if (!query) return true;
        return (
          clinic.fullName.toLowerCase().includes(query) ||
          clinic.locationName.toLowerCase().includes(query) ||
          (clinic.email || "").toLowerCase().includes(query)
        );
      })
      .map((clinic) => {
        const distance =
          userCoords && clinic.lat && clinic.lng
            ? getDistanceInMiles(userCoords.lat, userCoords.lng, clinic.lat, clinic.lng)
            : null;

        return {
          ...clinic,
          distance,
          distanceLabel: distance === null ? "N/A" : `${distance.toFixed(1)} mile`,
        };
      });

    if (userCoords) {
      mappedClinics.sort((first, second) => (first.distance ?? Number.MAX_VALUE) - (second.distance ?? Number.MAX_VALUE));
    }

    return mappedClinics;
  }, [
    locationsResponse?.data,
    serviceDetailsResponse?.data?.clinics,
    submittedSearch,
    userCoords,
  ]);

  const isLoadingClinics =
    isServicesLoading ||
    isServicesFetching ||
    isClinicsLoading ||
    isClinicsFetching ||
    isLocationsLoading ||
    isLocationsFetching;
  const isError =
    isServicesError ||
    isClinicsError ||
    isLocationsError ||
    (!isServicesLoading && !isServicesFetching && !hgvService);

  const handleSearch = () => {
    const query = searchQuery.trim();

    if (query) {
      setSubmittedSearch(query);
      setLocationError(null);
      return;
    }

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      () => {
        setLocationError("Unable to retrieve your location. Please check browser permissions.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const handleRetry = () => {
    if (hgvService?.id) {
      refetchClinics();
    }

    refetchServices();
    refetchLocations();
  };

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-28 poppins relative overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
          <SectionEyebrow>{data.eyebrow}</SectionEyebrow>

          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-[#0F2E4A] tracking-tight leading-tight mb-4">
            {data.title}
          </h2>
          <p className="text-[#55697A] text-sm md:text-base font-medium mx-auto leading-relaxed max-w-3xl">
            {data.description}
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column: Map */}
          <div className="relative w-full h-[500px] lg:h-auto rounded-3xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200">
            {/* Map iframe (focused on UK/Europe) */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d19853925.10542385!2d13.435759714275066!3d53.30825381813735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2suk!4v1714578110000!5m2!1sen!2suk" 
              className="w-full h-full border-0"
              loading="lazy"
            />
            {/* Locate your Geoposition Card overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[380px] bg-white rounded-2xl shadow-xl p-6 sm:p-8 z-20">
              <h3 className="text-[#0F2E4A] font-bold text-base sm:text-lg mb-4">Locate your Geoposition</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder={data.mapSearchPlaceholder}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 focus:outline-none focus:border-[#00B2D6] text-sm font-medium text-[#0F2E4A] placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={isLocating}
                  className="w-full h-12 rounded-lg bg-[#00B2D6] hover:bg-[#0092B3] text-white font-bold text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLocating ? "Locating..." : data.mapSearchButtonLabel}
                </button>
                {locationError && (
                  <p className="text-xs font-semibold text-red-500">{locationError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Clinics List */}
          <div className="flex h-[560px] flex-col bg-white border border-slate-200 shadow-sm rounded-3xl p-6 sm:p-8 lg:p-8">
            {isLoadingClinics ? (
              <ClinicsSkeleton />
            ) : isError ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <MapPin className="mb-4 h-12 w-12 text-red-200" />
                <p className="text-base font-extrabold text-[#0F2E4A]">Failed to load clinics</p>
                <p className="mt-1 max-w-sm text-sm font-medium text-[#55697A]">
                  Please try again to see available HGV/Bus medical clinics.
                </p>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="mt-5 rounded-full bg-[#00B2D6] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#0092B3]"
                >
                  Retry
                </button>
              </div>
            ) : clinics.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <MapPin className="mb-4 h-12 w-12 text-slate-300" />
                <p className="text-base font-extrabold text-[#0F2E4A]">
                  {submittedSearch ? "No clinics found" : "No clinics available"}
                </p>
                <p className="mt-1 max-w-sm text-sm font-medium text-[#55697A]">
                  {submittedSearch
                    ? "Try searching another city, postcode, or clinic name."
                    : "Clinic locations are not available right now. Please try again shortly."}
                </p>
              </div>
            ) : (
              <div className="min-h-0 flex-1 space-y-6 overflow-y-auto pr-1">
                {clinics.slice(0, 3).map((clinic) => (
                  <div key={clinic.id} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00B2D6]" />
                          <span className="text-[#0F2E4A] text-xs font-bold uppercase tracking-wider">
                            {clinic.status || "Active"}
                          </span>
                        </div>
                        <h4 className="text-[#0F2E4A] font-extrabold text-base sm:text-lg pr-4">
                          {clinic.fullName || "N/A"}
                        </h4>
                        <p className="text-[#55697A] text-xs sm:text-sm font-medium mt-1">
                          {clinic.locationName}
                        </p>
                      </div>
                      
                      <div className="shrink-0">
                        <Link
                          href="/booking?type=hgv-bus"
                          className="inline-flex items-center justify-between rounded-full bg-[#00B2D6] py-2 pl-5 pr-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#0092B3] group"
                        >
                          <span className="mr-3">Book Now</span>
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#00B2D6] transition-transform duration-300 group-hover:translate-x-0.5">
                            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                          </span>
                        </Link>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">Distance</span>
                        </div>
                        <span className="text-[#0F2E4A] text-xs sm:text-sm font-semibold">{clinic.distanceLabel}</span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">Opening Hours</span>
                        </div>
                        <span className="text-[#0F2E4A] text-xs sm:text-sm font-semibold">N/A</span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Car className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">Car Parking</span>
                        </div>
                        <span className="text-[#0F2E4A] text-xs sm:text-sm font-semibold">
                          {clinic.parkingLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoadingClinics && !isError && clinics.length > 0 && (
              <div className="mt-6 text-right">
                <Link href="/locations" className="text-[#00B2D6] text-sm font-bold hover:underline underline-offset-4">
                  Show More
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
