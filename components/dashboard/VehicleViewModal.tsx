"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Vehicle } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Battery,
  Clock,
  Zap,
  MapPin,
  Shield,
  Users,
  Star,
  ChevronLeft,
  ChevronRight,
  Calendar,
  DollarSign,
  Gauge,
  CheckCircle,
} from "lucide-react";
import {
  formatPrice,
  getAvailabilityColor,
  getAvailabilityText,
  getVehicleTypeText,
} from "@/lib/utils";

interface VehicleViewModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VehicleViewModal({
  vehicle,
  isOpen,
  onClose,
}: VehicleViewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!vehicle) return null;

  // Coerce enum-like objects to strings (same logic as other components)
  const coerceEnum = (val: unknown): string => {
    if (typeof val === "string") return val;
    if (
      val !== null &&
      typeof val === "object" &&
      "value" in (val as Record<string, unknown>)
    ) {
      return String((val as { value: unknown }).value);
    }
    return String(val ?? "");
  };

  const coerceText = (val: unknown): string => coerceEnum(val);

  const availability = coerceEnum(vehicle.availability);
  const vehicleType = coerceEnum(vehicle.type);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === vehicle.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? vehicle.images.length - 1 : prev - 1
    );
  };

  const currentImage = vehicle.images[currentImageIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Car className="w-6 h-6 text-green-600" />
            <span>{coerceText(vehicle.name)}</span>
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            Información completa del vehículo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Gallery */}
          <div className="relative">
            <div className="relative w-full h-64 md:h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
              {Array.isArray(vehicle.images) && vehicle.images.length > 0 ? (
                <>
                  <Image
                    src={coerceText(currentImage?.url)}
                    alt={coerceText(currentImage?.alt || vehicle.name)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                    priority={currentImageIndex === 0}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const placeholder =
                        target.nextElementSibling as HTMLElement;
                      if (placeholder) placeholder.style.display = "flex";
                    }}
                  />
                  {/* Placeholder for missing images */}
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
                    style={{
                      display:
                        Array.isArray(vehicle.images) &&
                        vehicle.images.length === 0
                          ? "flex"
                          : Array.isArray(vehicle.images)
                          ? "none"
                          : "flex",
                    }}
                  >
                    <div className="text-center">
                      <Car className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        Imagen no disponible
                      </p>
                    </div>
                  </div>

                  {/* Navigation arrows */}
                  {vehicle.images.length > 1 && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </>
                  )}

                  {/* Image indicators */}
                  {vehicle.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {vehicle.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            index === currentImageIndex
                              ? "bg-white"
                              : "bg-white/50 hover:bg-white/75"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Car className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Imagen no disponible
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Availability badge */}
            <div className="absolute top-4 left-4">
              <Badge
                variant="outline"
                className={`${getAvailabilityColor(
                  availability
                )} text-sm px-3 py-1`}
              >
                {getAvailabilityText(availability)}
              </Badge>
            </div>
          </div>

          {/* Basic Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Información Básica
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Car className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Tipo</p>
                      <p className="text-sm text-gray-600">
                        {getVehicleTypeText(vehicleType)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Ubicación
                      </p>
                      <p className="text-sm text-gray-600">
                        {coerceText(vehicle.location)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Capacidad
                      </p>
                      <p className="text-sm text-gray-600">
                        {vehicle.passengerCapacity} pasajero
                        {vehicle.passengerCapacity !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Tiempo de Entrega
                      </p>
                      <p className="text-sm text-gray-600">
                        {coerceText(vehicle.deliveryTime)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dealer Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Información del Concesionario
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Nombre
                      </p>
                      <p className="text-sm text-gray-600">
                        {coerceText(vehicle.vendor?.businessName)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Ubicación
                      </p>
                      <p className="text-sm text-gray-600">
                        {coerceText(vehicle.location)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Calificación
                      </p>
                      <div className="flex items-center space-x-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= (vehicle.vendor?.rating || 0)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({vehicle.vendor?.rating || 0}/5)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Specifications */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Especificaciones Técnicas
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Battery className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Autonomía
                      </p>
                      <p className="text-sm text-gray-600">
                        {coerceText(vehicle?.specifications?.range)} km
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Tiempo de Carga
                      </p>
                      <p className="text-sm text-gray-600">
                        {coerceText(vehicle?.specifications?.chargeTime)} horas
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Velocidad Máxima
                      </p>
                      <p className="text-sm text-gray-600">
                        {coerceText(
                          vehicle?.specifications?.performance?.maxSpeed
                        )}{" "}
                        km/h
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Gauge className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Potencia
                      </p>
                      <p className="text-sm text-gray-600">
                        {coerceText(
                          vehicle?.specifications?.performance?.power
                        )}{" "}
                        kW
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Battery className="w-5 h-5 text-indigo-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Batería
                      </p>
                      <p className="text-sm text-gray-600">
                        {coerceText(vehicle?.specifications?.battery)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Garantía
                      </p>
                      <p className="text-sm text-gray-600">
                        {coerceText(vehicle?.specifications?.warranty)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Información de Precio
                </h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Precio Total
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatPrice(vehicle.price)}
                      </p>
                      <p className="text-sm text-gray-600">COP</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Características Destacadas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {vehicle.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{coerceText(feature)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {vehicle.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Descripción
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {coerceText(vehicle.description)}
                </p>
              </div>
            </div>
          )}

          {/* Reviews */}
          {vehicle.reviews && vehicle.reviews.count > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Reseñas
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= (vehicle.reviews?.average || 0)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {vehicle.reviews.average.toFixed(1)} de 5 estrellas
                    </p>
                    <p className="text-sm text-gray-600">
                      Basado en {vehicle.reviews.count} reseña
                      {vehicle.reviews.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
