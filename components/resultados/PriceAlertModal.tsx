"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Vehicle } from "@/types";
import { formatPrice } from "@/lib/utils";
import {
  Bell,
  Zap,
  CheckCircle,
  TrendingDown,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  isOpen,
  onClose,
  vehicle,
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [targetPrice, setTargetPrice] = useState<string>("");
  const [hasExistingAlert, setHasExistingAlert] = useState(false);
  const [existingAlertId, setExistingAlertId] = useState<string | null>(null);

  // Calculate suggested prices (10%, 15%, 20% discount)
  const suggestedPrices = [
    { discount: "10%", price: Math.floor(vehicle.price * 0.9) },
    { discount: "15%", price: Math.floor(vehicle.price * 0.85) },
    { discount: "20%", price: Math.floor(vehicle.price * 0.8) },
  ];

  // Check if user already has an alert for this vehicle
  useEffect(() => {
    if (isOpen && user) {
      checkExistingAlert();
    }
  }, [isOpen, user, vehicle.id]);

  const checkExistingAlert = async () => {
    try {
      const { data, error } = await supabase
        .from("price_alerts")
        .select("id, target_price, is_active")
        .eq("customer_id", user?.id)
        .eq("vehicle_id", vehicle.id)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setHasExistingAlert(true);
        setExistingAlertId(data.id);
        setTargetPrice(data.target_price.toString());
      } else {
        setHasExistingAlert(false);
        setExistingAlertId(null);
      }
    } catch (error) {
      console.error("Error checking existing alert:", error);
    }
  };

  // Reset states when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSuccess(false);
      setError(null);
      if (!hasExistingAlert) {
        setTargetPrice("");
      }
    }
  }, [isOpen, hasExistingAlert]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const priceValue = parseInt(targetPrice);

      // Validation
      if (priceValue <= 0) {
        setError("El precio debe ser mayor a 0");
        setIsSubmitting(false);
        return;
      }

      if (priceValue >= vehicle.price) {
        setError("El precio de alerta debe ser menor al precio actual");
        setIsSubmitting(false);
        return;
      }

      if (hasExistingAlert && existingAlertId) {
        // Update existing alert
        const { error: updateError } = await supabase
          .from("price_alerts")
          .update({
            target_price: priceValue,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingAlertId);

        if (updateError) throw updateError;
      } else {
        // Create new alert
        const { error: insertError } = await supabase
          .from("price_alerts")
          .insert({
            customer_id: user?.id,
            vehicle_id: vehicle.id,
            target_price: priceValue,
            is_active: true,
          });

        if (insertError) throw insertError;
      }

      // Success!
      setSuccess(true);

      // Reset and close after delay
      setTimeout(() => {
        setTargetPrice("");
        setSuccess(false);
        setHasExistingAlert(false);
        setExistingAlertId(null);
        onClose();
      }, 3000);
    } catch (err) {
      console.error("Error setting price alert:", err);
      setError(
        "Hubo un error al configurar tu alerta. Por favor intenta de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingAlertId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from("price_alerts")
        .delete()
        .eq("id", existingAlertId);

      if (deleteError) throw deleteError;

      setHasExistingAlert(false);
      setExistingAlertId(null);
      setTargetPrice("");

      // Show brief success and close
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error deleting price alert:", err);
      setError(
        "Hubo un error al eliminar tu alerta. Por favor intenta de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {hasExistingAlert ? "¡Alerta Actualizada!" : "¡Alerta Creada!"}
            </h3>
            <p className="text-gray-600 mb-4">
              Te notificaremos por email cuando el precio de{" "}
              <span className="font-semibold">{vehicle.name}</span> baje a{" "}
              <span className="font-semibold">
                {formatPrice(parseInt(targetPrice))}
              </span>{" "}
              o menos.
            </p>
            <p className="text-sm text-gray-500">
              Puedes gestionar tus alertas desde tu panel de control.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center">
            <Bell className="w-6 h-6 text-purple-600 mr-2" />
            {hasExistingAlert
              ? "Actualizar Alerta de Precio"
              : "Crear Alerta de Precio"}
          </DialogTitle>
          <DialogDescription>
            Te notificaremos cuando el precio de {vehicle.name} baje al monto
            que especifiques.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {hasExistingAlert && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Ya tienes una alerta activa para este vehículo
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Puedes actualizarla con un nuevo precio o eliminarla.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Price Display */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Precio actual</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatPrice(vehicle.price)}
            </p>
          </div>

          {/* Target Price Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <TrendingDown className="w-4 h-4 inline mr-1" />
              Precio objetivo (COP) *
            </label>
            <Input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="Ej: 45000000"
              required
              min="1"
              max={vehicle.price - 1}
              className="text-lg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ingresa el precio al que te gustaría comprar este vehículo
            </p>
          </div>

          {/* Suggested Prices */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              Precios sugeridos:
            </p>
            <div className="grid grid-cols-3 gap-3">
              {suggestedPrices.map((suggestion) => (
                <button
                  key={suggestion.discount}
                  type="button"
                  onClick={() => setTargetPrice(suggestion.price.toString())}
                  className={`
                    p-3 rounded-lg border-2 transition-all
                    ${
                      targetPrice === suggestion.price.toString()
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                    }
                  `}
                >
                  <p className="text-xs text-gray-600 mb-1">
                    {suggestion.discount} de descuento
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    ${suggestion.price.toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Price Difference Display */}
          {targetPrice && parseInt(targetPrice) > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-purple-900">
                <TrendingDown className="w-4 h-4 inline mr-1" />
                Te ahorrarías{" "}
                <span className="font-bold">
                  {formatPrice(vehicle.price - parseInt(targetPrice))}
                </span>{" "}
                (
                {((1 - parseInt(targetPrice) / vehicle.price) * 100).toFixed(1)}
                % de descuento)
              </p>
            </div>
          )}

          {/* How It Works */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-900 mb-2">
              ¿Cómo funciona?
            </p>
            <ul className="text-xs text-gray-600 space-y-1.5 ml-4 list-disc">
              <li>
                Recibirás un email cuando el precio baje a tu precio objetivo
              </li>
              <li>
                Puedes modificar o eliminar la alerta en cualquier momento
              </li>
              <li>
                Solo se activa si el vendedor actualiza el precio manualmente
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {hasExistingAlert && (
              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
              >
                Eliminar Alerta
              </Button>
            )}
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !targetPrice ||
                parseInt(targetPrice) >= vehicle.price
              }
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  {hasExistingAlert ? "Actualizando..." : "Creando..."}
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 mr-2" />
                  {hasExistingAlert ? "Actualizar Alerta" : "Crear Alerta"}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
