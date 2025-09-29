"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Car,
  Zap,
  Shield,
  DollarSign,
  MapPin,
  Search,
  Filter,
  Calendar,
  Users,
  Battery,
  Clock,
  Star,
  BatteryFull,
} from "lucide-react";
import {
  batteryRanges,
  cities,
  priceRanges,
  vehicleTypes,
  warrantyOptions,
} from "@/data/products";

export default function ProductCatalog() {
  const router = useRouter();
  const [searchFilters, setSearchFilters] = useState({
    vehicleType: "",
    batteryRange: "",
    warranty: "",
    priceMin: "",
    priceMax: "",
    location: "",
    dealerRating: "",
    availability: "",
    passengerCapacity: "",
    chargingTime: "",
    maxSpeed: "",
    power: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = (field: string, value: string) => {
    setSearchFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = async () => {
    setIsLoading(true);

    try {
      // Build query parameters
      const queryParams = new URLSearchParams();

      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });

      // Navigate to results page with filters
      router.push(`/resultados?${queryParams.toString()}`);
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      // Reset loading state after a short delay to show the loading animation
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const clearFilters = () => {
    setSearchFilters({
      vehicleType: "",
      batteryRange: "",
      warranty: "",
      priceMin: "",
      priceMax: "",
      location: "",
      dealerRating: "",
      availability: "",
      passengerCapacity: "",
      chargingTime: "",
      maxSpeed: "",
      power: "",
    });
  };

  return (
    <section id="vehiculos" className="w-full mt-10">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Search & Filter Interface */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8 mb-12 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Search className="w-6 h-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Buscar y Filtrar
              </h3>
            </div>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800"
            >
              <Filter className="w-4 h-4 mr-2" />
              Limpiar Filtros
            </Button>
          </div>

          {/* Main Search Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Vehicle Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Car className="w-4 h-4 mr-2" />
                Tipo de Vehículo
              </label>
              <Select
                value={searchFilters.vehicleType}
                onValueChange={(value) =>
                  handleFilterChange("vehicleType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        <type.icon className="w-4 h-4" />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Battery Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <BatteryFull className="w-4 h-4 mr-2" />
                Autonomía de Batería
              </label>
              <Select
                value={searchFilters.batteryRange}
                onValueChange={(value) =>
                  handleFilterChange("batteryRange", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rango de autonomía" />
                </SelectTrigger>
                <SelectContent>
                  {batteryRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Rango de Precio
              </label>
              <Select
                value={
                  searchFilters.priceMin
                    ? `${searchFilters.priceMin}-${searchFilters.priceMax}`
                    : ""
                }
                onValueChange={(value) => {
                  const [min, max] = value.split("-");
                  handleFilterChange("priceMin", min);
                  handleFilterChange("priceMax", max);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar precio" />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Ubicación
              </label>
              <Select
                value={searchFilters.location}
                onValueChange={(value) => handleFilterChange("location", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar ciudad" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Secondary Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Warranty */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Garantía
              </label>
              <Select
                value={searchFilters.warranty}
                onValueChange={(value) => handleFilterChange("warranty", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Período de garantía" />
                </SelectTrigger>
                <SelectContent>
                  {warrantyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Passenger Capacity */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Capacidad de Pasajeros
              </label>
              <Select
                value={searchFilters.passengerCapacity}
                onValueChange={(value) =>
                  handleFilterChange("passengerCapacity", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Número de pasajeros" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 pasajero</SelectItem>
                  <SelectItem value="2">2 pasajeros</SelectItem>
                  <SelectItem value="3">3 pasajeros</SelectItem>
                  <SelectItem value="4">4 pasajeros</SelectItem>
                  <SelectItem value="5+">5+ pasajeros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Charging Time */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Tiempo de Carga
              </label>
              <Select
                value={searchFilters.chargingTime}
                onValueChange={(value) =>
                  handleFilterChange("chargingTime", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tiempo de carga" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-2">Menos de 2 horas</SelectItem>
                  <SelectItem value="2-4">2-4 horas</SelectItem>
                  <SelectItem value="4-8">4-8 horas</SelectItem>
                  <SelectItem value="8+">Más de 8 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reviews */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Calificación de tienda
              </label>
              <Select
                value={searchFilters.dealerRating}
                onValueChange={(value) =>
                  handleFilterChange("dealerRating", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar calificación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4.5+">4.5+ estrellas</SelectItem>
                  <SelectItem value="4.0+">4.0+ estrellas</SelectItem>
                  <SelectItem value="3.5+">3.5+ estrellas</SelectItem>
                  <SelectItem value="3.0+">3.0+ estrellas</SelectItem>
                  <SelectItem value="2.5+">2.5+ estrellas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {/* Max Speed */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                Velocidad Máxima
              </label>
              <Select
                value={searchFilters.maxSpeed}
                onValueChange={(value) => handleFilterChange("maxSpeed", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Velocidad máxima" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-30">0-30 km/h</SelectItem>
                  <SelectItem value="30-60">30-60 km/h</SelectItem>
                  <SelectItem value="60-100">60-100 km/h</SelectItem>
                  <SelectItem value="100+">100+ km/h</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Power */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Battery className="w-4 h-4 mr-2" />
                Potencia del Motor
              </label>
              <Select
                value={searchFilters.power}
                onValueChange={(value) => handleFilterChange("power", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Potencia del motor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1000">0-1000W</SelectItem>
                  <SelectItem value="1000-3000">1000-3000W</SelectItem>
                  <SelectItem value="3000-5000">3000-5000W</SelectItem>
                  <SelectItem value="5000+">5000W+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Availability */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Disponibilidad
              </label>
              <Select
                value={searchFilters.availability}
                onValueChange={(value) =>
                  handleFilterChange("availability", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estado de disponibilidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-stock">Disponible ahora</SelectItem>
                  <SelectItem value="pre-order">Pre-orden</SelectItem>
                  <SelectItem value="coming-soon">Próximamente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Zap className="w-5 h-5 mr-2 animate-pulse" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Buscar Vehículos
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
