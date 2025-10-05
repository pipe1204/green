"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import { TestDriveModal } from "@/components/resultados/TestDriveModal";
import { ContactVendorModal } from "@/components/resultados/ContactVendorModal";
import { PriceAlertModal } from "@/components/resultados/PriceAlertModal";
import { FavoritesButton } from "@/components/resultados/FavoritesButton";
import { getVehicleById } from "@/lib/vehicle-queries";
import { handleVehicleError } from "@/lib/error-handler";
import { formatPrice } from "@/lib/utils";
import { Vehicle } from "@/types";
import { useAuthActions } from "@/hooks/useAuthCheck";
import { usePriceAlert } from "@/hooks/usePriceAlert";
import { AuthPromptModal } from "@/components/auth/AuthPromptModal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  Calendar,
  Zap,
  Shield,
  Clock,
  MapPin,
  CheckCircle,
  Mail,
  MessageSquare,
  Star,
  Battery,
  Users,
  Car,
  Bell,
} from "lucide-react";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isTestDriveModalOpen, setIsTestDriveModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isPriceAlertModalOpen, setIsPriceAlertModalOpen] = useState(false);

  const {
    requireAuthForTestDrive,
    requireAuthForPriceAlert,
    authPrompt,
    closeAuthPrompt,
    handleAuthSuccess,
  } = useAuthActions();

  // Check if user has a price alert for this vehicle
  const { hasAlert, alertData, refreshAlert } = usePriceAlert(
    vehicle?.id || ""
  );

  useEffect(() => {
    const fetchVehicle = async () => {
      setLoading(true);
      setError(null);

      try {
        const vehicleId = params.id as string;
        const fetchedVehicle = await getVehicleById(vehicleId);

        if (fetchedVehicle) {
          setVehicle(fetchedVehicle);
        } else {
          setError("Vehículo no encontrado");
        }
      } catch (err) {
        setError(handleVehicleError(err));
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchVehicle();
    }
  }, [params.id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center justify-center h-64">
            <Zap className="w-8 h-8 animate-spin text-green-600" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {error || "Vehículo no encontrado"}
            </h1>
            <p className="text-gray-600 mb-6">
              El vehículo que buscas no existe o ha sido eliminado.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Button onClick={() => router.push("/")} variant="outline">
                Volver al inicio
              </Button>
              <Button onClick={() => router.push("/resultados")}>
                Ver todos los vehículos
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentImage = vehicle.images[selectedImageIndex];

  return (
    <div className="min-h-screen bg-white pb-16">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* Back Button */}
        <div className="py-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </Button>
        </div>

        {/* Vehicle Header */}
        <div className="mb-12">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 flex-1">
              {vehicle.name}
            </h1>
            <div className="flex items-center gap-2 ml-4">
              <FavoritesButton vehicleId={vehicle.id} />
              <Button
                variant={hasAlert ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  requireAuthForPriceAlert(() => setIsPriceAlertModalOpen(true))
                }
                title={
                  hasAlert
                    ? `Alerta activa: ${formatPrice(
                        alertData?.target_price || 0
                      )}`
                    : "Crear alerta de precio"
                }
                className={
                  hasAlert ? "bg-purple-600 hover:bg-purple-700 text-white" : ""
                }
              >
                <Bell
                  className={`w-4 h-4 ${
                    hasAlert ? "text-white" : "text-purple-600"
                  }`}
                />
                {hasAlert && (
                  <span className="ml-1 text-xs font-medium">
                    ${alertData?.target_price?.toLocaleString()}
                  </span>
                )}
              </Button>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl">
            {vehicle.description}
          </p>
          <div className="mt-6 flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Battery className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">
                {vehicle.specifications.battery} de batería
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">
                {vehicle.specifications.range} km de autonomía
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">
                {vehicle.specifications.chargeTime} horas de carga
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden relative">
              {vehicle.images.length > 0 ? (
                <Image
                  src={currentImage?.url || "/images/placeholder.jpg"}
                  alt={vehicle.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  priority={selectedImageIndex === 0}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const placeholder =
                      target.nextElementSibling as HTMLElement;
                    if (placeholder) placeholder.style.display = "flex";
                  }}
                />
              ) : null}
              {/* Placeholder for missing images */}
              <div
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
                style={{
                  display: vehicle.images.length === 0 ? "flex" : "none",
                }}
              >
                <div className="text-center">
                  <Car className="w-20 h-20 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Imagen no disponible</p>
                </div>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {vehicle.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all relative ${
                    selectedImageIndex === index
                      ? "border-blue-600"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={`${vehicle.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, (max-width: 1200px) 12.5vw, 10vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const placeholder =
                        target.nextElementSibling as HTMLElement;
                      if (placeholder) placeholder.style.display = "flex";
                    }}
                  />
                  {/* Placeholder for broken thumbnail images */}
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
                    style={{ display: "none" }}
                  >
                    <Car className="w-8 h-8 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Details & Contact Forms */}
          <div className="space-y-8">
            {/* Price & Rating */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-gray-900">
                  ${vehicle.price.toLocaleString("es-CO")} COP
                </h2>
                {hasAlert && (
                  <div className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm font-medium">
                    <Bell className="w-4 h-4" />
                    <span>
                      Alerta: ${alertData?.target_price?.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold">
                    {vehicle.reviews.average}
                  </span>
                  <span className="text-gray-500">
                    ({vehicle.reviews.count} reseñas)
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-600">Vendedor:</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{vehicle.vendor.rating}</span>
                </div>
              </div>
            </div>

            {/* Contact Vendor Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 text-blue-600 mr-2" />
                Contactar Vendedor
              </h3>
              <p className="text-gray-600 mb-4">
                ¿Tienes preguntas sobre {vehicle.name}? Envía un mensaje al
                vendedor y te responderán pronto.
              </p>
              <Button
                onClick={() => setIsContactModalOpen(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Mail className="w-4 h-4 mr-2" />
                Enviar Mensaje
              </Button>
            </div>

            {/* Book Test Drive Button */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                Programar Prueba de Manejo
              </h3>
              <p className="text-gray-600 mb-4">
                Programa una prueba de manejo para experimentar este vehículo en
                persona.
              </p>
              <Button
                onClick={() =>
                  requireAuthForTestDrive(() => setIsTestDriveModalOpen(true))
                }
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Programar Prueba
              </Button>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Especificaciones Técnicas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Battery className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Batería</h3>
              </div>
              <p className="text-gray-600">{vehicle.specifications.battery}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <MapPin className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Autonomía
                </h3>
              </div>
              <p className="text-gray-600">{vehicle.specifications.range} km</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Tiempo de Carga
                </h3>
              </div>
              <p className="text-gray-600">
                {vehicle.specifications.chargeTime} horas
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Garantía
                </h3>
              </div>
              <p className="text-gray-600">{vehicle.specifications.warranty}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Zap className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Velocidad Máxima
                </h3>
              </div>
              <p className="text-gray-600">
                {vehicle.specifications.performance.maxSpeed} km/h
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Capacidad
                </h3>
              </div>
              <p className="text-gray-600">
                {vehicle.passengerCapacity} pasajeros
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Características Principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {vehicle.features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-700 text-lg">{feature}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gray-50 rounded-lg p-8 text-center mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Interesado en este vehículo?
          </h2>
          <p className="text-gray-600 mb-6">
            Contacta directamente con el vendedor de {vehicle.name} para obtener
            más información, programar una prueba de manejo o resolver cualquier
            duda que tengas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setIsContactModalOpen(true)}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Contactar Vendedor
            </Button>
            <Button
              onClick={() =>
                requireAuthForTestDrive(() => setIsTestDriveModalOpen(true))
              }
              variant="outline"
              size="lg"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Programar Prueba
            </Button>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modals */}
      <TestDriveModal
        isOpen={isTestDriveModalOpen}
        onClose={() => setIsTestDriveModalOpen(false)}
        vehicle={vehicle}
      />

      <ContactVendorModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        vehicle={vehicle}
      />

      <PriceAlertModal
        isOpen={isPriceAlertModalOpen}
        onClose={() => {
          setIsPriceAlertModalOpen(false);
          refreshAlert(); // Refresh alert status when modal closes
        }}
        vehicle={vehicle}
      />

      {/* Auth Prompt Modal */}
      <AuthPromptModal
        isOpen={authPrompt.isOpen}
        onClose={closeAuthPrompt}
        action={authPrompt.action}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
