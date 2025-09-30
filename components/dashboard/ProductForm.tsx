"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Vehicle } from "@/types";
import { Zap, Upload, X } from "lucide-react";
import Image from "next/image";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Vehicle>) => Promise<void>;
  editingVehicle?: Vehicle | null;
  loading: boolean;
}

export function ProductForm({
  isOpen,
  onClose,
  onSubmit,
  editingVehicle,
  loading,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    type: "motocicleta",
    price: 0,
    description: "",
    location: "",
    availability: "in-stock",
    images: [] as { url: string; alt: string }[],
    specifications: {
      range: "",
      chargeTime: "",
      warranty: "",
      battery: "",
      performance: {
        maxSpeed: "",
        power: "",
      },
    },
    features: [] as string[],
    dealer: {
      name: "",
      location: "",
      rating: 0,
    },
    reviews: {
      average: 0,
      count: 0,
    },
  });

  const [newImageUrl, setNewImageUrl] = useState("");
  const [newFeature, setNewFeature] = useState("");

  // Reset form when modal opens/closes or editing vehicle changes
  React.useEffect(() => {
    if (isOpen) {
      if (editingVehicle) {
        setFormData({
          name: editingVehicle.name,
          brand: editingVehicle.brand,
          type: editingVehicle.type,
          price: editingVehicle.price,
          description: editingVehicle.description,
          location: editingVehicle.location,
          availability: editingVehicle.availability,
          images: editingVehicle.images,
          specifications: editingVehicle.specifications,
          features: editingVehicle.features,
          dealer: editingVehicle.dealer,
          reviews: editingVehicle.reviews,
        });
      } else {
        setFormData({
          name: "",
          brand: "",
          type: "motocicleta",
          price: 0,
          description: "",
          location: "",
          availability: "in-stock",
          images: [] as { url: string; alt: string }[],
          specifications: {
            range: "",
            chargeTime: "",
            warranty: "",
            battery: "",
            performance: {
              maxSpeed: "",
              power: "",
            },
          },
          features: [] as string[],
          dealer: {
            name: "",
            location: "",
            rating: 0,
          },
          reviews: {
            average: 0,
            count: 0,
          },
        });
      }
    }
  }, [isOpen, editingVehicle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData as Partial<Vehicle>);
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData({
        ...formData,
        images: [
          ...formData.images,
          { url: newImageUrl.trim(), alt: `${formData.name} image` },
        ],
      });
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingVehicle ? "Editar Vehículo" : "Agregar Nuevo Vehículo"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Información Básica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Vehículo *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="Ej: Tesla Model 3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marca *
                </label>
                <Input
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  required
                  placeholder="Ej: Tesla"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo *
                </label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="motocicleta">Motocicleta</SelectItem>
                    <SelectItem value="scooter">Scooter</SelectItem>
                    <SelectItem value="bicicleta">Bicicleta</SelectItem>
                    <SelectItem value="carro">Carro</SelectItem>
                    <SelectItem value="camion">Camión</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio (COP) *
                </label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                  placeholder="50000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación *
                </label>
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                  placeholder="Ej: Bogotá, Colombia"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado *
                </label>
                <Select
                  value={formData.availability}
                  onValueChange={(value) =>
                    setFormData({ ...formData, availability: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-stock">En Stock</SelectItem>
                    <SelectItem value="pre-order">Pre-orden</SelectItem>
                    <SelectItem value="coming-soon">Próximamente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                placeholder="Describe las características principales del vehículo..."
              />
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Imágenes del Vehículo
            </h3>

            {/* Add Image */}
            <div className="flex gap-2">
              <Input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="URL de la imagen"
                className="flex-1"
              />
              <Button type="button" onClick={addImage} variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </div>

            {/* Display Images */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      width={128}
                      height={128}
                      className="w-full h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/placeholder.jpg";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Especificaciones Técnicas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Autonomía (km)
                </label>
                <Input
                  value={formData.specifications.range}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        range: e.target.value,
                      },
                    })
                  }
                  placeholder="Ej: 400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiempo de Carga (horas)
                </label>
                <Input
                  value={formData.specifications.chargeTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        chargeTime: e.target.value,
                      },
                    })
                  }
                  placeholder="Ej: 8"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batería
                </label>
                <Input
                  value={formData.specifications.battery}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        battery: e.target.value,
                      },
                    })
                  }
                  placeholder="Ej: 75 kWh"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Garantía
                </label>
                <Input
                  value={formData.specifications.warranty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        warranty: e.target.value,
                      },
                    })
                  }
                  placeholder="Ej: 8 años"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Velocidad Máxima (km/h)
                </label>
                <Input
                  value={formData.specifications.performance.maxSpeed}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        performance: {
                          ...formData.specifications.performance,
                          maxSpeed: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder="Ej: 200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Potencia (kW)
                </label>
                <Input
                  value={formData.specifications.performance.power}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        performance: {
                          ...formData.specifications.performance,
                          power: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder="Ej: 300"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Características
            </h3>

            {/* Add Feature */}
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Ej: GPS integrado"
                className="flex-1"
              />
              <Button type="button" onClick={addFeature} variant="outline">
                Agregar Característica
              </Button>
            </div>

            {/* Display Features */}
            {formData.features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : editingVehicle ? (
                "Actualizar Vehículo"
              ) : (
                "Crear Vehículo"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
