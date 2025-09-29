import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Vehicle } from "@/data/vehicles";
import { Button } from "@/components/ui/button";
import { TestDriveModal } from "./TestDriveModal";
import {
  formatPrice,
  getAvailabilityColor,
  getAvailabilityText,
  getVehicleTypeText,
  truncateText,
} from "@/lib/utils";
import {
  Battery,
  Car,
  Clock,
  Eye,
  Heart,
  MapPin,
  Shield,
  Star,
  Users,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isTestDriveModalOpen, setIsTestDriveModalOpen] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === vehicle.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? vehicle.images.length - 1 : prev - 1
    );
  };

  const handleViewDetails = async () => {
    setIsNavigating(true);
    // Small delay to show the loading state
    setTimeout(() => {
      router.push(`/product/${vehicle.id}`);
    }, 500);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group">
      {/* Vehicle Image */}
      <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {/* Carousel Images */}
        <div className="relative w-full h-full">
          {vehicle.images.length > 0 ? (
            <Image
              src={vehicle.images[currentImageIndex].url}
              alt={vehicle.images[currentImageIndex].alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={currentImageIndex === 0}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const placeholder = target.nextElementSibling as HTMLElement;
                if (placeholder) placeholder.style.display = "flex";
              }}
            />
          ) : null}
          {/* Placeholder for missing images */}
          <div
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
            style={{ display: vehicle.images.length === 0 ? "flex" : "none" }}
          >
            <div className="text-center">
              <Car className="w-20 h-20 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Imagen no disponible</p>
            </div>
          </div>

          {/* Carousel Navigation */}
          {vehicle.images.length > 1 && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>

              {/* Image Indicators */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {vehicle.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex
                        ? "bg-white"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
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
          <div
            className={`${getAvailabilityColor(
              vehicle.availability
            )} border rounded-full px-2 py-1 text-xs font-semibold`}
          >
            {getAvailabilityText(vehicle.availability)}
          </div>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="p-6">
        <div className="flex flex-col items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
              <h3 className="text-xl font-bold text-gray-600">
                {truncateText(vehicle.name, 25)}
              </h3>
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">
                  {getVehicleTypeText(vehicle.type)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1 mb-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">{vehicle.location}</span>
            </div>
          </div>
          <div className="flex justify-between items-center gap-2">
            <p className="text-2xl font-bold text-gray-900">
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
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span>{vehicle.dealer.rating}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleViewDetails}
            disabled={isNavigating}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isNavigating ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-pulse" />
                Cargando...
              </>
            ) : (
              "Ver Detalles"
            )}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setIsTestDriveModalOpen(true)}
          >
            Agenda una prueba
          </Button>
        </div>
      </div>

      {/* Test Drive Modal */}
      <TestDriveModal
        isOpen={isTestDriveModalOpen}
        onClose={() => setIsTestDriveModalOpen(false)}
        vehicle={vehicle}
      />
    </div>
  );
};
