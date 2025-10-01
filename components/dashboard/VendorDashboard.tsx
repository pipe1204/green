"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { Plus, Zap, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Vehicle } from "@/types";
import { ProductForm } from "./ProductForm";
import { VehicleTable } from "./VehicleTable";
import { VehicleViewModal } from "./VehicleViewModal";
import { DashboardSidebar, DashboardSection } from "./DashboardSidebar";
import { databaseToVehicle, vehicleToDatabase } from "@/lib/database-mapping";
import FloatingAskButton from "../FloatingAskButton";

type VendorLocation = {
  address?: string;
  department?: string;
  city?: string;
  isMain?: boolean;
};

type VendorRow = {
  id: string;
  business_name: string;
  rating: number;
  locations: VendorLocation[] | null;
};

export function VendorDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [viewingVehicle, setViewingVehicle] = useState<Vehicle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] =
    useState<DashboardSection>("vehicles");

  const fetchVehicles = useCallback(async () => {
    try {
      setError(null);

      // First, get the vendor record for this user
      const { data: vendorData, error: vendorError } = await supabase
        .from("vendors")
        .select("id,business_name,rating,locations")
        .eq("user_id", user?.id)
        .single();

      if (vendorError) {
        console.error("Vendor not found:", vendorError);
        setError("No se encontró tu perfil de vendedor. Contacta soporte.");
        return;
      }

      // Then fetch vehicles for this vendor
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("vendor_id", vendorData.id);

      if (error) {
        console.error("Supabase error:", error);
        setError("Error al cargar los vehículos. Intenta de nuevo.");
        return;
      }

      setVehicles((data || []).map(databaseToVehicle));
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setError("Error de conexión. Verifica tu conexión a internet.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchVehicles();
    }
  }, [user, fetchVehicles]);

  const handleSubmit = async (formData: Partial<Vehicle>) => {
    setLoading(true);

    try {
      // First, get the vendor record for this user
      const { data: vendorData, error: vendorError } = await supabase
        .from("vendors")
        .select("id")
        .eq("user_id", user?.id)
        .single();

      if (vendorError) {
        console.error("Vendor not found:", vendorError);
        setError("No se encontró tu perfil de vendedor. Contacta soporte.");
        setLoading(false);
        return;
      }

      // Ensure we have a primary key id for insert
      const ensuredId = (formData as Vehicle).id ?? crypto.randomUUID();

      // derive dealer defaults if empty
      const v: VendorRow = (vendorData || {
        id: "",
        business_name: "",
        rating: 0,
        locations: [],
      }) as VendorRow;
      const mainLocation = Array.isArray(v.locations)
        ? v.locations.find((l) => l?.isMain) || v.locations[0]
        : undefined;
      const dealerName =
        (formData as Vehicle).dealer?.name?.trim() || v.business_name || "";
      const dealerLocation =
        (formData as Vehicle).dealer?.location?.trim() ||
        mainLocation?.city ||
        "";
      const dealerRating =
        (formData as Vehicle).dealer?.rating ?? v.rating ?? 0;

      const defaulted = {
        ...(formData as Vehicle),
        id: ensuredId,
        dealer: {
          name: dealerName,
          location: dealerLocation,
          rating: dealerRating,
        },
        location: (formData as Vehicle).location?.trim() || dealerLocation,
      } as Vehicle;

      const { error } = await supabase.from("vehicles").upsert({
        ...vehicleToDatabase(defaulted),
        vendor_id: vendorData.id,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      setShowAddModal(false);
      setEditingVehicle(null);
      fetchVehicles();
    } catch (error) {
      console.error("Error saving vehicle:", error);
      setError("Error al guardar el vehículo. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este vehículo?"))
      return;

    try {
      const { error } = await supabase.from("vehicles").delete().eq("id", id);

      if (error) throw error;
      fetchVehicles();
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      setError("Error al eliminar el vehículo. Intenta de nuevo.");
    }
  };

  const handleView = (vehicle: Vehicle) => {
    setViewingVehicle(vehicle);
  };

  const handleCloseViewModal = () => {
    setViewingVehicle(null);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "vehicles":
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Mis Vehículos
                </h2>
                <p className="text-gray-600 mt-1">
                  Gestiona tu inventario de vehículos eléctricos
                </p>
              </div>
              <Button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 bg-green-600 text-white mt-4 sm:mt-0"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Vehículo</span>
              </Button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
                <Button
                  onClick={fetchVehicles}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Reintentar
                </Button>
              </div>
            )}

            {/* Vehicle Table */}
            <VehicleTable
              vehicles={vehicles}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              loading={loading}
            />
          </div>
        );
      case "analytics":
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Analítica en Desarrollo
            </h3>
            <p className="text-gray-600">
              Próximamente podrás ver métricas detalladas de tus vehículos
            </p>
          </div>
        );
      case "messages":
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Mensajes en Desarrollo
            </h3>
            <p className="text-gray-600">
              Próximamente podrás gestionar consultas de clientes
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading && vehicles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <Zap className="w-8 h-8 animate-spin text-green-600" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex h-screen pt-16">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block">
          <DashboardSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            className="flex-shrink-0"
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            {/* Mobile Navigation - Only visible on mobile */}
            <div className="lg:hidden mb-6">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Volver al Inicio</span>
                </Button>
                <h1 className="text-lg font-semibold text-gray-900">
                  Panel de Vendedor
                </h1>
              </div>

              {/* Mobile Section Selector */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setActiveSection("vehicles")}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === "vehicles"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  Vehículos
                </button>
                <button
                  onClick={() => setActiveSection("analytics")}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors opacity-50 cursor-not-allowed ${
                    activeSection === "analytics"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-white text-gray-600 border border-gray-200"
                  }`}
                  disabled
                >
                  Analítica
                </button>
                <button
                  onClick={() => setActiveSection("messages")}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors opacity-50 cursor-not-allowed ${
                    activeSection === "messages"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-white text-gray-600 border border-gray-200"
                  }`}
                  disabled
                >
                  Mensajes
                </button>
              </div>
            </div>

            {/* Desktop Back Button - Hidden on mobile */}
            <div className="hidden lg:block mb-6">
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al Inicio</span>
              </Button>
            </div>

            {renderContent()}
          </div>
        </main>
      </div>

      {/* Modals */}
      <ProductForm
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingVehicle(null);
        }}
        onSubmit={handleSubmit}
        editingVehicle={editingVehicle}
        loading={loading}
      />

      <VehicleViewModal
        vehicle={viewingVehicle}
        isOpen={!!viewingVehicle}
        onClose={handleCloseViewModal}
      />

      <FloatingAskButton />
    </div>
  );
}
