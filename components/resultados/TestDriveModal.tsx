import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Vehicle } from "@/data/vehicles";
import { formatPrice } from "@/lib/utils";
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Battery,
  Users,
  Zap,
  Car,
} from "lucide-react";
import { timeSlots } from "@/data";

interface TestDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
}

export const TestDriveModal: React.FC<TestDriveModalProps> = ({
  isOpen,
  onClose,
  vehicle,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert(
        "¡Prueba de manejo programada! Te contactaremos para confirmar la fecha y hora."
      );
      onClose();
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center">
            <Calendar className="w-6 h-6 text-blue-600 mr-2" />
            Programar Prueba de Manejo
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vehicle Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Detalles del Vehículo
              </h3>

              {/* Vehicle Image */}
              <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-4">
                {vehicle.images.length > 0 ? (
                  <Image
                    src={vehicle.images[0].url}
                    alt={vehicle.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
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
                    <Car className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Imagen no disponible
                    </p>
                  </div>
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-xl font-bold text-gray-900">
                    {vehicle.name}
                  </h4>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(vehicle.price)}
                  </p>
                </div>

                {/* Key Specs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Battery className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">
                      {vehicle.specifications.range} km
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">
                      {vehicle.specifications.chargeTime}h
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">
                      {vehicle.specifications.performance.maxSpeed} km/h
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-600">
                      {vehicle.passengerCapacity} pasajeros
                    </span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(vehicle.reviews.average)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {vehicle.reviews.average}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({vehicle.reviews.count} reseñas)
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {vehicle.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Información de Contacto
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo *
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Tu nombre completo"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono *
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="Tu número de teléfono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha preferida *
                    </label>
                    <Input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          preferredDate: e.target.value,
                        })
                      }
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora preferida *
                    </label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          preferredTime: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Seleccionar hora</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje adicional (opcional)
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="¿Hay algo específico que te gustaría probar o alguna pregunta sobre el vehículo?"
                    rows={3}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <Zap className="w-4 h-4 mr-2 animate-pulse" />
                        Programando...
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4 mr-2" />
                        Programar Prueba
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
