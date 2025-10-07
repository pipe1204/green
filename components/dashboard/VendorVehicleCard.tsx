"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Vehicle } from "@/types";
import {
  Battery,
  Car,
  Clock,
  Eye,
  MapPin,
  Shield,
  Users,
  Zap,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
} from "lucide-react";
import {
  formatPrice,
  getAvailabilityColor,
  getAvailabilityText,
  getVehicleTypeText,
  truncateText,
} from "@/lib/utils";

interface VendorVehicleCardProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
  onView?: (vehicle: Vehicle) => void;
}

export default function VendorVehicleCard({
  vehicle,
  onEdit,
  onDelete,
  onView,
}: VendorVehicleCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Coerce enum-like objects (e.g., { type: 'enum', value: 'in-stock' }) to strings
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

  const availability = coerceEnum(vehicle.availability as unknown);
  const vehicleType = coerceEnum(vehicle.type as unknown);
  const coerceText = (val: unknown): string => coerceEnum(val);

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

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group max-w-3xl w-full mx-auto">
      <div className="flex flex-col md:flex-row md:items-stretch">
        {/* Vehicle Image - Responsive Layout */}
        <div className="relative w-full md:w-72 h-60 md:h-auto bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 overflow-hidden">
          {/* Carousel Images */}
          <div className="relative w-full h-full">
            {Array.isArray(vehicle.images) && vehicle.images.length > 0 ? (
              <Image
                src={coerceText(vehicle.images[currentImageIndex]?.url)}
                alt={coerceText(
                  vehicle.images[currentImageIndex]?.alt || vehicle.name
                )}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 320px"
                priority={currentImageIndex === 0}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const placeholder = target.nextElementSibling as HTMLElement;
                  if (placeholder) placeholder.style.display = "flex";
                }}
              />
            ) : null}
            {/* Placeholder for missing images */}
            <div
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
              style={{
                display:
                  Array.isArray(vehicle.images) && vehicle.images.length === 0
                    ? "flex"
                    : Array.isArray(vehicle.images)
                    ? "none"
                    : "flex",
              }}
            >
              <div className="text-center">
                <Car className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Imagen no disponible</p>
              </div>
            </div>

            {/* Carousel Navigation */}
            {Array.isArray(vehicle.images) && vehicle.images.length > 1 && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>

                {/* Image Indicators */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {vehicle.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex
                          ? "bg-white"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="absolute top-4 right-4 flex space-x-2">
            {onView && (
              <Button
                size="sm"
                variant="outline"
                className="bg-white/90 hover:bg-white"
                onClick={() => onView(vehicle)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="bg-white/90 hover:bg-white"
              onClick={() => onEdit(vehicle)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
              onClick={() => onDelete(vehicle.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <div
              className={`${getAvailabilityColor(
                availability
              )} border rounded-full px-2 py-1 text-xs font-semibold`}
            >
              {getAvailabilityText(availability)}
            </div>
            {vehicle.is_on_sale && (
              <div className="bg-red-500 text-white border border-red-600 rounded-full px-3 py-1 text-xs font-bold shadow-lg">
                🔥 EN OFERTA
              </div>
            )}
          </div>
        </div>

        {/* Vehicle Info - Responsive Layout */}
        <div className="flex-1 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
            <div className="flex-1 mb-2 sm:mb-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                  {truncateText(coerceText(vehicle.name), 25)}
                </h3>
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">
                    {getVehicleTypeText(vehicleType)}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-1 mb-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {coerceText(vehicle.location)}
                </span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              {vehicle.is_on_sale && vehicle.sale_price ? (
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <p className="text-xl md:text-2xl font-bold text-red-600">
                      {formatPrice(vehicle.sale_price)}
                    </p>
                    <span className="text-sm text-gray-500">COP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-lg text-gray-400 line-through">
                      {formatPrice(vehicle.price)}
                    </p>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                      -
                      {Math.round(
                        ((vehicle.price - vehicle.sale_price) / vehicle.price) *
                          100
                      )}
                      % OFF
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">
                    {formatPrice(vehicle.price)}
                  </p>
                  <p className="text-sm text-gray-500">COP</p>
                </div>
              )}
            </div>
          </div>

          {/* Key Specs - Responsive Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Battery className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">
                {coerceText(vehicle?.specifications?.range)} km
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600">
                {coerceText(vehicle?.specifications?.chargeTime)}h
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-600">
                {coerceText(vehicle?.specifications?.performance?.maxSpeed)}{" "}
                km/h
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-600">
                {vehicle.passengerCapacity} pasajeros
              </span>
            </div>
          </div>

          {/* Warranty */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Shield className="w-4 h-4 text-green-500" />
            <span>{coerceText(vehicle?.specifications?.warranty)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
