"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { Product } from "@/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Filter,
  SortAsc,
  Grid3X3,
  List,
  Search,
  Car,
  Zap,
  Leaf,
  Clock,
  MapPin,
  Shield,
} from "lucide-react";

export default function VehiculosPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [selectedRange, setSelectedRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      // Search filter
      if (
        searchTerm &&
        !product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Type filter
      if (selectedType !== "all" && product.type !== selectedType) {
        return false;
      }

      // Price range filter
      if (selectedPriceRange !== "all") {
        const price = product.price;
        switch (selectedPriceRange) {
          case "under-5m":
            if (price >= 5000000) return false;
            break;
          case "5m-8m":
            if (price < 5000000 || price > 8000000) return false;
            break;
          case "over-8m":
            if (price <= 8000000) return false;
            break;
        }
      }

      // Range filter
      if (selectedRange !== "all") {
        const range = parseInt(product.specifications.range);
        switch (selectedRange) {
          case "under-50":
            if (range >= 50) return false;
            break;
          case "50-100":
            if (range < 50 || range > 100) return false;
            break;
          case "over-100":
            if (range <= 100) return false;
            break;
        }
      }

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "range-low":
          return (
            parseInt(a.specifications.range) - parseInt(b.specifications.range)
          );
        case "range-high":
          return (
            parseInt(b.specifications.range) - parseInt(a.specifications.range)
          );
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchTerm, selectedType, selectedPriceRange, selectedRange, sortBy]);

  const typeLabels = {
    motorbike: "Motocicletas",
    scooter: "Scooters",
    bicycle: "Bicicletas",
    other: "Otros",
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* Page Header */}
        <div className="py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nuestros Vehículos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Descubre nuestra línea completa de vehículos eléctricos diseñados
            para un futuro más sostenible. Filtra, compara y encuentra el
            perfecto para ti.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar vehículos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </Button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Ordenar por nombre</option>
              <option value="price-low">Precio: menor a mayor</option>
              <option value="price-high">Precio: mayor a menor</option>
              <option value="range-low">Autonomía: menor a mayor</option>
              <option value="range-high">Autonomía: mayor a menor</option>
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tipo de Vehículo
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="all"
                        checked={selectedType === "all"}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="mr-2"
                      />
                      Todos
                    </label>
                    {Object.entries(typeLabels).map(([type, label]) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="radio"
                          name="type"
                          value={type}
                          checked={selectedType === type}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="mr-2"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Rango de Precio
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="price"
                        value="all"
                        checked={selectedPriceRange === "all"}
                        onChange={(e) => setSelectedPriceRange(e.target.value)}
                        className="mr-2"
                      />
                      Todos
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="price"
                        value="under-5m"
                        checked={selectedPriceRange === "under-5m"}
                        onChange={(e) => setSelectedPriceRange(e.target.value)}
                        className="mr-2"
                      />
                      Menos de $5,000,000
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="price"
                        value="5m-8m"
                        checked={selectedPriceRange === "5m-8m"}
                        onChange={(e) => setSelectedPriceRange(e.target.value)}
                        className="mr-2"
                      />
                      $5,000,000 - $8,000,000
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="price"
                        value="over-8m"
                        checked={selectedPriceRange === "over-8m"}
                        onChange={(e) => setSelectedPriceRange(e.target.value)}
                        className="mr-2"
                      />
                      Más de $8,000,000
                    </label>
                  </div>
                </div>

                {/* Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Autonomía
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="range"
                        value="all"
                        checked={selectedRange === "all"}
                        onChange={(e) => setSelectedRange(e.target.value)}
                        className="mr-2"
                      />
                      Todas
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="range"
                        value="under-50"
                        checked={selectedRange === "under-50"}
                        onChange={(e) => setSelectedRange(e.target.value)}
                        className="mr-2"
                      />
                      Menos de 50 km
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="range"
                        value="50-100"
                        checked={selectedRange === "50-100"}
                        onChange={(e) => setSelectedRange(e.target.value)}
                        className="mr-2"
                      />
                      50 - 100 km
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="range"
                        value="over-100"
                        checked={selectedRange === "over-100"}
                        onChange={(e) => setSelectedRange(e.target.value)}
                        className="mr-2"
                      />
                      Más de 100 km
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Mostrando {filteredProducts.length} de {products.length} vehículos
          </p>
        </div>

        {/* Products Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => router.push(`/product/${product.id}`)}
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
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-500">
                        {product.specifications.range} km
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-500">
                        {product.specifications.chargeTime}h
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-blue-600">
                      ${product.price.toLocaleString("es-CO")} COP
                    </p>
                    <p className="text-sm text-gray-500">
                      Pago en 4 cuotas de $
                      {Math.round(product.price / 4).toLocaleString("es-CO")}{" "}
                      COP
                    </p>
                  </div>

                  {/* Action Button */}
                  <Button
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/product/${product.id}`);
                    }}
                  >
                    Ver Detalles
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => router.push(`/product/${product.id}`)}
              >
                <div className="flex">
                  {/* Product Image */}
                  <div className="w-64 h-48 bg-gray-200 flex-shrink-0">
                    <div
                      className="w-full h-full bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url(${
                          product.images.find((img) => img.isHero)?.url ||
                          "/images/placeholder.jpg"
                        })`,
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {product.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-blue-600">
                          ${product.price.toLocaleString("es-CO")} COP
                        </p>
                        <p className="text-sm text-gray-500">
                          Pago en 4 cuotas de $
                          {Math.round(product.price / 4).toLocaleString(
                            "es-CO"
                          )}{" "}
                          COP
                        </p>
                      </div>
                    </div>

                    {/* Specs */}
                    <div className="grid grid-cols-4 gap-6 mb-6">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Autonomía</p>
                          <p className="font-semibold">
                            {product.specifications.range} km
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Carga</p>
                          <p className="font-semibold">
                            {product.specifications.chargeTime}h
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Garantía</p>
                          <p className="font-semibold">
                            {product.specifications.warranty}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Leaf className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Emisiones</p>
                          <p className="font-semibold">Cero</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/product/${product.id}`);
                      }}
                    >
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron vehículos
            </h3>
            <p className="text-gray-600 mb-6">
              Intenta ajustar tus filtros de búsqueda
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedType("all");
                setSelectedPriceRange("all");
                setSelectedRange("all");
              }}
              variant="outline"
            >
              Limpiar Filtros
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
