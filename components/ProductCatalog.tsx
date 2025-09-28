"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

export default function ProductCatalog() {
  const [selectedType, setSelectedType] = useState<string>("all");

  const typeIcons = {
    motorbike: Car,
    scooter: Car,
    bicycle: Car,
    car: Car,
  };

  const typeLabels = {
    motorbike: "Motocicletas",
    scooter: "Scooters",
    bicycle: "Bicicletas",
    car: "Carros",
  };

  return (
    <section id="vehiculos" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Compara por Categoría
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Filtra vehículos eléctricos por tipo para encontrar exactamente lo
            que buscas. Compara especificaciones, precios y características de
            diferentes marcas.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.keys(typeLabels).map((type) => {
            const Icon = typeIcons[type as keyof typeof typeIcons];
            return (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                onClick={() => setSelectedType(type)}
                className="flex items-center space-x-2"
              >
                <Icon className="w-4 h-4" />
                <span>{typeLabels[type as keyof typeof typeLabels]}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
