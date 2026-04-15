"use client";

import { useState } from "react";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  position?: "fixed" | "static";
  className?: string;
  showTooltip?: boolean;
  tooltipText?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal" | "prominent";
}

const DEFAULT_PHONE_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER || "1234567890"; // Replace with your actual WhatsApp number
const DEFAULT_MESSAGE = "Hello! I'm interested in your artwork. Can you help me?";

export default function WhatsAppButton({
  phoneNumber = DEFAULT_PHONE_NUMBER,
  message = DEFAULT_MESSAGE,
  position = "fixed",
  className = "",
  showTooltip = true,
  tooltipText = "Chat with us on WhatsApp",
  size = "md",
  variant = "default",
}: WhatsAppButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Format phone number for WhatsApp (remove +, spaces, dashes, etc.)
  const formattedPhoneNumber = phoneNumber.replace(/[\s\-\+\(\)]/g, "");
  
  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${formattedPhoneNumber}?text=${encodeURIComponent(message)}`;

  // Size configurations
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14", 
    lg: "w-16 h-16"
  };

  // Variant configurations
  const variantClasses = {
    default: "bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl",
    minimal: "bg-green-500 hover:bg-green-600",
    prominent: "bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 shadow-xl hover:shadow-2xl"
  };

  // Position configurations
  const positionClasses = {
    fixed: "fixed bottom-6 right-6 z-50",
    static: ""
  };

  const buttonClasses = `
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${positionClasses[position]}
    rounded-full
    flex items-center justify-center
    text-white
    transition-all duration-300 ease-in-out
    transform hover:scale-110
    ${isHovered ? 'animate-pulse' : ''}
    ${className}
  `.trim();

  const tooltipClasses = `
    absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap
    transition-opacity duration-200 pointer-events-none
    ${isHovered ? 'opacity-100' : 'opacity-0'}
  `;

  const iconSize = {
    sm: 16,
    md: 24,
    lg: 28
  }[size];

  return (
    <div className={`relative ${position === "fixed" ? positionClasses.fixed : ""}`}>
      {/* Tooltip */}
      {showTooltip && (
        <div className={tooltipClasses}>
          {tooltipText}
          <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-800"></div>
        </div>
      )}

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Contact us on WhatsApp"
      >
        {/* WhatsApp SVG Icon */}
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>
    </div>
  );
}

// Export configuration types for easy customization
export type WhatsAppButtonConfig = Pick<WhatsAppButtonProps, 'phoneNumber' | 'message' | 'tooltipText' | 'size' | 'variant'>;

// Preset configurations for common use cases
export const whatsappPresets = {
  footer: {
    size: "sm" as const,
    variant: "minimal" as const,
    position: "static" as const,
    showTooltip: false
  },
  floating: {
    size: "md" as const,
    variant: "prominent" as const,
    position: "fixed" as const,
    showTooltip: true
  },
  product: {
    size: "sm" as const,
    variant: "default" as const,
    position: "static" as const,
    showTooltip: true,
    tooltipText: "Ask about this product"
  }
} as const;