"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export default function ImageZoom({
  src,
  alt,
  className = "",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
}: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const zoomImageRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;

    const rect = imageRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCursorPosition({ x, y });

    // Calculate zoom position (move the zoomed image in opposite direction)
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    setPosition({ x: xPercent, y: yPercent });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
    setPosition({ x: 50, y: 50 }); // Reset to center
  };

  // Preload zoom image
  useEffect(() => {
    if (src && zoomImageRef.current) {
      zoomImageRef.current.src = src;
    }
  }, [src]);

  return (
    <div
      ref={imageRef}
      className={`relative overflow-hidden cursor-zoom-in ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Base image */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-contain transition-transform duration-200"
        priority={priority}
      />

      {/* Zoom overlay */}
      {isZoomed && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Magnifying glass effect */}
          <div
            className="absolute w-32 h-32 border-2 border-gray-300 rounded-full shadow-2xl pointer-events-none"
            style={{
              left: `${cursorPosition.x - 64}px`,
              top: `${cursorPosition.y - 64}px`,
              backgroundImage: `url(${src})`,
              backgroundSize: "300%",
              backgroundPosition: `${position.x}% ${position.y}%`,
              backgroundRepeat: "no-repeat",
              display: "none",
            }}
          />

          {/* Full screen zoom overlay */}
          <div
            className="absolute inset-0 bg-white/95 backdrop-blur-sm"
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: "250%",
              backgroundPosition: `${position.x}% ${position.y}%`,
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>
      )}

      {/* Hidden zoom image for preloading */}
      <img ref={zoomImageRef} className="hidden" alt="" aria-hidden="true" />

      {/* Zoom indicator */}
      {isZoomed && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Zoom
        </div>
      )}
    </div>
  );
}
