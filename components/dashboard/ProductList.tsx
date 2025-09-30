"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Vehicle } from "@/types";
import { Edit, Trash2, Eye } from "lucide-react";
import Image from "next/image";

interface ProductListProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
  onView?: (vehicle: Vehicle) => void;
}

export function ProductList({
  vehicles,
  onEdit,
  onDelete,
  onView,
}: ProductListProps) {
  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No tienes vehículos registrados
        </h3>
        <p className="text-gray-600 mb-4">
          Comienza agregando tu primer vehículo eléctrico
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {vehicles.map((vehicle) => (
        <div
          key={vehicle.id}
          className="bg-white rounded-lg shadow-md p-6 border hover:shadow-lg transition-shadow"
        >
          <div className="flex gap-4">
            {/* Vehicle Image */}
            <div className="w-24 h-24 flex-shrink-0">
              {vehicle.images && vehicle.images.length > 0 ? (
                <Image
                  src={vehicle.images[0].url}
                  alt={vehicle.images[0].alt || vehicle.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/placeholder.jpg";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-xs">Sin imagen</span>
                </div>
              )}
            </div>

            {/* Vehicle Info */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 truncate">
                    {vehicle.name}
                  </h3>
                  <p className="text-gray-600">
                    {vehicle.brand} - {vehicle.type}
                  </p>
                </div>
                <div className="flex space-x-2 ml-4">
                  {onView && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(vehicle)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(vehicle)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(vehicle.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <p className="text-lg font-bold text-green-600">
                    ${vehicle.price.toLocaleString()} COP
                  </p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      vehicle.availability === "in-stock"
                        ? "bg-green-100 text-green-800"
                        : vehicle.availability === "pre-order"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {vehicle.availability === "in-stock"
                      ? "En Stock"
                      : vehicle.availability === "pre-order"
                      ? "Pre-orden"
                      : "Próximamente"}
                  </span>
                </div>
                <div className="text-sm text-gray-500">{vehicle.location}</div>
              </div>

              {/* Specifications Summary */}
              {vehicle.specifications && (
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {vehicle.specifications.range && (
                    <div>
                      <span className="font-medium text-gray-700">
                        Autonomía:
                      </span>
                      <span className="ml-1 text-gray-600">
                        {vehicle.specifications.range} km
                      </span>
                    </div>
                  )}
                  {vehicle.specifications.chargeTime && (
                    <div>
                      <span className="font-medium text-gray-700">Carga:</span>
                      <span className="ml-1 text-gray-600">
                        {vehicle.specifications.chargeTime}h
                      </span>
                    </div>
                  )}
                  {vehicle.specifications.performance?.maxSpeed && (
                    <div>
                      <span className="font-medium text-gray-700">
                        Vel. Max:
                      </span>
                      <span className="ml-1 text-gray-600">
                        {vehicle.specifications.performance.maxSpeed} km/h
                      </span>
                    </div>
                  )}
                  {vehicle.specifications.performance?.power && (
                    <div>
                      <span className="font-medium text-gray-700">
                        Potencia:
                      </span>
                      <span className="ml-1 text-gray-600">
                        {vehicle.specifications.performance.power} kW
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Features Preview */}
              {vehicle.features && vehicle.features.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1">
                    {vehicle.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                    {vehicle.features.length > 3 && (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        +{vehicle.features.length - 3} más
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
