"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Save, User, Mail, Calendar, Zap } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { CustomerProfile, UpdateProfileRequest } from "@/types";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { AccountDeletionModal } from "./AccountDeletionModal";

export function CustomerProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
  });

  // Validation state
  const [validationErrors, setValidationErrors] = useState<{
    full_name?: string;
  }>({});

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          setError("No access token available");
          return;
        }

        const response = await fetch("/api/customer/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
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
  }, [user]);

  // Form validation
  const validateForm = (): boolean => {
    const errors: { full_name?: string } = {};

    if (!formData.full_name.trim()) {
      errors.full_name = "Full name is required";
    } else if (formData.full_name.trim().length < 2) {
      errors.full_name = "Full name must be at least 2 characters";
    } else if (formData.full_name.trim().length > 50) {
      errors.full_name = "Full name must be less than 50 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Clear success message
    if (success) setSuccess(null);
  };

  // Handle form submission
  const handleSave = async () => {
    if (!user) return;

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("No access token available");
      }

      const updateData: UpdateProfileRequest = {
        full_name: formData.full_name.trim(),
      };

      const response = await fetch("/api/customer/profile", {
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

  // Handle account deletion
  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <Zap className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />{" "}
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <Alert>
        <AlertDescription>
          Failed to load profile. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Mi Perfil</span>
          </CardTitle>
          <CardDescription>
            Administra tu información personal y configuración de cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Success/Error Messages */}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Personal Information Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="full_name">Nombre Completo *</Label>
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

            <div>
              <Label htmlFor="email" className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Correo Electrónico</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="bg-gray-50"
              />
              <p className="text-sm text-gray-500 mt-1">
                El correo electrónico no se puede cambiar
              </p>
            </div>

            <div>
              <Label className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Miembro desde</span>
              </Label>
              <Input
                type="text"
                value={new Date(profile.created_at).toLocaleDateString(
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
          </div>

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
        </CardContent>
      </Card>

      {/* Account Deletion Modal */}
      <AccountDeletionModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onSuccess={() => {
          // The modal will handle the deletion and redirect
        }}
      />
    </div>
  );
}
