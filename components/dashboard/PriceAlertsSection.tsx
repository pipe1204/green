"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { PriceAlert, Vehicle } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Car,
  ArrowRight,
  Trash2,
  Edit3,
  TrendingDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { PriceAlertModal } from "@/components/resultados/PriceAlertModal";
import {
  databaseToPriceAlertWithVehicle,
  DatabasePriceAlertWithVehicle,
} from "@/lib/database-mapping";

interface PriceAlertWithVehicle extends PriceAlert {
  vehicle?: Vehicle;
}

export function PriceAlertsSection() {
  const { user } = useAuth();
  const router = useRouter();
  const [priceAlerts, setPriceAlerts] = useState<PriceAlertWithVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingAlert, setEditingAlert] =
    useState<PriceAlertWithVehicle | null>(null);

  const fetchPriceAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user's price alerts
      const { data: alerts, error: alertsError } = await supabase
        .from("price_alerts")
        .select(
          `
          *,
          vehicles (
            id,
            name,
            brand,
            type,
            price,
            images,
            location
          )
        `
        )
        .eq("customer_id", user?.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (alertsError) throw alertsError;

      // Transform to include vehicle data using utility function
      const transformedAlerts: PriceAlertWithVehicle[] =
        alerts?.map((alert: DatabasePriceAlertWithVehicle) =>
          databaseToPriceAlertWithVehicle(alert)
        ) || [];

      setPriceAlerts(transformedAlerts);
    } catch (err) {
      console.error("Error fetching price alerts:", err);
      setError("Error al cargar tus alertas de precio");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchPriceAlerts();
    }
  }, [user, fetchPriceAlerts]);

  const handleDeleteAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from("price_alerts")
        .delete()
        .eq("id", alertId);

      if (error) throw error;

      // Remove from local state
      setPriceAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
    } catch (err) {
      console.error("Error deleting price alert:", err);
      setError("Error al eliminar la alerta");
    }
  };

  const calculateSavings = (currentPrice: number, targetPrice: number) => {
    const savings = currentPrice - targetPrice;
    const percentage = ((savings / currentPrice) * 100).toFixed(1);
    return { savings, percentage };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Bell className="w-6 h-6 text-purple-500 mr-2" />
              Mis Alertas de Precio
            </h2>
            <p className="text-gray-600 mt-1">
              Notificaciones cuando bajen los precios
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-lg p-6 animate-pulse"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Bell className="w-6 h-6 text-purple-500 mr-2" />
              Mis Alertas de Precio
            </h2>
            <p className="text-gray-600 mt-1">
              Notificaciones cuando bajen los precios
            </p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchPriceAlerts} variant="outline" className="mt-2">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (priceAlerts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Bell className="w-6 h-6 text-purple-500 mr-2" />
              Mis Alertas de Precio
            </h2>
            <p className="text-gray-600 mt-1">
              Notificaciones cuando bajen los precios
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No tienes alertas de precio
          </h3>
          <p className="text-gray-600 mb-6">
            Crea alertas para ser notificado cuando los precios de tus vehículos
            favoritos bajen.
          </p>
          <Button
            onClick={() => router.push("/resultados")}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Car className="w-4 h-4 mr-2" />
            Explorar Vehículos
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Bell className="w-6 h-6 text-purple-500 mr-2" />
            Mis Alertas de Precio ({priceAlerts.length})
          </h2>
          <p className="text-gray-600 mt-1">
            Notificaciones cuando bajen los precios
          </p>
        </div>
        <Button onClick={() => router.push("/resultados")} variant="outline">
          <Car className="w-4 h-4 mr-2" />
          Explorar Más
        </Button>
      </div>

      <div className="space-y-4">
        {priceAlerts.map((alert) => {
          const { savings, percentage } = alert.vehicle
            ? calculateSavings(alert.vehicle.price, alert.target_price)
            : { savings: 0, percentage: "0" };

          return (
            <div key={alert.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {alert.vehicle?.name || "Vehículo no disponible"}
                    </h3>
                    <Badge className="bg-purple-100 text-purple-800">
                      Alerta Activa
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {alert.vehicle?.brand} • {alert.vehicle?.type}
                  </p>
                </div>
                {alert.vehicle && (
                  <Button
                    onClick={() => router.push(`/product/${alert.vehicle!.id}`)}
                    variant="outline"
                    size="sm"
                  >
                    Ver Vehículo
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <TrendingDown className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Precio Actual
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {alert.vehicle ? formatPrice(alert.vehicle.price) : "N/A"}
                  </p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <Bell className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Precio Objetivo
                    </span>
                  </div>
                  <p className="text-lg font-bold text-purple-900">
                    {formatPrice(alert.target_price)}
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Ahorro Potencial
                    </span>
                  </div>
                  <p className="text-lg font-bold text-green-900">
                    {formatPrice(savings)}
                  </p>
                  <p className="text-xs text-green-700">
                    ({percentage}% de descuento)
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    Creada:{" "}
                    {new Date(alert.created_at).toLocaleDateString("es-CO")}
                  </span>
                  {alert.updated_at !== alert.created_at && (
                    <span className="text-sm text-gray-500">
                      Actualizada:{" "}
                      {new Date(alert.updated_at).toLocaleDateString("es-CO")}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setEditingAlert(alert)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDeleteAlert(alert.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Price Alert Modal for Editing */}
      {editingAlert && editingAlert.vehicle && (
        <PriceAlertModal
          isOpen={!!editingAlert}
          onClose={() => {
            setEditingAlert(null);
            fetchPriceAlerts(); // Refresh the list
          }}
          vehicle={editingAlert.vehicle}
        />
      )}
    </div>
  );
}
