"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { CustomerInquiry, Vehicle } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Car,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  databaseToInquiryWithVehicle,
  DatabaseInquiryWithVehicle,
} from "@/lib/database-mapping";

interface InquiryWithVehicle extends CustomerInquiry {
  vehicle?: Vehicle;
}

export function InquiriesSection() {
  const { user } = useAuth();
  const router = useRouter();
  const [inquiries, setInquiries] = useState<InquiryWithVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user's inquiries
      const { data: inquiryData, error: inquiryError } = await supabase
        .from("customer_inquiries")
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
        .order("created_at", { ascending: false });

      if (inquiryError) throw inquiryError;

      // Transform to include vehicle data
      const transformedInquiries: InquiryWithVehicle[] =
        inquiryData?.map((inquiry: DatabaseInquiryWithVehicle) =>
          databaseToInquiryWithVehicle(inquiry)
        ) || [];

      setInquiries(transformedInquiries);
    } catch (err) {
      console.error("Error fetching inquiries:", err);
      setError("Error al cargar tus consultas");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchInquiries();
    }
  }, [user, fetchInquiries]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "replied":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "replied":
        return "Respondida";
      case "closed":
        return "Cerrada";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "replied":
        return <CheckCircle className="w-4 h-4" />;
      case "closed":
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
              <MessageCircle className="w-6 h-6 text-blue-500 mr-2" />
              Mis Consultas
            </h2>
            <p className="text-gray-600 mt-1">Mensajes enviados a vendedores</p>
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
              <MessageCircle className="w-6 h-6 text-blue-500 mr-2" />
              Mis Consultas
            </h2>
            <p className="text-gray-600 mt-1">Mensajes enviados a vendedores</p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchInquiries} variant="outline" className="mt-2">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (inquiries.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <MessageCircle className="w-6 h-6 text-blue-500 mr-2" />
              Mis Consultas
            </h2>
            <p className="text-gray-600 mt-1">Mensajes enviados a vendedores</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No tienes consultas aún
          </h3>
          <p className="text-gray-600 mb-6">
            Envía mensajes a vendedores para obtener más información sobre los
            vehículos que te interesan.
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
            <MessageCircle className="w-6 h-6 text-blue-500 mr-2" />
            Mis Consultas ({inquiries.length})
          </h2>
          <p className="text-gray-600 mt-1">Mensajes enviados a vendedores</p>
        </div>
        <Button onClick={() => router.push("/resultados")} variant="outline">
          <Car className="w-4 h-4 mr-2" />
          Explorar Más
        </Button>
      </div>

      <div className="space-y-4">
        {inquiries.map((inquiry) => (
          <div key={inquiry.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {inquiry.vehicle?.name || "Vehículo no disponible"}
                  </h3>
                  <Badge className={getStatusColor(inquiry.status)}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(inquiry.status)}
                      <span>{getStatusText(inquiry.status)}</span>
                    </div>
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {inquiry.vehicle?.brand} • {inquiry.vehicle?.type}
                </p>
              </div>
              {inquiry.vehicle && (
                <Button
                  onClick={() => router.push(`/product/${inquiry.vehicle!.id}`)}
                  variant="outline"
                  size="sm"
                >
                  Ver Vehículo
                </Button>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex items-start space-x-2">
                <MessageCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Tu mensaje:
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    {inquiry.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    Enviado:{" "}
                    {new Date(inquiry.created_at).toLocaleDateString("es-CO")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
