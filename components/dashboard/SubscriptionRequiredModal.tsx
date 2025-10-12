"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";

interface SubscriptionRequiredModalProps {
  isOpen: boolean;
  vendorId: string;
  onSubscriptionSelected: () => void;
}

export function SubscriptionRequiredModal({
  isOpen,
  vendorId,
  onSubscriptionSelected,
}: SubscriptionRequiredModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "pro" | null>(
    null
  );

  const handleSelectPlan = async (plan: "starter" | "pro") => {
    setLoading(true);
    setError("");
    setSelectedPlan(plan);

    try {
      const response = await fetch("/api/vendor/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
          vendorId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar la suscripción");
      }

      // Success! Refresh the page
      onSubscriptionSelected();
    } catch (err) {
      console.error("Error selecting plan:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Error al actualizar la suscripción"
      );
      setSelectedPlan(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center mb-2">
            Tu Prueba Gratis ha Terminado
          </DialogTitle>
          <p className="text-center text-gray-600">
            Elige un plan para continuar vendiendo en Green
          </p>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 text-sm text-center">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Starter Plan */}
          <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-green-300 transition-all bg-white">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                🌱 Plan Starter
              </h3>
              <div className="flex items-baseline justify-center mb-4">
                <span className="text-4xl font-bold text-gray-900">
                  $69,900
                </span>
                <span className="text-gray-600 ml-2">COP / mes</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Publicaciones ilimitadas</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Ubicación estándar en búsquedas</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Analíticas básicas</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Mensajería con compradores</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Ubicación prioritaria</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Analíticas avanzadas</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Insignia Verificado</span>
              </li>
            </ul>

            <Button
              onClick={() => handleSelectPlan("starter")}
              disabled={loading}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white"
              size="lg"
            >
              {loading && selectedPlan === "starter" ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Elegir Plan Starter"
              )}
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="border-2 border-green-500 rounded-xl p-6 bg-gradient-to-br from-green-50 to-blue-50 relative">
            <div className="absolute top-0 right-6 transform -translate-y-1/2">
              <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                ⭐ RECOMENDADO
              </span>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                ⚡ Plan Pro
              </h3>
              <div className="flex items-baseline justify-center mb-4">
                <span className="text-4xl font-bold text-green-600">
                  $159,900
                </span>
                <span className="text-gray-600 ml-2">COP / mes</span>
              </div>
            </div>

            <div className="bg-white/80 rounded-lg p-3 mb-4">
              <p className="text-sm font-semibold text-green-700 text-center">
                Todo lo del Plan Starter, más:
              </p>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">
                  Ubicación prioritaria en búsquedas
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">
                  Analíticas avanzadas completas
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">
                  Insignia &quot;Vendedor Verificado&quot;
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">
                  WhatsApp + mensajería directa
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">Promociones ilimitadas</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">Destacado en homepage</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">Soporte prioritario</span>
              </li>
            </ul>

            <Button
              onClick={() => handleSelectPlan("pro")}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              {loading && selectedPlan === "pro" ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Elegir Plan Pro"
              )}
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            💡 Puedes cambiar de plan en cualquier momento desde tu perfil
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Debes elegir un plan para continuar accediendo a tu dashboard
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
