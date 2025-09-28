"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useComparison } from "@/components/context/ComparisonContext";
import { Product } from "@/types";
import {
  Car,
  Zap,
  Clock,
  MapPin,
  Shield,
  Plus,
  Check,
  Eye,
  GitCompare,
} from "lucide-react";

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
  className?: string;
}

export default function ProductCard({
  product,
  onViewDetails,
  className = "",
}: ProductCardProps) {
  const router = useRouter();
  const { addProduct, removeProduct, isInComparison, canAddMore, state } =
    useComparison();
  const [imageError, setImageError] = useState(false);

  const isSelected = isInComparison(product.id);
  const isMaxReached = !canAddMore && !isSelected;

  const handleCompareToggle = () => {
    if (isSelected) {
      removeProduct(product.id);
    } else {
      addProduct(product);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product);
    } else {
      router.push(`/product/${product.id}`);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "motorbike":
        return <Car className="w-5 h-5" />;
      case "scooter":
        return <Car className="w-5 h-5" />;
      case "bicycle":
        return <Car className="w-5 h-5" />;
      default:
        return <Car className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "motorbike":
        return "Motocicleta";
      case "scooter":
        return "Scooter";
      case "bicycle":
        return "Bicicleta";
      default:
        return "Vehículo";
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}
    >
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100">
        {!imageError && product.images.length > 0 ? (
          <img
            src={product.images[0].url}
            alt={product.images[0].alt}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <Car className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 text-sm font-medium text-gray-700">
          {getTypeIcon(product.type)}
          <span>{getTypeLabel(product.type)}</span>
        </div>

        {/* Compare Button */}
        <div className="absolute top-3 right-3">
          <Button
            size="sm"
            variant={isSelected ? "default" : "secondary"}
            onClick={handleCompareToggle}
            disabled={isMaxReached}
            className={`rounded-full p-2 ${
              isSelected
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : isMaxReached
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white/90 hover:bg-white text-gray-700"
            }`}
          >
            {isSelected ? (
              <Check className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Comparison Counter */}
        {state.selectedProducts.length > 0 && (
          <div className="absolute bottom-3 right-3 bg-blue-600 text-white rounded-full px-2 py-1 text-xs font-medium">
            {state.selectedProducts.length}/3
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-bold text-lg text-gray-900 mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600">{product.model}</p>
        </div>

        {/* Key Specs */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1 text-gray-600">
              <Zap className="w-4 h-4" />
              <span>Autonomía</span>
            </div>
            <span className="font-medium">
              {product.specifications.range} km
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Carga</span>
            </div>
            <span className="font-medium">
              {product.specifications.chargeTime}h
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1 text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Garantía</span>
            </div>
            <span className="font-medium">
              {product.specifications.warranty}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="text-2xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </div>
          <div className="text-sm text-gray-600">
            {product.availability === "in-stock" ? "Disponible" : "Pre-orden"}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            className="flex-1 flex items-center justify-center space-x-1"
          >
            <Eye className="w-4 h-4" />
            <span>Ver Detalles</span>
          </Button>

          {state.selectedProducts.length > 0 && (
            <Button
              size="sm"
              onClick={() => router.push("/comparar")}
              className="flex items-center justify-center space-x-1 bg-blue-600 hover:bg-blue-700"
            >
              <GitCompare className="w-4 h-4" />
              <span>Comparar</span>
            </Button>
          )}
        </div>

        {/* Comparison Status */}
        {isSelected && (
          <div className="mt-3 p-2 bg-blue-50 rounded-md">
            <div className="flex items-center space-x-2 text-blue-700 text-sm">
              <Check className="w-4 h-4" />
              <span>Agregado para comparar</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
