"use client";

import React from "react";
import { Vehicle } from "@/types";
import VendorVehicleCard from "@/components/dashboard/VendorVehicleCard";

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
        <VendorVehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
}
