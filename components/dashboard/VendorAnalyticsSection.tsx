"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { VendorAnalytics, VehicleAnalytics } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  Eye,
  Heart,
  MessageSquare,
  Calendar,
  Bell,
  TrendingUp,
  TrendingDown,
  Zap,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AnalyticsSummaryCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

function AnalyticsSummaryCard({
  title,
  value,
  icon,
  trend,
  description,
}: AnalyticsSummaryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className="flex items-center text-xs text-muted-foreground">
            {trend.isPositive ? (
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
            )}
            <span
              className={trend.isPositive ? "text-green-600" : "text-red-600"}
            >
              {trend.value}%
            </span>
            <span className="ml-1">vs. período anterior</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface VehiclePerformanceTableProps {
  vehicles: VehicleAnalytics[];
}

function VehiclePerformanceTable({ vehicles }: VehiclePerformanceTableProps) {
  const [sortField, setSortField] =
    useState<keyof VehicleAnalytics>("conversion_rate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const sortedVehicles = [...vehicles].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const handleSort = (field: keyof VehicleAnalytics) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendimiento de Vehículos</CardTitle>
        <CardDescription>
          Métricas detalladas de cada uno de tus vehículos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">Vehículo</th>
                <th
                  className="text-right p-2 font-medium cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("total_views")}
                >
                  Vistas{" "}
                  {sortField === "total_views" &&
                    (sortDirection === "desc" ? "↓" : "↑")}
                </th>
                <th
                  className="text-right p-2 font-medium cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("favorites_count")}
                >
                  Favoritos{" "}
                  {sortField === "favorites_count" &&
                    (sortDirection === "desc" ? "↓" : "↑")}
                </th>
                <th
                  className="text-right p-2 font-medium cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("inquiries_count")}
                >
                  Consultas{" "}
                  {sortField === "inquiries_count" &&
                    (sortDirection === "desc" ? "↓" : "↑")}
                </th>
                <th
                  className="text-right p-2 font-medium cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("conversion_rate")}
                >
                  Conversión{" "}
                  {sortField === "conversion_rate" &&
                    (sortDirection === "desc" ? "↓" : "↑")}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedVehicles.map((vehicle) => (
                <tr
                  key={vehicle.vehicle_id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-2">
                    <div className="font-medium">{vehicle.vehicle_name}</div>
                  </td>
                  <td className="text-right p-2">{vehicle.total_views}</td>
                  <td className="text-right p-2">{vehicle.favorites_count}</td>
                  <td className="text-right p-2">{vehicle.inquiries_count}</td>
                  <td className="text-right p-2">
                    <span
                      className={`font-medium ${
                        vehicle.conversion_rate >= 5
                          ? "text-green-600"
                          : vehicle.conversion_rate >= 2
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {vehicle.conversion_rate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

interface EngagementChartProps {
  data: {
    views_by_day: { date: string; views: number }[];
    favorites_by_day: { date: string; favorites: number }[];
    inquiries_by_day: { date: string; inquiries: number }[];
  };
}

function EngagementChart({ data }: EngagementChartProps) {
  // Simple chart using CSS bars (you can replace with a proper chart library later)
  const maxViews = Math.max(...data.views_by_day.map((d) => d.views), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendencias de Interacción</CardTitle>
        <CardDescription>Vistas, favoritos y consultas por día</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.views_by_day.slice(-7).map((day, index) => (
            <div key={day.date} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{new Date(day.date).toLocaleDateString()}</span>
                <span className="font-medium">{day.views} vistas</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(day.views / maxViews) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  {data.favorites_by_day[index]?.favorites || 0} favoritos
                </span>
                <span>
                  {data.inquiries_by_day[index]?.inquiries || 0} consultas
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function VendorAnalyticsSection() {
  const { session } = useAuth();
  const [analytics, setAnalytics] = useState<VendorAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    if (!session?.access_token) {
      setError("No hay token de acceso disponible");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/vendor/analytics", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al cargar la analítica: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success && result.analytics) {
        setAnalytics(result.analytics);
        setError(null);
      } else {
        throw new Error(
          result.error || "No se pudieron cargar los datos de analítica"
        );
      }
    } catch (err) {
      console.error("Error obteniendo la analítica:", err);
      setError(
        err instanceof Error ? err.message : "No se pudo cargar la analítica"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [session?.access_token]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalytics();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analítica</h2>
            <p className="text-gray-600 mt-1">
              Analiza el rendimiento de tus vehículos y la interacción de tus
              clientes
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Zap className="w-6 h-6 animate-spin text-green-600" />
            <span className="text-gray-600">Cargando analítica...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analítica</h2>
            <p className="text-gray-600 mt-1">
              Analiza el rendimiento de tus vehículos y la interacción de tus
              clientes
            </p>
          </div>
          <Button onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Actualizar
          </Button>
        </div>

        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analítica</h2>
            <p className="text-gray-600 mt-1">
              Analiza el rendimiento de tus vehículos y la interacción de tus
              clientes
            </p>
          </div>
        </div>

        <Alert>
          <AlertDescription>
            No hay datos de analítica disponibles. Comienza agregando vehículos
            a tu inventario.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analítica</h2>
          <p className="text-gray-600 mt-1">
            Analiza el rendimiento de tus vehículos y la interacción de tus
            clientes
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? (
            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Actualizar
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsSummaryCard
          title="Vehículos Totales"
          value={analytics.summary.total_vehicles}
          icon={<BarChart3 className="h-4 w-4" />}
          description="Vehículos en tu inventario"
        />
        <AnalyticsSummaryCard
          title="Vistas Totales"
          value={analytics.summary.total_views}
          icon={<Eye className="h-4 w-4" />}
          description="Vistas de página de clientes"
        />
        <AnalyticsSummaryCard
          title="Favoritos"
          value={analytics.summary.total_favorites}
          icon={<Heart className="h-4 w-4" />}
          description="Vehículos guardados por clientes"
        />
        <AnalyticsSummaryCard
          title="Tasa de Conversión"
          value={`${analytics.summary.average_conversion_rate}%`}
          icon={<TrendingUp className="h-4 w-4" />}
          description="Consultas por vista"
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnalyticsSummaryCard
          title="Consultas"
          value={analytics.summary.total_inquiries}
          icon={<MessageSquare className="h-4 w-4" />}
          description="Consultas de clientes"
        />
        <AnalyticsSummaryCard
          title="Pruebas de Manejo"
          value={analytics.summary.total_test_drives}
          icon={<Calendar className="h-4 w-4" />}
          description="Pruebas de manejo agendadas"
        />
        <AnalyticsSummaryCard
          title="Alertas de Precio"
          value={analytics.summary.total_price_alerts}
          icon={<Bell className="h-4 w-4" />}
          description="Alertas de precio activas"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EngagementChart data={analytics.engagement_metrics} />
        <VehiclePerformanceTable vehicles={analytics.vehicle_performance} />
      </div>

      {/* Top Performing Vehicles */}
      {analytics.top_performing_vehicles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Vehículos con Mejor Rendimiento</CardTitle>
            <CardDescription>
              Tus vehículos con mejor conversión por tasa de consultas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.top_performing_vehicles.map((vehicle, index) => (
                <div
                  key={vehicle.vehicle_id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{vehicle.vehicle_name}</div>
                      <div className="text-sm text-gray-500">
                        {vehicle.total_views} vistas • {vehicle.favorites_count}{" "}
                        favoritos
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">
                      {vehicle.conversion_rate}%
                    </div>
                    <div className="text-sm text-gray-500">
                      {vehicle.inquiries_count} consultas
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
