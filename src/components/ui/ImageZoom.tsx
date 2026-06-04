"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Props = {
  src: string;
};

export default function ImageZoom({ src }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isHover, setIsHover] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPosition({ x, y });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="relative w-full max-w-[560px] overflow-hidden rounded-lg border border-gray-200 bg-gray-100 cursor-zoom-in"
    >
      <Image
        src={src}
        alt="Zoom Image"
        width={800}
        height={520}
        className="h-auto w-full transition-transform duration-300"
        style={{
          transform: isHover ? "scale(2)" : "scale(1)",
          transformOrigin: `${position.x}% ${position.y}%`,
        }}
      />
    </div>
  );
}
