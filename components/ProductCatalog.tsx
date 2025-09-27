"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { Product, ColorOption } from "@/types";
import { Car, Zap, Leaf, Settings } from "lucide-react";

interface ProductCatalogProps {
  onOrderProduct: (product: Product, selectedColor: ColorOption) => void;
}

export default function ProductCatalog({
  onOrderProduct,
}: ProductCatalogProps) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);

  const filteredProducts =
    selectedType === "all"
      ? products
      : products.filter((product) => product.type === selectedType);

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

  const handleColorSelect = (product: Product, color: ColorOption) => {
    setSelectedProduct(product);
    setSelectedColor(color);
  };

  return (
    <section id="vehiculos" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
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
          <Button
            variant={selectedType === "all" ? "default" : "outline"}
            onClick={() => setSelectedType("all")}
            className="flex items-center space-x-2"
          >
            <Leaf className="w-4 h-4" />
            <span>Todos</span>
          </Button>
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

        {/* Comparison Features */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">
            ¿Por qué Comparar con Nosotros?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Información Neutral</h4>
              <p className="text-gray-600 text-sm">
                Datos objetivos sin sesgo de marca
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="font-semibold mb-2">Actualización Constante</h4>
              <p className="text-gray-600 text-sm">
                Especificaciones siempre actualizadas
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-yellow-600" />
              </div>
              <h4 className="font-semibold mb-2">Filtros Avanzados</h4>
              <p className="text-gray-600 text-sm">
                Encuentra exactamente lo que necesitas
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Múltiples Marcas</h4>
              <p className="text-gray-600 text-sm">
                Compara todas las opciones disponibles
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
