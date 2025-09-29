"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { vehicles, Vehicle } from "@/data/vehicles";
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

const ElectricLoader = dynamic(() => import("@/components/ElectricLoader"), {
  ssr: false,
  loading: () => (
    <div className="w-16 h-16 bg-blue-100 rounded-full animate-pulse" />
  ),
});

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(
    process.env.NODE_ENV === "test" ? false : true
  );
  const [results, setResults] = useState<Vehicle[]>(vehicles);
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

  useEffect(() => {
    // Skip loading simulation in test environment
    if (process.env.NODE_ENV === "test") {
      setLoading(false);
      return;
    }

    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Parse search parameters
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

    // Filter vehicles based on search criteria
    let filteredVehicles = vehicles;

    if (searchFilters.vehicleType.length > 0) {
      filteredVehicles = filteredVehicles.filter((v) =>
        searchFilters.vehicleType.includes(v.type)
      );
    }

    if (searchFilters.reviews.length > 0) {
      filteredVehicles = filteredVehicles.filter((v) => {
        return searchFilters.reviews.some((rating) => {
          const minRating = parseFloat(rating.replace("+", ""));
          return v.reviews.average >= minRating;
        });
      });
    }

    if (searchFilters.dealerRating.length > 0) {
      filteredVehicles = filteredVehicles.filter((v) => {
        return searchFilters.dealerRating.some((rating) => {
          const minRating = parseFloat(rating.replace("+", ""));
          return v.dealer.rating >= minRating;
        });
      });
    }

    if (searchFilters.location.length > 0) {
      filteredVehicles = filteredVehicles.filter((v) =>
        searchFilters.location.includes(v.location)
      );
    }

    if (searchFilters.availability.length > 0) {
      filteredVehicles = filteredVehicles.filter((v) =>
        searchFilters.availability.includes(v.availability)
      );
    }

    if (searchFilters.brands.length > 0) {
      filteredVehicles = filteredVehicles.filter((v) =>
        searchFilters.brands.includes(v.brand)
      );
    }

    if (searchFilters.priceMin > 0 || searchFilters.priceMax > 0) {
      filteredVehicles = filteredVehicles.filter((v) => {
        const price = v.price;
        if (searchFilters.priceMin > 0 && searchFilters.priceMax > 0) {
          return (
            price >= searchFilters.priceMin && price <= searchFilters.priceMax
          );
        } else if (searchFilters.priceMin > 0) {
          return price >= searchFilters.priceMin;
        } else if (searchFilters.priceMax > 0) {
          return price <= searchFilters.priceMax;
        }
        return true;
      });
    }

    if (searchFilters.batteryRange.length > 0) {
      filteredVehicles = filteredVehicles.filter((v) => {
        const range = parseInt(v.specifications.range);
        return searchFilters.batteryRange.some((batteryRange) => {
          const [minRange, maxRange] = batteryRange.split("-").map(Number);
          if (maxRange) {
            return range >= minRange && range <= maxRange;
          } else {
            return range >= minRange;
          }
        });
      });
    }

    setResults(filteredVehicles);

    return () => clearTimeout(timer);
  }, [searchParams]);

  // Re-filter when filters change
  useEffect(() => {
    let filteredVehicles = vehicles;

    if (filters.vehicleType.length > 0) {
      filteredVehicles = filteredVehicles.filter((v) =>
        filters.vehicleType.includes(v.type)
      );
    }

    if (filters.reviews.length > 0) {
      filteredVehicles = filteredVehicles.filter((v) => {
        return filters.reviews.some((rating) => {
          const minRating = parseFloat(rating.replace("+", ""));
          return v.reviews.average >= minRating;
        });
      });
    }

    if (filters.dealerRating.length > 0) {
      filteredVehicles = filteredVehicles.filter((v) => {
        return filters.dealerRating.some((rating) => {
          const minRating = parseFloat(rating.replace("+", ""));
          return v.dealer.rating >= minRating;
        });
      });
    }

    if (filters.location.length > 0) {
      filteredVehicles = filteredVehicles.filter((v) =>
        filters.location.includes(v.location)
      );
    }

    if (filters.availability.length > 0) {
      filteredVehicles = filteredVehicles.filter((v) =>
        filters.availability.includes(v.availability)
      );
    }

    if (filters.brands.length > 0) {
      filteredVehicles = filteredVehicles.filter((v) =>
        filters.brands.includes(v.brand)
      );
    }

    if (filters.priceMin > 0 || filters.priceMax > 0) {
      filteredVehicles = filteredVehicles.filter((v) => {
        const price = v.price;
        if (filters.priceMin > 0 && filters.priceMax > 0) {
          return price >= filters.priceMin && price <= filters.priceMax;
        } else if (filters.priceMin > 0) {
          return price >= filters.priceMin;
        } else if (filters.priceMax > 0) {
          return price <= filters.priceMax;
        }
        return true;
      });
    }

    if (filters.batteryRange.length > 0) {
      filteredVehicles = filteredVehicles.filter((v) => {
        const range = parseInt(v.specifications.range);
        return filters.batteryRange.some((batteryRange) => {
          const [minRange, maxRange] = batteryRange.split("-").map(Number);
          if (maxRange) {
            return range >= minRange && range <= maxRange;
          } else {
            return range >= minRange;
          }
        });
      });
    }

    setResults(filteredVehicles);
  }, [filters]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <ElectricLoader size="lg" text="Buscando vehículos eléctricos..." />
        </div>
        <Footer />
      </div>
    );
  }

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
                {results.length} vehículos encontrados
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
                                {option.count}
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
            {results.length > 0 ? (
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
            ) : (
              <div className="text-center py-12">
                <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No se encontraron vehículos
                </h3>
                <p className="text-gray-600 mb-6">
                  Intenta ajustar tus filtros de búsqueda
                </p>
                <Button onClick={() => router.push("/")}>
                  Volver a Búsqueda
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
