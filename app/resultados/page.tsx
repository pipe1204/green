"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getFilteredVehicles, getAllVehicles } from "@/lib/vehicle-queries";
import { handleVehicleError } from "@/lib/error-handler";
import { Vehicle } from "@/types";
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

function SearchResultsPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Vehicle[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [filters, setFilters] = useState<SearchFilters>({
    vehicleType: [],
    batteryRange: [],
    warranty: [],
    priceMin: 0,
    priceMax: 0,
    location: [],
    reviews: [],
    dealerRating: [],
    availability: [],
    passengerCapacity: [],
    chargingTime: [],
    maxSpeed: [],
    power: [],
    brands: [],
  });
  const [allVehiclesForCounts, setAllVehiclesForCounts] = useState<Vehicle[]>(
    []
  );

  const PAGE_SIZE = 20;

  // Parse search parameters on mount
  useEffect(() => {
    const searchFilters: SearchFilters = {
      vehicleType: searchParams.get("vehicleType")?.split(",") || [],
      batteryRange: searchParams.get("batteryRange")?.split(",") || [],
      warranty: searchParams.get("warranty")?.split(",") || [],
      priceMin: parseInt(searchParams.get("priceMin") || "0"),
      priceMax: parseInt(searchParams.get("priceMax") || "0"),
      location: searchParams.get("location")?.split(",") || [],
      reviews: searchParams.get("reviews")?.split(",") || [],
      dealerRating: searchParams.get("dealerRating")?.split(",") || [],
      availability: searchParams.get("availability")?.split(",") || [],
      passengerCapacity:
        searchParams.get("passengerCapacity")?.split(",") || [],
      chargingTime: searchParams.get("chargingTime")?.split(",") || [],
      maxSpeed: searchParams.get("maxSpeed")?.split(",") || [],
      power: searchParams.get("power")?.split(",") || [],
      brands: searchParams.get("brands")?.split(",") || [],
    };

    setFilters(searchFilters);
  }, [searchParams]);

  // Fetch vehicles from database
  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getFilteredVehicles(
        filters,
        sortBy,
        currentPage,
        PAGE_SIZE
      );

      setResults(result.vehicles);
      setTotalCount(result.totalCount);
      setHasNextPage(result.hasNextPage);
      setHasPrevPage(result.hasPrevPage);
    } catch (err) {
      setError(handleVehicleError(err));
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, currentPage]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Fetch all vehicles once for filter counts
  useEffect(() => {
    const fetchAllForCounts = async () => {
      try {
        const allVehicles = await getAllVehicles();
        setAllVehiclesForCounts(allVehicles);
      } catch (err) {
        console.error("Error fetching vehicles for counts:", err);
        // Don't show error to user, just use empty array
        setAllVehiclesForCounts([]);
      }
    };
    fetchAllForCounts();
  }, []); // Run once on mount

  // Calculate dynamic filter counts
  const getFilterCount = (filterKey: string, filterValue: string): number => {
    if (allVehiclesForCounts.length === 0) return 0;

    switch (filterKey) {
      case "vehicleType":
        return allVehiclesForCounts.filter((v) => v.type === filterValue)
          .length;

      case "location":
        return allVehiclesForCounts.filter((v) => v.location === filterValue)
          .length;

      case "availability":
        return allVehiclesForCounts.filter(
          (v) => v.availability === filterValue
        ).length;

      case "batteryRange": {
        const [min, max] = filterValue.split("-").map(Number);
        return allVehiclesForCounts.filter((v) => {
          const range = parseInt(v.specifications.range);
          return max ? range >= min && range <= max : range >= min;
        }).length;
      }

      case "reviews": {
        const minRating = parseFloat(filterValue.replace("+", ""));
        return allVehiclesForCounts.filter(
          (v) => v.reviews.average >= minRating
        ).length;
      }

      case "dealerRating": {
        const minRating = parseFloat(filterValue.replace("+", ""));
        return allVehiclesForCounts.filter((v) => v.dealer.rating >= minRating)
          .length;
      }

      case "chargingTime": {
        if (filterValue === "8+") {
          return allVehiclesForCounts.filter(
            (v) => parseFloat(v.chargingTime || "0") >= 8
          ).length;
        }
        const [min, max] = filterValue.split("-").map(Number);
        return allVehiclesForCounts.filter((v) => {
          const time = parseFloat(v.chargingTime || "0");
          return time >= min && time <= max;
        }).length;
      }

      case "maxSpeed": {
        if (filterValue === "150+") {
          return allVehiclesForCounts.filter(
            (v) => parseInt(v.maxSpeed || "0") >= 150
          ).length;
        }
        const [min, max] = filterValue.split("-").map(Number);
        return allVehiclesForCounts.filter((v) => {
          const speed = parseInt(v.maxSpeed || "0");
          return speed >= min && speed <= max;
        }).length;
      }

      case "warranty": {
        // Format: "years:2+" or "km:50000+"
        const [unit, minValueStr] = filterValue.split(":");
        const minValue = parseInt(minValueStr.replace("+", ""));

        return allVehiclesForCounts.filter((v) => {
          const warrantyStr = v.specifications.warranty || "";

          if (unit === "years") {
            // Extract years from warranty string like "2 años" or "3 años"
            const yearsMatch = warrantyStr.match(/(\d+)\s*año/);
            if (yearsMatch) {
              return parseInt(yearsMatch[1]) >= minValue;
            }
          } else if (unit === "km") {
            // Extract km from warranty string like "50000 km" or "100000 km"
            const kmMatch = warrantyStr.match(/(\d+)\s*km/);
            if (kmMatch) {
              return parseInt(kmMatch[1]) >= minValue;
            }
          }

          return false;
        }).length;
      }

      default:
        return 0;
    }
  };

  const handleFilterChange = (
    filterKey: string,
    value: string,
    checked: boolean
  ) => {
    setFilters((prev) => {
      const currentArray = prev[filterKey as keyof SearchFilters] as string[];
      if (Array.isArray(currentArray)) {
        if (checked) {
          return {
            ...prev,
            [filterKey]: [...currentArray, value],
          };
        } else {
          return {
            ...prev,
            [filterKey]: currentArray.filter((item) => item !== value),
          };
        }
      }
      return prev;
    });
  };

  const clearAllFilters = () => {
    setFilters({
      vehicleType: [],
      batteryRange: [],
      warranty: [],
      priceMin: 0,
      priceMax: 0,
      location: [],
      reviews: [],
      dealerRating: [],
      availability: [],
      passengerCapacity: [],
      chargingTime: [],
      maxSpeed: [],
      power: [],
      brands: [],
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).reduce((count, filter) => {
      if (Array.isArray(filter)) {
        return count + filter.length;
      }
      return count;
    }, 0);
  };

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
