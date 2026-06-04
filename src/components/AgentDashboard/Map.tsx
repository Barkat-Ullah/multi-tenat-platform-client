"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
    onSelect: (data: { lat: number; lng: number }) => void;
};

export default function Map({ onSelect }: Props) {
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    useEffect(() => {
        if (!mapRef.current) {
            const map = L.map("map").setView([23.8103, 90.4125], 13);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "© OpenStreetMap",
            }).addTo(map);

            map.on("click", (e) => {
                const { lat, lng } = e.latlng;

                // Remove previous marker
                if (markerRef.current) {
                    markerRef.current.remove();
                }

                // Add new marker
                markerRef.current = L.marker([lat, lng]).addTo(map);

                onSelect({
                    lat: Number(lat.toFixed(6)),
                    lng: Number(lng.toFixed(6)),
                });
            });

            mapRef.current = map;
        }

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, [onSelect]);

    return <div id="map" className="h-[400px] w-full rounded" />;
}