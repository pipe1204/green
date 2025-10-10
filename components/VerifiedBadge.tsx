import React from "react";
import { ShieldCheck } from "lucide-react";

interface VerifiedBadgeProps {
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  className?: string;
}

export function VerifiedBadge({
  size = "sm",
  showTooltip = true,
  className = "",
}: VerifiedBadgeProps) {
  // Size configurations
  const sizeConfig = {
    sm: {
      container: "px-2 py-0.5 text-xs",
      icon: "w-3 h-3",
      text: "text-xs",
    },
    md: {
      container: "px-3 py-1 text-sm",
      icon: "w-4 h-4",
      text: "text-sm",
    },
    lg: {
      container: "px-4 py-1.5 text-base",
      icon: "w-5 h-5",
      text: "text-base",
    },
  };

  const config = sizeConfig[size];

  return (
    <div
      className={`inline-flex items-center gap-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-full font-bold shadow-md ${config.container} ${className}`}
      title={
        showTooltip
          ? "Vendedor Verificado - Respuesta rápida garantizada"
          : undefined
      }
    >
      <ShieldCheck className={config.icon} />
      <span className={config.text}>Verificado</span>
    </div>
  );
}
