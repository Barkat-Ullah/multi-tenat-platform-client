"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationPickerMapProps {
  latitude: number | null;
  longitude: number | null;
  onSelect: (latitude: number, longitude: number) => void;
}

const DEFAULT_CENTER: [number, number] = [23.7645867, 90.4469565];

const markerIcon = L.divIcon({
  className: "admin-location-picker-marker",
  html: `
    <div style="
      width: 22px;
      height: 22px;
      border-radius: 9999px;
      background: #00B2D6;
      border: 4px solid #ffffff;
      box-shadow: 0 8px 20px rgba(15, 46, 74, 0.28);
      transform: translate(-2px, -2px);
    "></div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

export default function LocationPickerMap({
  latitude,
  longitude,
  onSelect,
}: LocationPickerMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView(
      latitude !== null && longitude !== null ? [latitude, longitude] : DEFAULT_CENTER,
      latitude !== null && longitude !== null ? 14 : 12,
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    map.on("click", (event: L.LeafletMouseEvent) => {
      onSelectRef.current(
        Number(event.latlng.lat.toFixed(7)),
        Number(event.latlng.lng.toFixed(7)),
      );
    });

    mapRef.current = map;
    window.setTimeout(() => map.invalidateSize(), 120);

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || latitude === null || longitude === null) return;

    const coordinates: [number, number] = [latitude, longitude];
    if (!markerRef.current) {
      markerRef.current = L.marker(coordinates, { icon: markerIcon }).addTo(map);
    } else {
      markerRef.current.setLatLng(coordinates);
    }

    map.setView(coordinates, Math.max(map.getZoom(), 14));
  }, [latitude, longitude]);

  return <div ref={containerRef} className="h-full w-full" />;
}
