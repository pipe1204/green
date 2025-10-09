"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Vehicle } from "@/types";
import {
  MessageCircle,
  Zap,
  CheckCircle,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";

interface ContactVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
}

export const ContactVendorModal: React.FC<ContactVendorModalProps> = ({
  isOpen,
  onClose,
  vehicle,
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Pre-fill form with user data if authenticated
  useEffect(() => {
    if (isOpen && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.user_metadata?.full_name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [isOpen, user]);

  // Reset states when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSuccess(false);
      setError(null);
      // Only reset form if guest (authenticated users keep their info)
      if (!user) {
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      }
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Use API endpoint instead of direct Supabase insert
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const response = await fetch("/api/customer/inquiries", {
        method: "POST",
        headers,
        body: JSON.stringify({
          vehicleId: vehicle.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error creating inquiry");
      }

      // Success!
      setSuccess(true);

      // Reset form and close after delay
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
        setSuccess(false);
        onClose();
      }, 9000);
    } catch (err) {
      console.error("Error sending inquiry:", err);
      setError(
        "Hubo un error al enviar tu mensaje. Por favor intenta de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Mensaje Enviado!
            </h3>
            <p className="text-gray-600 mb-4">
              Tu consulta ha sido enviada exitosamente al vendedor.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              El vendedor se pondrá en contacto contigo pronto para responder a
              tu consulta.
            </p>
            {!user && (
              <p className="text-sm text-blue-600 font-medium">
                💡 Crea una cuenta para hacer seguimiento a tus consultas y
                recibir respuestas más rápido.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center">
            <MessageCircle className="w-6 h-6 text-green-600 mr-2" />
            Contactar Vendedor
          </DialogTitle>
          <DialogDescription>
            Envía un mensaje al vendedor sobre {vehicle.name}. Te responderán
            pronto.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Information banner for all users */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
          {user ? (
            <p className="text-sm text-gray-800">
              ✉️ Tu mensaje será enviado al vendedor y podrás ver su respuesta
              en tu panel de control.
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-800 font-medium">
                📨 Puedes enviar tu mensaje sin registrarte
              </p>
              <p className="text-xs text-gray-600">
                El vendedor recibirá tu consulta y te contactará por email o
                teléfono. Sin embargo, si creas una cuenta podrás:
              </p>
              <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                <li>Ver las respuestas del vendedor en tu panel de control</li>
                <li>
                  Hacer seguimiento a todas tus consultas en un solo lugar
                </li>
                <li>Guardar vehículos favoritos y recibir alertas de precio</li>
              </ul>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 inline mr-1" />
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
                disabled={!!user} // Disabled for authenticated users
                className={user ? "bg-gray-100" : ""}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="w-4 h-4 inline mr-1" />
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
              <Mail className="w-4 h-4 inline mr-1" />
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
              disabled={!!user} // Disabled for authenticated users
              className={user ? "bg-gray-100" : ""}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mensaje *
            </label>
            <Textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="Cuéntanos qué te gustaría saber sobre este vehículo..."
              rows={5}
              required
              className="resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">Mínimo 10 caracteres</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || formData.message.length < 10}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Enviar Mensaje
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
      </DialogContent>
    </Dialog>
  );
};
