/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useToggleFavouriteMutation } from "@/redux/service/admin/propertiesApi";
import { appAlert } from "@/utils/appAlert";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import type { RootState } from "@/redux/store";
import { startCompare, setSecondCompare } from "@/redux/features/compareSlice";
import { toast } from "sonner";

interface PropertyCardProps {
  id: string;
  name: string;
  price?: number;
  propertyValue?: number;
  image: string;
  address: string;
  location?: string;
  timeAgo?: string;
  listingType?: "BUY" | "RENT";
  isFeatured?: boolean;
  propertyCondition?: string;
  propertyType?: string;
  yearBuilt?: number;
  squareFoot?: number;
  capRate?: number;
  annualIncome?: number;
  isFavorite?: boolean;
  uuid?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  name,
  price,
  annualIncome,
  image,
  address,
  timeAgo,
  isFeatured,
  propertyCondition,
  propertyType,
  yearBuilt,
  squareFoot,
  capRate,
  isFavorite,
  uuid,
}) => {
  const [isLiked, setIsLiked] = useState(!!isFavorite);
  const [toggleFavourite] = useToggleFavouriteMutation();

  useEffect(() => {
    setIsLiked(!!isFavorite);
  }, [isFavorite]);

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    const previousState = isLiked;
    setIsLiked(!previousState);
    try {
      const res = await toggleFavourite(id).unwrap();
      if (res.success) {
        toast.success("Favourite updated!");
      } else {
        setIsLiked(previousState);
      }
    } catch (error: any) {
      setIsLiked(previousState);
      toast.error(error.message);
    }
  };

  const formatNumber = (num?: number | null) =>
    typeof num === "number" && !Number.isNaN(num) ? num.toLocaleString() : "0";

  const dispatch = useDispatch();
  const router = useRouter();
  const { firstId, isSelectingSecond } = useSelector(
    (state: RootState) => state.compare as { firstId: string | null; isSelectingSecond: boolean }
  );

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isSelectingSecond || !firstId) {
      dispatch(startCompare(id));
      appAlert.fire({
        icon: "info",
        title: "Select one more property",
        text: "Now choose another property to compare.",
        timer: 1400,
        showConfirmButton: false,
        position: "center",
      });
      return;
    }
    if (firstId === id) {
      appAlert.fire({
        icon: "warning",
        title: "Pick a different property",
        text: "This is already selected as the first one.",
        timer: 1400,
        showConfirmButton: false,
        position: "center",
      });
      return;
    }
    dispatch(setSecondCompare(id));
    router.push("/compare-property");
  };

  const [imgSrc, setImgSrc] = useState(image || "/images/placeholder-property.png");

  useEffect(() => {
    setImgSrc(image || "/images/placeholder-property.png");
  }, [image]);

  return (
    <div
      className="property-card-container group"
      style={{
        background: "#fff",
        borderRadius: 24,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        overflow: "hidden",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: "inherit",
        border: "1px solid #f0f0f0",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <style jsx>{`
        .property-card-container:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
          border-color: #0d948820;
        }
      `}</style>
      {/* ── Image ── */}
      <div style={{ position: "relative", width: "100%", height: 200, }}>
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src={imgSrc}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
            onError={() => setImgSrc("/images/placeholder-property.png")}
          />
        </div>

        {/* Verified badge */}
        {isFeatured && (
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              background: "rgba(255,255,255,0.92)",
              borderRadius: 20,
              padding: "4px 10px",
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 12,
              fontWeight: 600,
              color: "#1a7a4a",
              backdropFilter: "blur(4px)",
              boxShadow: "0 1px 6px rgba(0,0,0,0.10)",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 12l2 2 4-4M12 2a10 10 0 100 20A10 10 0 0012 2z"
                stroke="#1a7a4a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Verified
          </div>
        )}

        {/* Heart button */}
        <button
          onClick={handleToggleLike}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.92)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 1px 6px rgba(0,0,0,0.12)",
            backdropFilter: "blur(4px)",
          }}
          aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={isLiked ? "#EF4444" : "none"}
            stroke={isLiked ? "#EF4444" : "#888"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: "16px 16px 12px", display: "flex", flexDirection: "column", gap: 10 }}>

        {/* Name + Price */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#111",
                lineHeight: 1.3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {name}
            </span>
            <span className="text-[10px] text-gray-400 font-poppins">ID: {uuid || id.slice(-6).toUpperCase()}</span>
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, color: "#111", whiteSpace: "nowrap" }}>
            €{formatNumber(price)}
          </span>
        </div>

        {/* Address + Time ago */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#666", fontSize: 12, minWidth: 0 }}>
            {/* Pin icon */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{address}</span>
          </div>
          {timeAgo && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#888", fontSize: 12, flexShrink: 0 }}>
              {/* Calendar icon */}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {timeAgo}
            </div>
          )}
        </div>

        {/* Cap Rate + Annual Income */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div
            style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: 12,
              padding: "10px 12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
              {/* Arrow up icon */}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
              <span style={{ fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Cap Rate
              </span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#16a34a" }}>
              {formatNumber(capRate)}%
            </div>
          </div>

          <div
            style={{
              background: "#fffbeb",
              border: "1px solid #fde68a",
              borderRadius: 12,
              padding: "10px 12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
              {/* Bar chart icon */}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <span style={{ fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Annual Income
              </span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#d97706" }}>
              €{formatNumber(annualIncome)}
            </div>
          </div>
        </div>

        {/* Details row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 8px", fontSize: 12, color: "#555" }}>
          <div>
            Property Condition :{" "}
            <span style={{ fontWeight: 600, color: "#222" }}>{propertyCondition?.replace(/_/g, " ") ?? "N/A"}</span>
          </div>
          <div>
            Year Built :{" "}
            <span style={{ fontWeight: 600, color: "#222" }}>{yearBuilt ?? "N/A"}</span>
          </div>
          <div>
            Property Type :{" "}
            <span style={{ fontWeight: 600, color: "#222" }}>{propertyType ?? "N/A"}</span>
          </div>
          <div>
            Square Foot :{" "}
            <span style={{ fontWeight: 600, color: "#222" }}>{formatNumber(squareFoot)}</span>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 4 }}>
          <Link
            href={`/all-property/${id}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              border: "1.5px solid #d1d5db",
              borderRadius: 10,
              padding: "9px 0",
              fontSize: 13,
              fontWeight: 700,
              color: "#004E60",
              background: "#fff",
              textDecoration: "none",
              transition: "background 0.15s",
            }}
          >
            {/* Eye icon */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#004E60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Details
          </Link>

          <button
            type="button"
            onClick={handleCompareClick}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              border: "1.5px solid #d1d5db",
              borderRadius: 10,
              padding: "9px 0",
              fontSize: 13,
              fontWeight: 700,
              color: "#004E60",
              background: "#fff",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
          >
            {/* Compare icon */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#004E60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 3 21 3 21 8" />
              <line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21 16 21 21 16 21" />
              <line x1="15" y1="15" x2="21" y2="21" />
            </svg>
            {isSelectingSecond ? "Select" : "Compare"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;