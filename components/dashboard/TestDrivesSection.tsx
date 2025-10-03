"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Car,
  Clock,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { CustomerTestDriveBooking, CustomerTestDrivesResponse } from "@/types";

export function TestDrivesSection() {
  const { user, session } = useAuth();
  const router = useRouter();
  const [testDrives, setTestDrives] = useState<CustomerTestDriveBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestDrives = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/customer/test-drives", {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      const data: CustomerTestDrivesResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error fetching test drives");
      }

      setTestDrives(data.bookings || []);
    } catch (err) {
      console.error("Error fetching test drives:", err);
      setError("Error al cargar tus pruebas de manejo");
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (user) {
      fetchTestDrives();
    }
  }, [user, fetchTestDrives]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "confirmed":
        return "Confirmada";
      case "completed":
        return "Completada";
      case "cancelled":
        return "Cancelada";
      default:
        return status;
    }
  };

  const getVendorResponseColor = (vendorResponse: string) => {
    switch (vendorResponse) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "accepted":
        return "bg-green-50 text-green-700 border-green-200";
      case "declined":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getVendorResponseText = (vendorResponse: string) => {
    switch (vendorResponse) {
      case "pending":
        return "Esperando respuesta";
      case "accepted":
        return "Aceptada";
      case "declined":
        return "Declinada";
      default:
        return vendorResponse;
    }
  };

  const getVendorResponseIcon = (vendorResponse: string) => {
    switch (vendorResponse) {
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      case "accepted":
        return <CheckCircle className="w-4 h-4" />;
      case "declined":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Calendar className="w-6 h-6 text-blue-500 mr-2" />
              Mis Pruebas de Manejo
            </h2>
            <p className="text-gray-600 mt-1">
              Pruebas programadas y realizadas
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
              <Calendar className="w-6 h-6 text-blue-500 mr-2" />
              Mis Pruebas de Manejo
            </h2>
            <p className="text-gray-600 mt-1">
              Pruebas programadas y realizadas
            </p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchTestDrives} variant="outline" className="mt-2">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (testDrives.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Calendar className="w-6 h-6 text-blue-500 mr-2" />
              Mis Pruebas de Manejo
            </h2>
            <p className="text-gray-600 mt-1">
              Pruebas programadas y realizadas
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No tienes pruebas programadas
          </h3>
          <p className="text-gray-600 mb-6">
            Agenda una prueba de manejo para los vehículos que te interesan.
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
            <Calendar className="w-6 h-6 text-blue-500 mr-2" />
            Mis Pruebas de Manejo ({testDrives.length})
          </h2>
          <p className="text-gray-600 mt-1">Pruebas programadas y realizadas</p>
        </div>
        <Button onClick={() => router.push("/resultados")} variant="outline">
          <Car className="w-4 h-4 mr-2" />
          Explorar Más
        </Button>
      </div>

      <div className="space-y-4">
        {testDrives.map((booking) => (
          <div key={booking.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {booking.vehicle?.name || "Vehículo no disponible"}
                  </h3>
                  <Badge className={getStatusColor(booking.status)}>
                    {getStatusText(booking.status)}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={getVendorResponseColor(booking.vendorResponse)}
                  >
                    <div className="flex items-center space-x-1">
                      {getVendorResponseIcon(booking.vendorResponse)}
                      <span>
                        {getVendorResponseText(booking.vendorResponse)}
                      </span>
                    </div>
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {booking.vehicle?.brand} • {booking.vehicle?.type}
                </p>
                {booking.vendor && (
                  <p className="text-sm text-gray-500 mt-1">
                    Vendedor: {booking.vendor.businessName}
                  </p>
                )}
              </div>
              {booking.vehicle && (
                <Button
                  onClick={() => router.push(`/product/${booking.vehicle!.id}`)}
                  variant="outline"
                  size="sm"
                >
                  Ver Vehículo
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    {booking.preferredDate
                      ? new Date(booking.preferredDate).toLocaleDateString(
                          "es-CO"
                        )
                      : "No especificada"}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    {booking.preferredTime || "No especificada"}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    {booking.vehicle?.location || "No especificada"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{booking.customerEmail}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{booking.customerPhone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-600">
                    Creada:{" "}
                    {new Date(booking.createdAt).toLocaleDateString("es-CO")}
                  </span>
                </div>
              </div>
            </div>

            {booking.message && (
              <div className="border-t pt-4">
                <div className="flex items-start space-x-2">
                  <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Tu mensaje:
                    </p>
                    <p className="text-sm text-gray-600">{booking.message}</p>
                  </div>
                </div>
              </div>
            )}

            {booking.vendorMessage && (
              <div className="border-t pt-4">
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0">
                    {getVendorResponseIcon(booking.vendorResponse)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <p className="text-sm font-medium text-gray-700">
                        Respuesta del vendedor:
                      </p>
                      <Badge
                        variant="outline"
                        className={getVendorResponseColor(
                          booking.vendorResponse
                        )}
                      >
                        {getVendorResponseText(booking.vendorResponse)}
                      </Badge>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-900">
                        {booking.vendorMessage}
                      </p>
                    </div>
                    {booking.vendorResponseDate && (
                      <p className="text-xs text-gray-500 mt-2">
                        Respondido:{" "}
                        {new Date(
                          booking.vendorResponseDate
                        ).toLocaleDateString("es-CO")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
