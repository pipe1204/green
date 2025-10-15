"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Zap, Clock, X } from "lucide-react";
import { Vendor } from "@/types";

interface TrialBannerProps {
  vendor: Vendor;
  onViewPlans: () => void;
  onDismiss?: () => void;
}

export function TrialBanner({
  vendor,
  onViewPlans,
  onDismiss,
}: TrialBannerProps) {
  // Calculate days remaining
  const calculateDaysRemaining = (): number => {
    if (!vendor.trial_end_date) return 0;
    const endDate = new Date(vendor.trial_end_date);
    const today = new Date();

    // Set time to start of day for accurate day calculation
    const endDateOnly = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    );
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const diffTime = endDateOnly.getTime() - todayOnly.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const daysRemaining = calculateDaysRemaining();

  // Don't show if not in trial
  if (!vendor.is_trial) return null;

  // Don't show if trial has expired
  if (daysRemaining <= 0) return null;

  // Determine color scheme based on days remaining
  const getColorScheme = () => {
    if (daysRemaining <= 3) {
      return {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-800",
        icon: "text-red-600",
        button: "bg-red-600 hover:bg-red-700",
      };
    } else if (daysRemaining <= 7) {
      return {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        text: "text-yellow-800",
        icon: "text-yellow-600",
        button: "bg-yellow-600 hover:bg-yellow-700",
      };
    } else {
      return {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-800",
        icon: "text-green-600",
        button: "bg-green-600 hover:bg-green-700",
      };
    }
  };

  const colors = getColorScheme();

  return (
    <div
      className={`${colors.bg} border-2 ${colors.border} rounded-lg p-4 mb-6 shadow-sm`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className={`${colors.icon} mt-1`}>
            {daysRemaining <= 7 ? (
              <Clock className="w-6 h-6" />
            ) : (
              <Zap className="w-6 h-6" />
            )}
          </div>
          <div className="flex-1">
            <h3 className={`font-bold text-lg ${colors.text} mb-1`}>
              {daysRemaining <= 3
                ? "⚠️ Tu prueba del Plan Pro está por terminar"
                : daysRemaining <= 7
                  ? "⏰ Tu prueba del Plan Pro termina pronto"
                  : "🎉 Estás usando el Plan Pro"}
            </h3>
            <p className={`text-sm ${colors.text} mb-3`}>
              {daysRemaining === 1
                ? "Te queda 1 día de prueba gratis."
                : `Te quedan ${daysRemaining} días de prueba gratis.`}{" "}
              Tienes acceso completo a todas las funcionalidades premium:
              analíticas avanzadas, ubicación prioritaria, promociones
              ilimitadas y más.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={onViewPlans}
                size="sm"
                className={`${colors.button} text-white`}
              >
                Ver Planes y Precios
              </Button>
              {daysRemaining > 7 && onDismiss && (
                <Button
                  onClick={onDismiss}
                  size="sm"
                  variant="outline"
                  className="text-gray-600"
                >
                  Recordarme después
                </Button>
              )}
            </div>
          </div>
        </div>
        {onDismiss && daysRemaining > 7 && (
          <button
            onClick={onDismiss}
            className={`${colors.text} hover:opacity-70 transition-opacity ml-2`}
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
