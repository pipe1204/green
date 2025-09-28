"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Lazy load heavy components
const ElectricLoader = dynamic(() => import("@/components/ElectricLoader"), {
  ssr: false,
  loading: () => (
    <div className="w-16 h-16 bg-blue-100 rounded-full animate-pulse" />
  ),
});
import {
  vehicles,
  Vehicle,
  vehicleTypes,
  batteryRanges,
  cities,
  brands,
} from "@/data/vehicles";
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
import {
  Car,
  Battery,
  Clock,
  MapPin,
  Star,
  Zap,
  Shield,
  Users,
  ArrowLeft,
  Filter,
  Grid3X3,
  List,
  Heart,
  Eye,
} from "lucide-react";
import { FilterSection, SearchFilters, SortOption } from "@/types";

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "in-stock":
        return "bg-green-100 text-green-800 border-green-200";
      case "pre-order":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "coming-soon":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case "in-stock":
        return "Disponible";
      case "pre-order":
        return "Pre-orden";
      case "coming-soon":
        return "Próximamente";
      default:
        return "Consultar";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group">
      {/* Vehicle Image */}
      <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <Car className="w-20 h-20 text-gray-400" />
        </div>
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-white/90 hover:bg-white"
          >
            <Heart className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-white/90 hover:bg-white"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
        <div className="absolute top-4 left-4">
          <Badge
            className={`${getAvailabilityColor(vehicle.availability)} border`}
          >
            {getAvailabilityText(vehicle.availability)}
          </Badge>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {vehicle.name}
            </h3>
            <p className="text-gray-600 mb-2">{vehicle.brand}</p>
            <div className="flex items-center space-x-1 mb-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">{vehicle.location}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
              {formatPrice(vehicle.price)}
            </p>
            <p className="text-sm text-gray-500">COP</p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(vehicle.reviews.average)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {vehicle.reviews.average}
          </span>
          <span className="text-sm text-gray-500">
            ({vehicle.reviews.count} reseñas)
          </span>
        </div>

        {/* Key Specs */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <Battery className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600">
              {vehicle.specifications.range} km
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600">
              {vehicle.specifications.chargeTime}h
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-600">
              {vehicle.specifications.performance.maxSpeed} km/h
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-gray-600">
              {vehicle.passengerCapacity} pasajeros
            </span>
          </div>
        </div>

        {/* Warranty */}
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-600">
            {vehicle.specifications.warranty}
          </span>
        </div>

        {/* Dealer Info */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>Vendido por {vehicle.dealer.name}</span>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span>{vehicle.dealer.rating}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
            Ver Detalles
          </Button>
          <Button variant="outline" className="flex-1">
            Comparar
          </Button>
        </div>
      </div>
    </div>
  );
};

const VehicleListCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "in-stock":
        return "bg-green-100 text-green-800 border-green-200";
      case "pre-order":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "coming-soon":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case "in-stock":
        return "Disponible";
      case "pre-order":
        return "Pre-orden";
      case "coming-soon":
        return "Próximamente";
      default:
        return "Consultar";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group">
      <div className="flex">
        {/* Vehicle Image - Horizontal Layout */}
        <div className="relative w-80 h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
          <div className="absolute inset-0 flex items-center justify-center">
            <Car className="w-16 h-16 text-gray-400" />
          </div>
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-white/90 hover:bg-white"
            >
              <Heart className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-white/90 hover:bg-white"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
          <div className="absolute top-4 left-4">
            <Badge
              className={`${getAvailabilityColor(vehicle.availability)} border`}
            >
              {getAvailabilityText(vehicle.availability)}
            </Badge>
          </div>
        </div>

        {/* Vehicle Info - Horizontal Layout */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {vehicle.name}
              </h3>
              <p className="text-gray-600 mb-2">{vehicle.brand}</p>
              <div className="flex items-center space-x-1 mb-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {vehicle.location}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">
                {formatPrice(vehicle.price)}
              </p>
              <p className="text-sm text-gray-500">COP</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(vehicle.reviews.average)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {vehicle.reviews.average}
            </span>
            <span className="text-sm text-gray-500">
              ({vehicle.reviews.count} reseñas)
            </span>
          </div>

          {/* Key Specs - Horizontal Layout */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Battery className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">
                {vehicle.specifications.range} km
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600">
                {vehicle.specifications.chargeTime}h
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-600">
                {vehicle.specifications.performance.maxSpeed} km/h
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-600">
                {vehicle.passengerCapacity} pasajeros
              </span>
            </div>
          </div>

          {/* Warranty and Dealer Info */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>{vehicle.specifications.warranty}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>Vendido por {vehicle.dealer.name}</span>
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{vehicle.dealer.rating}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              Ver Detalles
            </Button>
            <Button variant="outline" className="flex-1">
              Comparar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    priceMax: 50000000,
    location: [],
    reviews: [],
    availability: [],
    passengerCapacity: [],
    chargingTime: [],
    maxSpeed: [],
    power: [],
    brands: [],
  });

  const sortOptions: SortOption[] = [
    { value: "relevance", label: "Más relevantes" },
    { value: "price-low", label: "Precio: menor a mayor" },
    { value: "price-high", label: "Precio: mayor a menor" },
    { value: "rating", label: "Mejor calificados" },
    { value: "newest", label: "Más nuevos" },
    { value: "range", label: "Mayor autonomía" },
  ];

  const filterSections: FilterSection[] = [
    {
      title: "Tipo de Vehículo",
      filters: [
        {
          key: "vehicleType",
          label: "Tipo",
          type: "checkbox",
          options: vehicleTypes.map((type) => ({
            value: type.value,
            label: type.label,
            count: vehicles.filter((v) => v.type === type.value).length,
          })),
        },
      ],
    },
    {
      title: "Precio",
      filters: [
        {
          key: "priceRange",
          label: "Rango de precio",
          type: "range",
          min: 0,
          max: 50000000,
        },
      ],
    },
    {
      title: "Autonomía de Batería",
      filters: [
        {
          key: "batteryRange",
          label: "Rango de autonomía",
          type: "checkbox",
          options: batteryRanges.map((range) => ({
            value: range.value,
            label: range.label,
            count: vehicles.filter((v) => {
              const vehicleRange = parseInt(v.specifications.range);
              const [min, max] = range.value.split("-").map(Number);
              return max
                ? vehicleRange >= min && vehicleRange <= max
                : vehicleRange >= min;
            }).length,
          })),
        },
      ],
    },
    {
      title: "Ubicación",
      filters: [
        {
          key: "location",
          label: "Ciudad",
          type: "checkbox",
          options: cities.map((city) => ({
            value: city,
            label: city,
            count: vehicles.filter((v) => v.location === city).length,
          })),
        },
      ],
    },
    {
      title: "Disponibilidad",
      filters: [
        {
          key: "availability",
          label: "Estado",
          type: "checkbox",
          options: [
            {
              value: "in-stock",
              label: "Disponible",
              count: vehicles.filter((v) => v.availability === "in-stock")
                .length,
            },
            {
              value: "pre-order",
              label: "Pre-orden",
              count: vehicles.filter((v) => v.availability === "pre-order")
                .length,
            },
            {
              value: "coming-soon",
              label: "Próximamente",
              count: vehicles.filter((v) => v.availability === "coming-soon")
                .length,
            },
          ],
        },
      ],
    },
    {
      title: "Calificación",
      filters: [
        {
          key: "reviews",
          label: "Calificación mínima",
          type: "checkbox",
          options: [
            {
              value: "4.5+",
              label: "4.5+ estrellas",
              count: vehicles.filter((v) => v.reviews.average >= 4.5).length,
            },
            {
              value: "4.0+",
              label: "4.0+ estrellas",
              count: vehicles.filter((v) => v.reviews.average >= 4.0).length,
            },
            {
              value: "3.5+",
              label: "3.5+ estrellas",
              count: vehicles.filter((v) => v.reviews.average >= 3.5).length,
            },
          ],
        },
      ],
    },
    {
      title: "Marca",
      filters: [
        {
          key: "brands",
          label: "Marca",
          type: "checkbox",
          options: brands.map((brand) => ({
            value: brand,
            label: brand,
            count: vehicles.filter((v) => v.brand === brand).length,
          })),
        },
      ],
    },
  ];

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
      priceMax: parseInt(searchParams.get("priceMax") || "50000000"),
      location: searchParams.get("location")?.split(",") || [],
      reviews: searchParams.get("reviews")?.split(",") || [],
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

    if (searchFilters.priceMin && searchFilters.priceMax) {
      filteredVehicles = filteredVehicles.filter(
        (v) =>
          v.price >= searchFilters.priceMin && v.price <= searchFilters.priceMax
      );
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

  const handleBackToSearch = () => {
    router.push("/#vehiculos");
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
      priceMax: 50000000,
      location: [],
      reviews: [],
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
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={handleBackToSearch}
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

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Vehículos Eléctricos en Colombia
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

              <div className="flex border border-gray-300 rounded-lg">
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
                              value={filters.priceMin}
                              onChange={(e) =>
                                setFilters((prev) => ({
                                  ...prev,
                                  priceMin: parseInt(e.target.value) || 0,
                                }))
                              }
                              className="w-20"
                            />
                            <span className="text-gray-500">-</span>
                            <Input
                              type="number"
                              placeholder="Max"
                              value={filters.priceMax}
                              onChange={(e) =>
                                setFilters((prev) => ({
                                  ...prev,
                                  priceMax:
                                    parseInt(e.target.value) || 50000000,
                                }))
                              }
                              className="w-20"
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
                <Button onClick={handleBackToSearch}>Volver a Búsqueda</Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
