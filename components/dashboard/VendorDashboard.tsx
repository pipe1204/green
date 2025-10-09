"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { Plus, Zap, ArrowLeft, Upload } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Vehicle } from "@/types";
import { ProductForm } from "./ProductForm";
import { VehicleTable } from "./VehicleTable";
import { VehicleViewModal } from "./VehicleViewModal";
import { ResponsiveDashboardSidebar } from "./ResponsiveDashboardSidebar";
import { DashboardSection } from "./DashboardSidebar";
import { databaseToVehicle, vehicleToDatabase } from "@/lib/database-mapping";
import { handleVendorError, handleVehicleError } from "@/lib/error-handler";
import { VendorMessagesSection } from "./VendorMessagesSection";
import { VendorInquiriesSection } from "./VendorInquiriesSection";
import VendorProfilePage from "./VendorProfile";
import { CSVTemplateGenerator } from "./CSVTemplateGenerator";
import { BulkUploadModal } from "./BulkUploadModal";
import { VendorAnalyticsSection } from "./VendorAnalyticsSection";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const searchParams = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [viewingVehicle, setViewingVehicle] = useState<Vehicle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] =
    useState<DashboardSection>("vehicles");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  // Client-side pagination for vehicles
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

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
        setError(handleVendorError(vendorError));
        return;
      }

      // Then fetch vehicles for this vendor
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("vendor_id", vendorData.id);

      if (error) {
        setError(handleVehicleError(error));
        return;
      }

      setVehicles((data || []).map(databaseToVehicle));
    } catch (error) {
      setError(handleVehicleError(error));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchVehicles();
    }
  }, [user, fetchVehicles]);

  // Reset to first page when vehicles list changes
  useEffect(() => {
    setPage(1);
  }, [vehicles.length]);

  // Handle URL section parameter
  useEffect(() => {
    const section = searchParams.get("section");
    if (
      section &&
      ["vehicles", "inquiries", "messages", "profile", "analytics"].includes(
        section
      )
    ) {
      setActiveSection(section as DashboardSection);
    }
  }, [searchParams]);

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

      // Use existing vehicle ID if editing, otherwise generate new one
      const ensuredId =
        editingVehicle?.id ?? (formData as Vehicle).id ?? crypto.randomUUID();

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
      const dealerName = v.business_name || "";
      const dealerLocation = mainLocation?.city || "";
      const dealerRating = v.rating ?? 0;

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

      // Check price alerts after successful vehicle update
      try {
        const token = (await supabase.auth.getSession()).data.session
          ?.access_token;
        if (token && editingVehicle?.id) {
          // Only check alerts if we're editing an existing vehicle (price might have changed)
          const response = await fetch(
            `/api/vendor/vehicles/${editingVehicle.id}/price-alerts`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            console.warn(
              "Failed to check price alerts:",
              await response.text()
            );
          }
        }
      } catch (alertError) {
        // Don't fail the vehicle save if price alert check fails
        console.warn("Error checking price alerts:", alertError);
      }

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

  const handleBulkUploadSuccess = useCallback(
    async (vehicles: Vehicle[]) => {
      try {
        setLoading(true);
        setError(null);

        // Get vendor data first
        const { data: vendorData, error: vendorError } = await supabase
          .from("vendors")
          .select("id")
          .eq("user_id", user?.id)
          .single();

        if (vendorError || !vendorData) {
          throw new Error("No se pudo encontrar el vendedor");
        }

        // Convert vehicles to database format and add vendor_id
        const vehiclesToInsert = vehicles.map((vehicle) => ({
          ...vehicleToDatabase(vehicle),
          id: crypto.randomUUID(), // Generate unique ID for each vehicle
          vendor_id: vendorData.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

        // Insert all vehicles
        const { error: insertError } = await supabase
          .from("vehicles")
          .insert(vehiclesToInsert);

        if (insertError) throw insertError;

        // Refresh the vehicles list
        await fetchVehicles();

        setShowBulkUploadModal(false);
      } catch (error) {
        console.error("Error in bulk upload:", error);
        setError("Error al cargar los vehículos. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    },
    [user?.id, fetchVehicles]
  );

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    setVehicleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!vehicleToDelete) return;

    try {
      const { error } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", vehicleToDelete);

      if (error) throw error;

      setDeleteDialogOpen(false);
      setVehicleToDelete(null);
      fetchVehicles();
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      setError("Error al eliminar el vehículo. Intenta de nuevo.");
      setDeleteDialogOpen(false);
      setVehicleToDelete(null);
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
              <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
                <CSVTemplateGenerator />
                <Button
                  onClick={() => setShowBulkUploadModal(true)}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Carga Masiva</span>
                </Button>
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center space-x-2 bg-green-600 text-white"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Vehículo</span>
                </Button>
              </div>
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
            {(() => {
              const total = vehicles.length;
              const totalPages = Math.max(1, Math.ceil(total / pageSize));
              const startIndex = (page - 1) * pageSize;
              const currentItems = vehicles.slice(
                startIndex,
                startIndex + pageSize
              );

              return (
                <>
                  <VehicleTable
                    vehicles={currentItems}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    loading={loading}
                  />

                  {/* Pagination Controls */}
                  <div className="bg-white p-4 rounded-md flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-600">
                      {total > 0
                        ? `Mostrando ${startIndex + 1}-${Math.min(
                            startIndex + currentItems.length,
                            total
                          )} de ${total}`
                        : "Sin resultados"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        aria-label="Página anterior"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                      >
                        Anterior
                      </Button>
                      <span className="text-sm text-gray-700">
                        Página {page} de {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        aria-label="Página siguiente"
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page >= totalPages}
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        );

      case "inquiries":
        return <VendorInquiriesSection />;
      case "messages":
        return <VendorMessagesSection />;
      case "profile":
        return <VendorProfilePage />;
      case "analytics":
        return <VendorAnalyticsSection />;
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
        {/* Responsive Sidebar */}
        <ResponsiveDashboardSidebar
          activeSection={activeSection}
          onSectionChange={(section) =>
            setActiveSection(section as DashboardSection)
          }
          className="flex-shrink-0"
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            {/* Back Button */}
            <div className="mb-6">
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

      <BulkUploadModal
        isOpen={showBulkUploadModal}
        onClose={() => setShowBulkUploadModal(false)}
        onSuccess={handleBulkUploadSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El vehículo será eliminado
              permanentemente de tu inventario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setVehicleToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
