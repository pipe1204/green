"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trash2,
  Save,
  User,
  Mail,
  Calendar,
  Building2,
  MapPin,
  Phone,
  Globe,
  FileText,
  Zap,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { colombianDepartments, departmentLabels } from "@/data";
import { useAuth } from "@/components/auth/AuthProvider";
import { VendorProfile, UpdateVendorProfileRequest } from "@/types";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { VendorAccountDeletionModal } from "./VendorAccountDeletionModal";

export default function VendorProfilePage() {
  const { user, session } = useAuth();
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    business_name: "",
    business_type: "",
    nit: "",
    address: "",
    city: "",
    department: "",
    state: "",
    country: "Colombia",
    phone: "",
    website: "",
    description: "",
  });

  // Validation state
  const [validationErrors, setValidationErrors] = useState<{
    full_name?: string;
    business_name?: string;
    nit?: string;
    website?: string;
  }>({});

  // Fetch vendor profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        if (!session?.access_token) {
          throw new Error("No access token available");
        }

        const response = await fetch("/api/vendor/profile", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch profile");
        }

        setProfile(data.profile);
        setFormData({
          full_name: data.profile.full_name || "",
          business_name: data.profile.business_name || "",
          business_type: data.profile.business_type || "",
          nit: data.profile.nit || "",
          address: data.profile.address || "",
          city: data.profile.city || "",
          department: data.profile.department || "",
          state: data.profile.state || "",
          country: data.profile.country || "Colombia",
          phone: data.profile.phone || "",
          website: data.profile.website || "",
          description: data.profile.description || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, session]);

  // Form validation
  const validateForm = (): boolean => {
    const errors: {
      full_name?: string;
      business_name?: string;
      nit?: string;
      website?: string;
    } = {};

    if (!formData.full_name.trim()) {
      errors.full_name = "Full name is required";
    } else if (formData.full_name.trim().length < 2) {
      errors.full_name = "Full name must be at least 2 characters";
    } else if (formData.full_name.trim().length > 50) {
      errors.full_name = "Full name must be less than 50 characters";
    }

    if (!formData.business_name.trim()) {
      errors.business_name = "Business name is required";
    } else if (formData.business_name.trim().length < 2) {
      errors.business_name = "Business name must be at least 2 characters";
    } else if (formData.business_name.trim().length > 100) {
      errors.business_name = "Business name must be less than 100 characters";
    }

    if (formData.nit && formData.nit.trim()) {
      const nitRegex = /^\d{9}-\d$/;
      if (!nitRegex.test(formData.nit.trim())) {
        errors.nit =
          "El NIT debe tener el formato: 9 dígitos + 1 dígito de verificación (ej: 900123456-7)";
      }
    }

    if (formData.website && formData.website.trim()) {
      const urlRegex = /^https?:\/\/.+/;
      if (!urlRegex.test(formData.website.trim())) {
        errors.website = "Website must start with http:// or https://";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Get cities for selected department
  const getCitiesForDepartment = (dept: string) => {
    return (
      colombianDepartments[dept as keyof typeof colombianDepartments] || []
    );
  };

  // Handle form input changes
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error for this field
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof typeof validationErrors];
        return newErrors;
      });
    }

    // Reset city when department changes
    if (field === "department") {
      setFormData((prev) => ({ ...prev, city: "" }));
    }
  };

  // Handle form submission
  const handleSave = async () => {
    if (!user || !session?.access_token) {
      setError("No access token available");
      return;
    }

    if (!validateForm()) {
      setError("Please fix the validation errors before saving");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const updateData: UpdateVendorProfileRequest = {
        full_name: formData.full_name.trim(),
        business_name: formData.business_name.trim(),
        business_type: formData.business_type.trim() || undefined,
        nit: formData.nit.trim() || undefined,
        address: formData.address.trim() || undefined,
        city: formData.city.trim() || undefined,
        department: formData.department.trim() || undefined,
        state: formData.state.trim() || undefined,
        country: formData.country.trim(),
        phone: formData.phone.trim() || undefined,
        website: formData.website.trim() || undefined,
        description: formData.description.trim() || undefined,
      };

      const response = await fetch("/api/vendor/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setProfile(data.profile);
      setSuccess("Profile updated successfully!");

      // Trigger a custom event to notify other components of profile update
      window.dispatchEvent(
        new CustomEvent("profileUpdated", {
          detail: { profile: data.profile },
        })
      );
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Handle delete account
  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Zap className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />{" "}
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-600">
            Gestiona tu información personal y de negocio
          </p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Personal Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Información Personal</span>
          </CardTitle>
          <CardDescription>Tu información personal básica</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Nombre Completo</span>
            </Label>
            <Input
              id="full_name"
              type="text"
              value={formData.full_name}
              onChange={(e) => handleInputChange("full_name", e.target.value)}
              className={validationErrors.full_name ? "border-red-500" : ""}
              placeholder="Ingresa tu nombre completo"
            />
            {validationErrors.full_name && (
              <p className="text-sm text-red-600 mt-1">
                {validationErrors.full_name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Correo Electrónico</span>
            </Label>
            <Input
              type="email"
              value={profile?.email || ""}
              disabled
              className="bg-gray-50"
            />
            <p className="text-sm text-gray-500">
              El correo electrónico no se puede cambiar
            </p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Miembro desde</span>
            </Label>
            <Input
              type="text"
              value={new Date(profile?.created_at || "").toLocaleDateString(
                "es-CO",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
              disabled
              className="bg-gray-50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Business Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <span>Información del Negocio</span>
          </CardTitle>
          <CardDescription>Detalles de tu empresa o negocio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="business_name"
              className="flex items-center space-x-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Nombre del Negocio *</span>
            </Label>
            <Input
              id="business_name"
              type="text"
              value={formData.business_name}
              onChange={(e) =>
                handleInputChange("business_name", e.target.value)
              }
              className={validationErrors.business_name ? "border-red-500" : ""}
              placeholder="Nombre de tu empresa o negocio"
            />
            {validationErrors.business_name && (
              <p className="text-sm text-red-600 mt-1">
                {validationErrors.business_name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="business_type"
              className="flex items-center space-x-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Tipo de Negocio</span>
            </Label>
            <Select
              value={formData.business_type}
              onValueChange={(value) =>
                handleInputChange("business_type", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de negocio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tienda">Tienda</SelectItem>
                <SelectItem value="distribuidor">Distribuidor</SelectItem>
                <SelectItem value="concesionario">Concesionario</SelectItem>
                <SelectItem value="fabricante">Fabricante</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nit" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>NIT</span>
            </Label>
            <Input
              id="nit"
              type="text"
              value={formData.nit}
              onChange={(e) => handleInputChange("nit", e.target.value)}
              className={validationErrors.nit ? "border-red-500" : ""}
              placeholder="900123456-7"
            />
            <p className="text-xs text-gray-500">
              Número de Identificación Tributaria (9 dígitos + 1 dígito de
              verificación)
            </p>
            {validationErrors.nit && (
              <p className="text-sm text-red-600 mt-1">
                {validationErrors.nit}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Dirección</span>
            </Label>
            <Input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Dirección principal del negocio"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="department"
                className="flex items-center space-x-2"
              >
                <MapPin className="w-4 h-4" />
                <span>Departamento</span>
              </Label>
              <Select
                value={formData.department}
                onValueChange={(value) =>
                  handleInputChange("department", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar departamento" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(departmentLabels)
                    .sort(([, a], [, b]) => a.localeCompare(b))
                    .map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Ciudad</span>
              </Label>
              <Select
                value={formData.city}
                onValueChange={(value) => handleInputChange("city", value)}
                disabled={!formData.department}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      formData.department
                        ? "Seleccionar ciudad"
                        : "Primero selecciona el departamento"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {getCitiesForDepartment(formData.department).map(
                    (cityName) => (
                      <SelectItem key={cityName} value={cityName}>
                        {cityName}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>País</span>
              </Label>
              <Input
                id="country"
                type="text"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                placeholder="País"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Teléfono del Negocio</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="Teléfono de contacto del negocio"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Sitio Web</span>
            </Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              className={validationErrors.website ? "border-red-500" : ""}
              placeholder="https://www.tunegocio.com"
            />
            {validationErrors.website && (
              <p className="text-sm text-red-600 mt-1">
                {validationErrors.website}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Descripción del Negocio</span>
            </Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              rows={4}
              placeholder="Describe tu negocio, servicios, especialidades..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Guardando..." : "Guardar Cambios"}</span>
        </Button>

        <Button
          variant="destructive"
          onClick={handleDeleteAccount}
          className="flex items-center space-x-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Eliminar Cuenta</span>
        </Button>
      </div>

      {/* Account Deletion Modal */}
      <VendorAccountDeletionModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
