"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TestDriveModal } from "@/components/resultados/TestDriveModal";
import { vehicles } from "@/data/vehicles";
import { Vehicle } from "@/data/vehicles";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  Calendar,
  Leaf,
  Zap,
  Shield,
  Clock,
  MapPin,
  CheckCircle,
  Phone,
  Mail,
  User,
  MessageSquare,
  Star,
  Battery,
  Users,
  Car,
} from "lucide-react";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTestDriveModalOpen, setIsTestDriveModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    const vehicleId = params.id as string;
    const foundVehicle = vehicles.find((v) => v.id === vehicleId);

    if (foundVehicle) {
      setVehicle(foundVehicle);
    }
  }, [params.id]);

  const handleContactVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert("¡Gracias! El vendedor se pondrá en contacto contigo pronto.");
    }, 1000);
  };

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Vehículo no encontrado
          </h1>
          <Button onClick={() => router.push("/")} variant="outline">
            Volver al inicio
          </Button>
        </div>
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {vehicle.name}
          </h1>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                ${vehicle.price.toLocaleString("es-CO")} COP
              </h2>
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
                  <span className="font-medium">{vehicle.dealer.rating}</span>
                </div>
              </div>
            </div>

            {/* Contact Vendor Form */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 text-blue-600 mr-2" />
                Contactar Vendedor
              </h3>
              <form onSubmit={handleContactVendor} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="Tu teléfono"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="tu@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje (opcional)
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Cuéntanos qué te interesa saber sobre este vehículo..."
                    rows={3}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-pulse" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Contactar Vendedor
                    </>
                  )}
                </Button>
              </form>
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
                onClick={() => setIsTestDriveModalOpen(true)}
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
              onClick={() =>
                document
                  .querySelector("form")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Contactar Vendedor
            </Button>
            <Button
              onClick={() => setIsTestDriveModalOpen(true)}
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

      {/* Test Drive Modal */}
      <TestDriveModal
        isOpen={isTestDriveModalOpen}
        onClose={() => setIsTestDriveModalOpen(false)}
        vehicle={vehicle}
      />
    </div>
  );
}
