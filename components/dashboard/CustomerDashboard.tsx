"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { Heart, MessageCircle, Bell, Car, Zap } from "lucide-react";
import { CustomerFavorite, CustomerInquiry, PriceAlert } from "@/types";

export function CustomerDashboard() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<CustomerFavorite[]>([]);
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [inquiryMessage, setInquiryMessage] = useState("");

  useEffect(() => {
    if (user) {
      fetchCustomerData();
    }
  }, [user]);

  const fetchCustomerData = async () => {
    try {
      // Fetch favorites
      const { data: favoritesData } = await supabase
        .from("customer_favorites")
        .select("*")
        .eq("customer_id", user?.id);

      // Fetch inquiries
      const { data: inquiriesData } = await supabase
        .from("customer_inquiries")
        .select("*")
        .eq("customer_id", user?.id);

      // Fetch price alerts
      const { data: alertsData } = await supabase
        .from("price_alerts")
        .select("*")
        .eq("customer_id", user?.id)
        .eq("is_active", true);

      setFavorites(favoritesData || []);
      setInquiries(inquiriesData || []);
      setPriceAlerts(alertsData || []);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInquirySubmit = async () => {
    if (!selectedVehicle || !inquiryMessage.trim()) return;

    try {
      const { error } = await supabase.from("customer_inquiries").insert({
        customer_id: user?.id,
        vehicle_id: selectedVehicle,
        message: inquiryMessage,
      });

      if (error) throw error;

      setShowInquiryModal(false);
      setInquiryMessage("");
      setSelectedVehicle(null);
      fetchCustomerData();
    } catch (error) {
      console.error("Error submitting inquiry:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Zap className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mi Panel de Cliente
        </h1>
        <p className="text-gray-600">
          Gestiona tus favoritos, consultas y alertas de precio
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Favorites Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                Mis Favoritos
              </h2>
              <span className="text-sm text-gray-500">
                {favorites.length} vehículos
              </span>
            </div>

            {favorites.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  No tienes vehículos favoritos aún
                </p>
                <p className="text-sm text-gray-400">
                  Haz clic en el corazón de un vehículo para agregarlo
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {favorites.map((favorite) => (
                  <div
                    key={favorite.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Car className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="font-medium">
                          Vehículo ID: {favorite.vehicle_id}
                        </p>
                        <p className="text-sm text-gray-500">
                          Agregado el{" "}
                          {new Date(favorite.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Inquiries */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
              <MessageCircle className="w-5 h-5 mr-2 text-blue-500" />
              Mis Consultas
            </h3>

            {inquiries.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No tienes consultas pendientes
              </p>
            ) : (
              <div className="space-y-3">
                {inquiries.slice(0, 3).map((inquiry) => (
                  <div key={inquiry.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium">
                      Vehículo: {inquiry.vehicle_id}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Estado: {inquiry.status}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price Alerts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
              <Bell className="w-5 h-5 mr-2 text-yellow-500" />
              Alertas de Precio
            </h3>

            {priceAlerts.length === 0 ? (
              <p className="text-gray-500 text-sm">No tienes alertas activas</p>
            ) : (
              <div className="space-y-3">
                {priceAlerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium">
                      Vehículo: {alert.vehicle_id}
                    </p>
                    <p className="text-xs text-gray-500">
                      Precio objetivo: ${alert.target_price.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      <Dialog open={showInquiryModal} onOpenChange={setShowInquiryModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Consulta</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehículo ID
              </label>
              <Input
                value={selectedVehicle || ""}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                placeholder="ID del vehículo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje
              </label>
              <Textarea
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                placeholder="Escribe tu consulta aquí..."
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowInquiryModal(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleInquirySubmit}>Enviar Consulta</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
