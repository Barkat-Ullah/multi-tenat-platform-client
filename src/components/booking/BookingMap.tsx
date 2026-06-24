"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface ClinicPin {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
}

interface BookingMapProps {
  clinics: ClinicPin[];
  selectedClinicId: string | null;
  onSelectClinic: (id: string) => void;
}

export default function BookingMap({ clinics, selectedClinicId, onSelectClinic }: BookingMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  useEffect(() => {
    // 1. Initialize map if not already done
    if (!mapRef.current) {
      // Center of UK roughly
      const map = L.map("booking-map-el", {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView([54.5, -3.0], 6);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      mapRef.current = map;
    }

    const map = mapRef.current;

    // 2. Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // 3. Add markers for each clinic
    clinics.forEach((clinic) => {
      const isSelected = selectedClinicId === clinic.id;

      // Define CSS circle markers for a clean premium look
      const markerHtml = `
        <div style="
          background-color: ${isSelected ? "#00B2D6" : "#0F2E4A"}; 
          width: ${isSelected ? "20px" : "14px"}; 
          height: ${isSelected ? "20px" : "14px"}; 
          border-radius: 50%; 
          border: 2px solid white; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
          transform: translate(-25%, -25%);
        "></div>
      `;

      const customIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: markerHtml,
        iconSize: isSelected ? [20, 20] : [14, 14],
        iconAnchor: isSelected ? [10, 10] : [7, 7],
      });

      const marker = L.marker([clinic.lat, clinic.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: inherit; padding: 4px;">
            <strong style="color: #0F2E4A; font-size: 13px;">${clinic.name}</strong>
            <p style="color: #55697A; font-size: 11px; margin: 4px 0 0 0;">${clinic.address}</p>
          </div>
        `);

      marker.on("click", () => {
        onSelectClinic(clinic.id);
      });

      markersRef.current[clinic.id] = marker;
    });

    // 4. Focus/Center selected clinic or fit bounds
    if (selectedClinicId && markersRef.current[selectedClinicId]) {
      const selectedClinic = clinics.find((c) => c.id === selectedClinicId);
      if (selectedClinic) {
        map.setView([selectedClinic.lat, selectedClinic.lng], 12);
        markersRef.current[selectedClinicId].openPopup();
      }
    } else if (clinics.length > 0) {
      // Fit to bounds of all clinics in view
      const group = L.featureGroup(Object.values(markersRef.current));
      map.fitBounds(group.getBounds().pad(0.1));
    }

  }, [clinics, selectedClinicId, onSelectClinic]);

  return (
    <div className="relative w-full h-full min-h-[350px] md:min-h-[500px] rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm">
      <div id="booking-map-el" className="w-full h-full absolute inset-0 z-10" />
    </div>
  );
}
