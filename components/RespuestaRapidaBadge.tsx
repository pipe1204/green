import React from "react";
import { Zap } from "lucide-react";

interface RespuestaRapidaBadgeProps {
  size?: "sm" | "md";
  className?: string;
}

export function RespuestaRapidaBadge({
  size = "sm",
  className = "",
}: RespuestaRapidaBadgeProps) {
  // Size configurations
  const sizeConfig = {
    sm: {
      container: "px-2 py-0.5",
      icon: "w-3 h-3",
      text: "text-xs",
    },
    md: {
      container: "px-3 py-1",
      icon: "w-4 h-4",
      text: "text-sm",
    },
  };

  const config = sizeConfig[size];

  return (
    <div
      className={`inline-flex items-center gap-1 bg-gradient-to-r from-[#11998e] to-[#38ef7d] text-white rounded-full font-semibold shadow-sm ${config.container} ${className}`}
      title="Este vendedor Pro responde rápidamente a las consultas"
    >
      <Zap className={config.icon} />
      <span className={config.text}>Respuesta Rápida</span>
    </div>
  );
}
