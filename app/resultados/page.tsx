"use client";

import { useState, useEffect } from "react";
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
import { vehicles, Vehicle } from "@/data/vehicles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  SortAsc,
} from "lucide-react";

interface SearchFilters {
  vehicleType: string;
  batteryRange: string;
  warranty: string;
  priceMin: string;
  priceMax: string;
  location: string;
  reviews: string;
  availability: string;
  passengerCapacity: string;
  chargingTime: string;
  maxSpeed: string;
  power: string;
}

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
        return "bg-green-100 text-green-800";
      case "pre-order":
        return "bg-yellow-100 text-yellow-800";
      case "coming-soon":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
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
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden">
      {/* Vehicle Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <Car className="w-16 h-16 text-gray-400" />
        </div>
        <div className="absolute top-4 right-4">
          <Badge className={getAvailabilityColor(vehicle.availability)}>
            {getAvailabilityText(vehicle.availability)}
          </Badge>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {vehicle.name}
            </h3>
            <p className="text-gray-600">{vehicle.brand}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
              {formatPrice(vehicle.price)}
            </p>
            <p className="text-sm text-gray-500">COP</p>
          </div>
        </div>

        {/* Key Specs */}
        <div className="grid grid-cols-2 gap-4 mb-4">
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

        {/* Location & Dealer */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{vehicle.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span>{vehicle.dealer.rating}</span>
          </div>
        </div>

        {/* Warranty */}
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-600">
            {vehicle.specifications.warranty}
          </span>
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

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Vehicle[]>([]);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Parse search parameters
    const searchFilters: SearchFilters = {
      vehicleType: searchParams.get("vehicleType") || "",
      batteryRange: searchParams.get("batteryRange") || "",
      warranty: searchParams.get("warranty") || "",
      priceMin: searchParams.get("priceMin") || "",
      priceMax: searchParams.get("priceMax") || "",
      location: searchParams.get("location") || "",
      reviews: searchParams.get("reviews") || "",
      availability: searchParams.get("availability") || "",
      passengerCapacity: searchParams.get("passengerCapacity") || "",
      chargingTime: searchParams.get("chargingTime") || "",
      maxSpeed: searchParams.get("maxSpeed") || "",
      power: searchParams.get("power") || "",
    };

    // Filter vehicles based on search criteria
    let filteredVehicles = vehicles;

    if (searchFilters.vehicleType) {
      filteredVehicles = filteredVehicles.filter(
        (v) => v.type === searchFilters.vehicleType
      );
    }

    if (searchFilters.reviews) {
      const minRating = parseFloat(searchFilters.reviews.replace("+", ""));
      filteredVehicles = filteredVehicles.filter(
        (v) => v.reviews.average >= minRating
      );
    }

    if (searchFilters.location) {
      filteredVehicles = filteredVehicles.filter(
        (v) => v.location === searchFilters.location
      );
    }

    if (searchFilters.availability) {
      filteredVehicles = filteredVehicles.filter(
        (v) => v.availability === searchFilters.availability
      );
    }

    if (searchFilters.priceMin && searchFilters.priceMax) {
      const minPrice = parseInt(searchFilters.priceMin);
      const maxPrice = parseInt(searchFilters.priceMax);
      filteredVehicles = filteredVehicles.filter(
        (v) => v.price >= minPrice && v.price <= maxPrice
      );
    }

    if (searchFilters.batteryRange) {
      const [minRange, maxRange] = searchFilters.batteryRange
        .split("-")
        .map(Number);
      filteredVehicles = filteredVehicles.filter((v) => {
        const range = parseInt(v.specifications.range);
        if (maxRange) {
          return range >= minRange && range <= maxRange;
        } else {
          return range >= minRange;
        }
      });
    }

    setResults(filteredVehicles);

    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleBackToSearch = () => {
    router.push("/#vehiculos");
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="mb-8">
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
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filtros</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <SortAsc className="w-4 h-4" />
                <span>Ordenar</span>
              </Button>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Resultados de Búsqueda
          </h1>
          <p className="text-gray-600">
            {results.length} vehículos encontrados
          </p>
        </div>

        {/* Results Grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
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
      </main>

      <Footer />
    </div>
  );
}
