"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Car, ArrowLeft, Filter, Grid3X3, List } from "lucide-react";
import { SearchFilters } from "@/types";
import { filterSections, sortOptions } from "@/data";
import { VehicleListCard } from "@/components/resultados/VehicleListCard";
import { VehicleCard } from "@/components/resultados/VehicleCard";
import { VehicleSkeletonGrid } from "@/components/VehicleCardSkeleton";
import FloatingAskButton from "@/components/FloatingAskButton";
import { useVehicleSearch } from "@/hooks/useVehicleSearch";

function SearchResultsPageInner() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [showFilters, setShowFilters] = useState(false);
  const {
    loading,
    results,
    totalCount,
    currentPage,
    hasNextPage,
    hasPrevPage,
    error,
    sortBy,
    filters,
    setCurrentPage,
    setSortBy,
    setFilters,
    handleFilterChange,
    clearAllFilters,
    fetchVehicles,
    getFilterCount,
    getActiveFiltersCount,
  } = useVehicleSearch();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Búsqueda</span>
            </Button>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filtros</span>
                {getActiveFiltersCount() > 0 && (
                  <Badge className="ml-2 bg-blue-600 text-white">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Vehículos Eléctricos
              </h1>
              <p className="text-gray-600">
                {totalCount} vehículo{totalCount !== 1 ? "s" : ""} encontrado
                {totalCount !== 1 ? "s" : ""}
                {currentPage > 0 && ` (Página ${currentPage + 1})`}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="hidden md:flex border border-gray-300 rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Left Sidebar - Filters */}
          <div
            className={`w-80 flex-shrink-0 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  Limpiar todo
                </Button>
              </div>

              {filterSections.map((section, index) => (
                <div key={index} className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    {section.title}
                  </h4>
                  {section.filters.map((filter, filterIndex) => (
                    <div key={filterIndex}>
                      {filter.type === "checkbox" && filter.options && (
                        <div className="space-y-2">
                          {filter.options.map((option) => (
                            <div
                              key={option.value}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${filter.key}-${option.value}`}
                                  checked={
                                    Array.isArray(
                                      filters[filter.key as keyof SearchFilters]
                                    ) &&
                                    (
                                      filters[
                                        filter.key as keyof SearchFilters
                                      ] as string[]
                                    ).includes(option.value)
                                  }
                                  onCheckedChange={(checked: boolean) =>
                                    handleFilterChange(
                                      filter.key,
                                      option.value,
                                      checked
                                    )
                                  }
                                />
                                <label
                                  htmlFor={`${filter.key}-${option.value}`}
                                  className="text-sm text-gray-700 cursor-pointer"
                                >
                                  {option.label}
                                </label>
                              </div>
                              <span className="text-sm text-gray-500">
                                {getFilterCount(filter.key, option.value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      {filter.type === "range" && (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              placeholder="Min"
                              value={
                                filters.priceMin === 0 ? "" : filters.priceMin
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                setFilters((prev) => ({
                                  ...prev,
                                  priceMin:
                                    value === "" ? 0 : parseInt(value) || 0,
                                }));
                              }}
                              className="w-28"
                              min="0"
                            />
                            <span className="text-gray-500">-</span>
                            <Input
                              type="number"
                              placeholder="Max"
                              value={
                                filters.priceMax === 0 ? "" : filters.priceMax
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                setFilters((prev) => ({
                                  ...prev,
                                  priceMax:
                                    value === "" ? 0 : parseInt(value) || 0,
                                }));
                              }}
                              className="w-28"
                              min="0"
                            />
                          </div>
                          <div className="text-sm text-gray-600">
                            Rango: ${filters.priceMin.toLocaleString()} - $
                            {filters.priceMax.toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content - Results */}
          <div className="flex-1">
            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <div className="flex items-center space-x-3">
                  <Car className="w-6 h-6 text-red-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-900">
                      Error al cargar vehículos
                    </h3>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
                <Button
                  onClick={() => fetchVehicles()}
                  variant="outline"
                  className="mt-4"
                >
                  Intentar de nuevo
                </Button>
              </div>
            )}

            {/* Loading State - Skeleton Loaders */}
            {loading && !error && (
              <VehicleSkeletonGrid count={6} viewMode={viewMode} />
            )}

            {/* Results */}
            {!loading && !error && results.length > 0 ? (
              <>
                <div
                  className={`grid gap-6 ${
                    viewMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  }`}
                >
                  {results.map((vehicle) =>
                    viewMode === "list" ? (
                      <VehicleListCard key={vehicle.id} vehicle={vehicle} />
                    ) : (
                      <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    )
                  )}
                </div>

                {/* Pagination Controls */}
                {(hasNextPage || hasPrevPage) && (
                  <div className="mt-8 flex items-center justify-center space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                      disabled={!hasPrevPage}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Anterior
                    </Button>

                    <span className="text-sm text-gray-600">
                      Página {currentPage + 1}
                    </span>

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((p) => p + 1)}
                      disabled={!hasNextPage}
                    >
                      Siguiente
                      <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                    </Button>
                  </div>
                )}
              </>
            ) : !loading && !error ? (
              <div className="text-center py-12">
                <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No se encontraron vehículos
                </h3>
                <p className="text-gray-600 mb-6">
                  Intenta ajustar tus filtros de búsqueda o{" "}
                  <button
                    onClick={clearAllFilters}
                    className="text-blue-600 hover:underline"
                  >
                    limpiar todos los filtros
                  </button>
                </p>
                <Button onClick={() => router.push("/")}>
                  Volver a Búsqueda
                </Button>
              </div>
            ) : null}
          </div>
        </div>
        <FloatingAskButton />
      </main>
    </div>
  );
}

// Wrap the page that calls useSearchParams in a Suspense boundary
export default function SearchResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-10">
          <div className="w-16 h-16 bg-blue-100 rounded-full animate-pulse" />
        </div>
      }
    >
      <SearchResultsPageInner />
    </Suspense>
  );
}
