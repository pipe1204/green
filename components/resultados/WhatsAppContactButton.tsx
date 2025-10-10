import React from "react";
import { WhatsappIcon } from "react-share";
import { Vehicle } from "@/types";
import { supabase } from "@/lib/supabase";

interface WhatsAppContactButtonProps {
  vehicle: Vehicle;
  className?: string;
}

export function WhatsAppContactButton({
  vehicle,
  className = "",
}: WhatsAppContactButtonProps) {
  // Generate WhatsApp message
  const message = `¡Hola! Me interesa el ${vehicle.brand} ${vehicle.name} que vi en Green. ¿Podrías darme más información?`;

  // Track WhatsApp click
  const handleWhatsAppClick = async () => {
    try {
      const token = (await supabase.auth.getSession()).data.session
        ?.access_token;

      await fetch("/api/analytics/track-whatsapp-click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          vendorId: vehicle.vendorId,
        }),
      });
    } catch (error) {
      // Don't block the user if tracking fails
      console.error("Failed to track WhatsApp click:", error);
    }
  };

  // Check if phone number exists and is valid
  if (!vehicle.vendor.phone || vehicle.vendor.phone.trim() === "") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          disabled
          className="p-1 bg-gray-400 text-white rounded-full cursor-not-allowed"
          title="Número de teléfono no disponible"
        >
          <WhatsappIcon size={16} round />
        </button>
      </div>
    );
  }

  // Clean phone number (remove spaces, dashes, parentheses but keep + and digits)
  const phoneNumber = vehicle.vendor.phone.replace(/[\s\-\(\)]/g, "");

  // Validate that it starts with + and has reasonable length
  if (!phoneNumber.startsWith("+") || phoneNumber.length < 10) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          disabled
          className="p-1 bg-gray-400 text-white rounded-full cursor-not-allowed"
          title="Número de teléfono inválido"
        >
          <WhatsappIcon size={16} round />
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <a
        href={`https://api.whatsapp.com/send?phone=${encodeURIComponent(
          phoneNumber
        )}&text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-1  text-white rounded-full transition-colors duration-200"
        title="Contactar por WhatsApp"
        onClick={handleWhatsAppClick}
      >
        <WhatsappIcon size={24} round />
      </a>
    </div>
  );
}
