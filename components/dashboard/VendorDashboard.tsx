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
import { ProductList } from "./ProductList";
import { databaseToVehicle, vehicleToDatabase } from "@/lib/database-mapping";

export function VendorDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    try {
      setError(null);

      // First, get the vendor record for this user
      const { data: vendorData, error: vendorError } = await supabase
        .from("vendors")
        .select("id")
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

      const { error } = await supabase.from("vehicles").upsert({
        ...vehicleToDatabase(formData as Vehicle),
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
    // Navigate to product page
    router.push(`/product/${vehicle.id}`);
  };

  if (loading && vehicles.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-64">
          <Zap className="w-8 h-8 animate-spin text-green-600" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-16">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* Back Button */}
        <div className="py-6">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Inicio</span>
          </Button>
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Panel de Vendedor
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Gestiona tus vehículos eléctricos y recibe consultas de clientes
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
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

        <div className="mb-6">
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-green-600 text-white"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Vehículo</span>
          </Button>
        </div>

        <ProductList
          vehicles={vehicles}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />

        {/* Product Form Modal */}
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
      </main>

      <Footer />
    </div>
  );
}
