"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface FloatingAskButtonProps {
  className?: string;
}

export default function FloatingAskButton({
  className,
}: FloatingAskButtonProps) {
  const handleQuestionClick = () => {
    const phoneNumber = "+61433594026"; // WhatsApp number (with +)
    const message =
      "¡Hola! Me gustaría hacer una consulta sobre vehículos eléctricos en Green. ¿Podrían ayudarme?";
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(phoneNumber)}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };
  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className ?? ""}`}>
      <Button
        onClick={handleQuestionClick}
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 h-10 text-sm font-normal px-4 shadow-md rounded-full"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Pregúntanos algo
      </Button>
    </div>
  );
}
