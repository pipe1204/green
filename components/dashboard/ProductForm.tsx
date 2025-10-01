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
import { Zap, X } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

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

  const [uploadingImages, setUploadingImages] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const [validationError, setValidationError] = useState<string>("");
  const [vendorCities, setVendorCities] = useState<string[]>([]);
  const [warrantyUnit, setWarrantyUnit] = useState<"years" | "km">("years");
  const [warrantyValue, setWarrantyValue] = useState<string>("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Reset form when modal opens/closes or editing vehicle changes
  React.useEffect(() => {
    if (isOpen) {
      if (editingVehicle) {
        // Parse warranty from string back to unit and value for editing
        const warrantyStr = editingVehicle.specifications.warranty;
        let parsedUnit: "years" | "km" = "years";
        let parsedValue = "";

        // Parse warranty string like "2 años" or "50000 km"
        if (warrantyStr) {
          if (warrantyStr.includes("año")) {
            parsedUnit = "years";
            parsedValue = warrantyStr.match(/\d+/)?.[0] || "";
          } else if (warrantyStr.includes("km")) {
            parsedUnit = "km";
            parsedValue = warrantyStr.match(/\d+/)?.[0] || "";
          }
        }

        setWarrantyUnit(parsedUnit);
        setWarrantyValue(parsedValue);

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

  // Load vendor cities from vendors.locations for the current user
  React.useEffect(() => {
    const loadVendorCities = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) return;
      const { data: vendor } = await supabase
        .from("vendors")
        .select("locations")
        .eq("user_id", userId)
        .single();
      if (vendor?.locations && Array.isArray(vendor.locations)) {
        const cities = vendor.locations
          .map((loc: { city?: string }) => loc?.city)
          .filter((c: string | undefined): c is string => Boolean(c));
        setVendorCities(Array.from(new Set(cities)));
      }
    };
    if (isOpen) {
      loadVendorCities();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Basic validation for required fields
    if (
      !formData.name.trim() ||
      !formData.brand.trim() ||
      !formData.type.trim() ||
      formData.price <= 0 ||
      !formData.location.trim() ||
      !formData.availability.trim() ||
      !formData.specifications.range.trim() ||
      !formData.specifications.chargeTime.trim() ||
      // warranty required through unit+value UI
      warrantyValue.trim().length === 0 ||
      !formData.specifications.battery.trim() ||
      !formData.specifications.performance.maxSpeed.trim() ||
      !formData.specifications.performance.power.trim()
    ) {
      setValidationError("Por favor completa todos los campos requeridos.");
      return;
    }
    // Attach structured warranty
    const payload = {
      ...formData,
      specifications: {
        ...formData.specifications,
        warranty:
          warrantyValue.trim().length > 0
            ? { type: warrantyUnit, value: Number(warrantyValue) }
            : formData.specifications.warranty,
      },
    };
    await onSubmit(payload as Partial<Vehicle>);
  };

  const handleImageFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingImages(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id ?? "anonymous";
      const accessToken = sessionData.session?.access_token ?? null;
      const anonKey =
        (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string) || "";
      const projectUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL as string) || "";
      const uploadedImages: { url: string; alt: string }[] = [];
      for (const file of Array.from(files)) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `vehicles/${userId}/${Date.now()}-${safeName}`;
        try {
          const { data: uploadData, error: uploadError } =
            await supabase.storage.from("vehicle-images").upload(path, file, {
              upsert: true,
              contentType: file.type || undefined,
            });
          if (uploadError) throw uploadError;
          const {
            data: { publicUrl },
          } = supabase.storage
            .from("vehicle-images")
            .getPublicUrl(uploadData.path);
          uploadedImages.push({
            url: publicUrl,
            alt: `${formData.name} image`,
          });
        } catch (sdkErr) {
          // Fallback to direct fetch when RLS path constraints are tricky
          if (!accessToken || !anonKey || !projectUrl) throw sdkErr;
          const form = new FormData();
          form.append("cacheControl", "3600");
          form.append("upsert", "true");
          form.append("file", file, safeName);
          const resp = await fetch(
            `${projectUrl}/storage/v1/object/vehicle-images/${path}`,
            {
              method: "POST",
              headers: {
                apikey: anonKey,
                Authorization: `Bearer ${accessToken}`,
              },
              body: form,
            }
          );
          if (!resp.ok) {
            const t = await resp.text();
            throw new Error(`Storage upload failed: ${resp.status} ${t}`);
          }
          const publicUrl = `${projectUrl}/storage/v1/object/public/vehicle-images/${path}`;
          uploadedImages.push({
            url: publicUrl,
            alt: `${formData.name} image`,
          });
        }
      }
      setFormData({
        ...formData,
        images: [...formData.images, ...uploadedImages],
      });
    } catch (err) {
      console.error("Error subiendo imágenes:", err);
      setValidationError(
        "No se pudieron subir algunas imágenes. Intenta de nuevo o cambia el archivo."
      );
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
                    <SelectItem value="patineta">Patineta</SelectItem>
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
                {vendorCities.length > 0 ? (
                  <Select
                    value={formData.location}
                    onValueChange={(value) =>
                      setFormData({ ...formData, location: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona ciudad" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendorCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    required
                    placeholder="Ej: Bogotá, Colombia"
                  />
                )}
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

            {/* Upload Images */}
            <div className="flex items-center gap-3">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageFiles(e.target.files)}
              />
              {uploadingImages && (
                <span className="text-sm text-gray-500">
                  Subiendo imágenes...
                </span>
              )}
            </div>

            {/* Display Images */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group aspect-[4/5]">
                    <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/placeholder.jpg";
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
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
                  Autonomía (km) *
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Distancia máxima con una sola carga.
                </p>
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
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiempo de Carga (horas) *
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Horas necesarias para una carga completa.
                </p>
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
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batería *
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Capacidad o tipo de batería (p. ej., 75 kWh).
                </p>
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
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Garantía *
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Selecciona unidad y valor. Se guardará como dato estructurado.
                </p>
                <div className="flex items-center gap-3 mb-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="warrantyUnit"
                      checked={warrantyUnit === "years"}
                      onChange={() => setWarrantyUnit("years")}
                    />
                    Años
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="warrantyUnit"
                      checked={warrantyUnit === "km"}
                      onChange={() => setWarrantyUnit("km")}
                    />
                    Km
                  </label>
                </div>
                <Input
                  type="number"
                  value={warrantyValue}
                  onChange={(e) => setWarrantyValue(e.target.value)}
                  placeholder={
                    warrantyUnit === "years" ? "Ej: 8" : "Ej: 160000"
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Velocidad Máxima (km/h) *
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Velocidad tope del vehículo.
                </p>
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
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Potencia (kW) *
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Potencia nominal del motor eléctrico.
                </p>
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
                  required
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
          {validationError && (
            <div className="text-red-600 text-sm">{validationError}</div>
          )}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
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
