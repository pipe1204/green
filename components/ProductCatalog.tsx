"use client";

import { useState } from "react";
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
    other: Car,
  };

  const typeLabels = {
    motorbike: "Motocicletas",
    scooter: "Scooters",
    bicycle: "Bicicletas",
    other: "Otros",
  };

  const handleColorSelect = (product: Product, color: ColorOption) => {
    setSelectedProduct(product);
    setSelectedColor(color);
  };

  const handleOrderClick = () => {
    if (selectedProduct && selectedColor) {
      onOrderProduct(selectedProduct, selectedColor);
    }
  };

  return (
    <section id="vehiculos" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Nuestros Vehículos Eléctricos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre nuestra línea completa de vehículos eléctricos diseñados
            para un futuro más sostenible
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Product Image */}
              <div className="relative h-64 bg-gray-200">
                <div
                  className="w-full h-full bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${
                      product.images.find((img) => img.isHero)?.url ||
                      "/images/placeholder.jpg"
                    })`,
                  }}
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.availability === "in-stock"
                        ? "bg-green-100 text-green-800"
                        : product.availability === "pre-order"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.availability === "in-stock"
                      ? "En Stock"
                      : product.availability === "pre-order"
                      ? "Pre-orden"
                      : "Próximamente"}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Key Specs */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <span className="text-gray-500">Rango:</span>
                    <p className="font-semibold">
                      {product.specifications.battery.range}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Velocidad:</span>
                    <p className="font-semibold">
                      {product.specifications.performance.maxSpeed}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <p className="text-2xl font-bold text-primary">
                    ${product.price.toLocaleString("es-CO")} COP
                  </p>
                  <p className="text-sm text-gray-500">
                    Pago en 4 cuotas de $
                    {Math.round(product.price / 4).toLocaleString("es-CO")} COP
                  </p>
                </div>

                {/* Color Options */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Colores disponibles:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => handleColorSelect(product, color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                          selectedProduct?.id === product.id &&
                          selectedColor?.id === color.id
                            ? "border-gray-900 scale-110"
                            : "border-gray-300 hover:border-gray-500"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={handleOrderClick}
                    disabled={
                      !selectedColor || selectedProduct?.id !== product.id
                    }
                  >
                    Ordena este modelo
                  </Button>
                  <Button variant="outline" className="w-full">
                    Ver detalles
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Environmental Benefits */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">
            Beneficios Ambientales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Cero Emisiones</h4>
              <p className="text-gray-600 text-sm">
                No contamina el aire que respiramos
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Energía Limpia</h4>
              <p className="text-gray-600 text-sm">
                Funciona con electricidad renovable
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-yellow-600" />
              </div>
              <h4 className="font-semibold mb-2">Silencioso</h4>
              <p className="text-gray-600 text-sm">
                Reduce la contaminación acústica
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Eficiente</h4>
              <p className="text-gray-600 text-sm">
                Menor costo de mantenimiento
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
