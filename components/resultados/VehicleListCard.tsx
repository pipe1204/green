import React from "react";
import { Button } from "@/components/ui/button";
import { Vehicle } from "@/data/vehicles";
import {
  formatPrice,
  getAvailabilityColor,
  getAvailabilityText,
} from "@/lib/utils";
import {
  Badge,
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
} from "lucide-react";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleListCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
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
            <div
              className={`${getAvailabilityColor(
                vehicle.availability
              )} border rounded-full px-2 py-1 text-xs font-semibold`}
            >
              {getAvailabilityText(vehicle.availability)}
            </div>
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
