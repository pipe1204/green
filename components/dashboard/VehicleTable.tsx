"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Vehicle } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Trash2,
  Eye,
  Car,
  Battery,
  Clock,
  Zap,
  MapPin,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  formatPrice,
  getAvailabilityColor,
  getAvailabilityText,
  getVehicleTypeText,
  truncateText,
} from "@/lib/utils";

interface VehicleTableProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
  onView?: (vehicle: Vehicle) => void;
  loading?: boolean;
}

type SortField = "name" | "price" | "availability" | "createdAt";
type SortDirection = "asc" | "desc";

interface SortConfig {
  field: SortField | null;
  direction: SortDirection;
}

export function VehicleTable({
  vehicles,
  onEdit,
  onDelete,
  onView,
  loading = false,
}: VehicleTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: null,
    direction: "asc",
  });

  // Coerce enum-like objects to strings (same logic as VendorVehicleCard)
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

  const handleSort = (field: SortField) => {
    setSortConfig((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedVehicles = React.useMemo(() => {
    if (!sortConfig.field) return vehicles;

    return [...vehicles].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortConfig.field) {
        case "name":
          aValue = coerceText(a.name);
          bValue = coerceText(b.name);
          break;
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "availability":
          aValue = coerceEnum(a.availability);
          bValue = coerceEnum(b.availability);
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [vehicles, sortConfig]);

  const SortButton = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left hover:text-gray-900 transition-colors"
    >
      <span>{children}</span>
      {sortConfig.field === field &&
        (sortConfig.direction === "asc" ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        ))}
    </button>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando vehículos...</p>
        </div>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Car className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No tienes vehículos registrados
          </h3>
          <p className="text-gray-600">
            Comienza agregando tu primer vehículo eléctrico
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Desktop Table Header */}
      <div className="hidden md:block px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
          <div className="col-span-4">
            <SortButton field="name">Vehículo</SortButton>
          </div>
          <div className="col-span-2">
            <SortButton field="price">Precio</SortButton>
          </div>
          <div className="col-span-2">
            <span>Especificaciones</span>
          </div>
          <div className="col-span-2">
            <SortButton field="availability">Disponibilidad</SortButton>
          </div>
          <div className="col-span-2 text-center">
            <span>Acciones</span>
          </div>
        </div>
      </div>

      {/* Mobile Table Header */}
      <div className="md:hidden px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm font-medium text-gray-700">
          <SortButton field="name">Mis Vehículos</SortButton>
          <span className="text-xs text-gray-500">
            {vehicles.length} vehículo{vehicles.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {sortedVehicles.map((vehicle) => {
          const availability = coerceEnum(vehicle.availability);
          const vehicleType = coerceEnum(vehicle.type);

          return (
            <div
              key={vehicle.id}
              className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
            >
              {/* Desktop Layout */}
              <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                {/* Vehicle Info */}
                <div className="col-span-4 flex items-center space-x-3">
                  <div className="relative w-16 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {Array.isArray(vehicle.images) &&
                    vehicle.images.length > 0 ? (
                      <Image
                        src={coerceText(vehicle.images[0]?.url)}
                        alt={coerceText(vehicle.images[0]?.alt || vehicle.name)}
                        fill
                        className="object-cover"
                        sizes="64px"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const placeholder =
                            target.nextElementSibling as HTMLElement;
                          if (placeholder) placeholder.style.display = "flex";
                        }}
                      />
                    ) : null}
                    {/* Placeholder for missing images */}
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-gray-100"
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
                      <Car className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {coerceText(vehicle.name)}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {getVehicleTypeText(vehicleType)}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {truncateText(coerceText(vehicle.location), 20)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-2">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatPrice(vehicle.price)}
                  </p>
                  <p className="text-xs text-gray-500">COP</p>
                </div>

                {/* Specifications */}
                <div className="col-span-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <Battery className="w-3 h-3 text-blue-500" />
                      <span className="text-xs text-gray-600">
                        {coerceText(vehicle?.specifications?.range)} km
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-gray-600">
                        {coerceText(vehicle?.specifications?.chargeTime)}h
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs text-gray-600">
                        {coerceText(
                          vehicle?.specifications?.performance?.maxSpeed
                        )}{" "}
                        km/h
                      </span>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div className="col-span-2">
                  <Badge
                    variant="outline"
                    className={`${getAvailabilityColor(availability)} text-xs`}
                  >
                    {getAvailabilityText(availability)}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="col-span-2">
                  <div className="flex items-center justify-center space-x-1">
                    {onView && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onView(vehicle)}
                        className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(vehicle)}
                      className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(vehicle.id)}
                      className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="md:hidden space-y-3">
                {/* Vehicle Info Row */}
                <div className="flex items-start space-x-3">
                  <div className="relative w-16 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {Array.isArray(vehicle.images) &&
                    vehicle.images.length > 0 ? (
                      <Image
                        src={coerceText(vehicle.images[0]?.url)}
                        alt={coerceText(vehicle.images[0]?.alt || vehicle.name)}
                        fill
                        className="object-cover"
                        sizes="64px"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const placeholder =
                            target.nextElementSibling as HTMLElement;
                          if (placeholder) placeholder.style.display = "flex";
                        }}
                      />
                    ) : null}
                    {/* Placeholder for missing images */}
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-gray-100"
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
                      <Car className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {coerceText(vehicle.name)}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {getVehicleTypeText(vehicleType)}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {truncateText(coerceText(vehicle.location), 25)}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${getAvailabilityColor(availability)} text-xs`}
                  >
                    {getAvailabilityText(availability)}
                  </Badge>
                </div>

                {/* Price and Specs Row */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatPrice(vehicle.price)}
                    </p>
                    <p className="text-xs text-gray-500">COP</p>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Battery className="w-3 h-3 text-blue-500" />
                      <span>
                        {coerceText(vehicle?.specifications?.range)} km
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-yellow-500" />
                      <span>
                        {coerceText(
                          vehicle?.specifications?.performance?.maxSpeed
                        )}{" "}
                        km/h
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex items-center justify-center space-x-4 pt-2 border-t border-gray-100">
                  {onView && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onView(vehicle)}
                      className="flex items-center space-x-1 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-xs">Ver</span>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(vehicle)}
                    className="flex items-center space-x-1 hover:bg-green-50 hover:text-green-600"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="text-xs">Editar</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(vehicle.id)}
                    className="flex items-center space-x-1 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-xs">Eliminar</span>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Footer */}
      <div className="px-4 md:px-6 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <p className="text-sm text-gray-600">
            Mostrando {vehicles.length} vehículo
            {vehicles.length !== 1 ? "s" : ""}
          </p>
          {vehicles.length > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Total estimado:</span>
              <span className="font-semibold text-gray-900">
                {formatPrice(
                  vehicles.reduce((sum, vehicle) => sum + vehicle.price, 0)
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
