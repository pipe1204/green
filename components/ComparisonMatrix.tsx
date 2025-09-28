// @ts-nocheck
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useComparison } from "@/components/context/ComparisonContext";
import { Product } from "@/types";
import {
  X,
  Zap,
  Clock,
  Shield,
  MapPin,
  Car,
  Star,
  Info,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";

export default function ComparisonMatrix({ onRequestQuotes }) {
  const router = useRouter();
  const { state, removeProduct, clearComparison } = useComparison();
  const [showTooltip, setShowTooltip] = useState("");

  const products = state.selectedProducts;

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No hay productos para comparar
        </h3>
        <p className="text-gray-600 mb-6">
          Selecciona hasta 3 vehículos para comparar sus especificaciones
        </p>
        <Button onClick={() => router.push("/vehiculos")}>
          Explorar Vehículos
        </Button>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
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

  const calculateOverallScore = (product) => {
    // Simple scoring algorithm based on key factors
    let score = 0;

    // Battery range score (0-30 points)
    const range = parseInt(product?.specifications?.range || "0");
    if (range >= 100) score += 30;
    else if (range >= 50) score += 20;
    else score += 10;

    // Warranty score (0-25 points)
    if (product?.specifications?.warranty?.includes("2 años")) score += 25;
    else if (product?.specifications?.warranty?.includes("1 año")) score += 15;
    else score += 10;

    // Price score (0-25 points) - lower price gets higher score
    if (product?.price <= 3000000) score += 25;
    else if (product?.price <= 5000000) score += 20;
    else if (product?.price <= 8000000) score += 15;
    else score += 10;

    // Availability score (0-20 points)
    if (product?.availability === "in-stock") score += 20;
    else if (product?.availability === "pre-order") score += 10;
    else score += 5;

    return Math.min(100, score);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excelente";
    if (score >= 60) return "Bueno";
    return "Regular";
  };

  const specRows = [
    {
      key: "name",
      label: "Modelo",
      icon: <Car className="w-4 h-4" />,
      isImportant: true,
    },
    {
      key: "price",
      label: "Precio",
      icon: <span className="text-sm font-bold">$</span>,
      isImportant: true,
      formatter: formatPrice,
    },
    {
      key: "specifications.range",
      label: "Autonomía",
      icon: <Zap className="w-4 h-4" />,
      tooltip: "Distancia máxima que puede recorrer con una carga completa",
      isImportant: true,
      formatter: (value = "") => `${value} km`,
    },
    {
      key: "specifications.chargeTime",
      label: "Tiempo de Carga",
      icon: <Clock className="w-4 h-4" />,
      tooltip: "Tiempo promedio para cargar la batería completamente",
      formatter: (value = "") => `${value} horas`,
    },
    {
      key: "specifications.warranty",
      label: "Garantía",
      icon: <Shield className="w-4 h-4" />,
      tooltip: "Período de garantía del fabricante",
      isImportant: true,
    },
    {
      key: "specifications.battery",
      label: "Batería",
      icon: <Zap className="w-4 h-4" />,
      tooltip: "Especificaciones técnicas de la batería",
    },
    {
      key: "specifications.performance.maxSpeed",
      label: "Velocidad Máxima",
      icon: <Car className="w-4 h-4" />,
      tooltip: "Velocidad máxima que puede alcanzar el vehículo",
    },
    {
      key: "specifications.performance.power",
      label: "Potencia",
      icon: <Zap className="w-4 h-4" />,
      tooltip: "Potencia del motor eléctrico",
    },
    {
      key: "deliveryTime",
      label: "Tiempo de Entrega",
      icon: <MapPin className="w-4 h-4" />,
      tooltip: "Tiempo estimado para la entrega del vehículo",
    },
    {
      key: "availability",
      label: "Disponibilidad",
      icon: <Car className="w-4 h-4" />,
      formatter: (value = "") => {
        switch (value) {
          case "in-stock":
            return "Disponible";
          case "pre-order":
            return "Pre-orden";
          case "coming-soon":
            return "Próximamente";
          default:
            return value;
        }
      },
    },
  ];

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/vehiculos")}
              className="flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </Button>
            <h2 className="text-xl font-bold text-gray-900">
              Comparación de Vehículos ({products.length}/3)
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={clearComparison}>
              Limpiar Todo
            </Button>
            {onRequestQuotes && (
              <Button
                size="sm"
                onClick={onRequestQuotes}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                Solicitar Cotizaciones
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 w-1/4">
                Especificación
              </th>
              {products.map((product) => (
                <th
                  key={product.id}
                  className="px-6 py-4 text-center text-sm font-medium text-gray-900 relative"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="relative">
                      <img
                        src={
                          product.images[0]?.url || "/placeholder-vehicle.png"
                        }
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeProduct(product.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {getTypeLabel(product.type)}
                      </p>
                    </div>
                    {/* Overall Score */}
                    <div className="flex flex-col items-center space-y-1">
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(
                          calculateOverallScore(product)
                        )}`}
                      >
                        {calculateOverallScore(product)}/100
                      </div>
                      <div className="text-xs text-gray-600">
                        {getScoreLabel(calculateOverallScore(product))}
                      </div>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specRows.map((row) => (
              <tr key={row.key} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {row.icon}
                    <span
                      className={`text-sm font-medium ${
                        row.isImportant ? "text-gray-900" : "text-gray-700"
                      }`}
                    >
                      {row.label}
                    </span>
                    {row.tooltip && (
                      <div className="relative">
                        <Info
                          className="w-4 h-4 text-gray-400 cursor-help"
                          onMouseEnter={() => setShowTooltip(row.key)}
                          onMouseLeave={() => setShowTooltip("")}
                        />
                        {showTooltip === row.key && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10">
                            {row.tooltip}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                {products.map((product) => {
                  const value = getNestedValue(product, row.key);
                  const displayValue = row.formatter
                    ? row.formatter(value)
                    : value || "";

                  return (
                    <td
                      key={product.id}
                      className="px-6 py-4 text-center text-sm"
                    >
                      <span
                        className={
                          row.isImportant
                            ? "font-medium text-gray-900"
                            : "text-gray-700"
                        }
                      >
                        {displayValue || "-"}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Key Differentiators */}
      <div className="px-6 py-4 bg-gray-50 border-t">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Diferenciadores Clave
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => {
            const score = calculateOverallScore(product);
            const badges = [];

            if (parseInt(product.specifications.range) >= 100) {
              badges.push("Alta Autonomía");
            }
            if (product.specifications.warranty.includes("2 años")) {
              badges.push("Garantía Extendida");
            }
            if (product.price <= 3000000) {
              badges.push("Mejor Precio");
            }
            if (product.availability === "in-stock") {
              badges.push("Disponible Ahora");
            }

            return (
              <div key={product.id} className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  {product.name}
                </h4>
                <div className="flex flex-wrap gap-1">
                  {badges.map((badge, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
