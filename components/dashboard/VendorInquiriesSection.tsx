"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, User, Mail, Phone, Calendar, Car } from "lucide-react";
import {
  CustomerInquiryWithDetails,
  VendorInquiriesResponse,
  CreateConversationResponse,
} from "@/types";

export function VendorInquiriesSection() {
  const { user, session } = useAuth();
  const [inquiries, setInquiries] = useState<CustomerInquiryWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !session) return;

    const fetchInquiries = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/vendor/inquiries", {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        });

        const data: VendorInquiriesResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error fetching inquiries");
        }

        setInquiries(data.inquiries || []);
      } catch (err) {
        console.error("Error fetching inquiries:", err);
        setError(
          err instanceof Error ? err.message : "Error loading inquiries"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [user, session]);

  const updateInquiryStatus = async (inquiryId: string, status: string) => {
    try {
      const response = await fetch(`/api/vendor/inquiries/${inquiryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Error updating inquiry status");
      }

      // Update local state
      setInquiries((prev) =>
        prev.map((inquiry) =>
          inquiry.id === inquiryId
            ? {
                ...inquiry,
                status: status as
                  | "pending"
                  | "replied"
                  | "closed"
                  | "converted",
              }
            : inquiry
        )
      );
    } catch (err) {
      console.error("Error updating inquiry status:", err);
      setError("Error updating inquiry status");
    }
  };

  const createConversation = async (
    inquiryId: string,
    initialMessage: string
  ) => {
    try {
      const response = await fetch(
        `/api/vendor/inquiries/${inquiryId}/conversation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ initialMessage }),
        }
      );

      const data: CreateConversationResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error creating conversation");
      }

      // Update local state to mark inquiry as converted
      setInquiries((prev) =>
        prev.map((inquiry) =>
          inquiry.id === inquiryId
            ? { ...inquiry, status: "converted" }
            : inquiry
        )
      );

      // Show success message or redirect to messages
      alert("Conversación creada exitosamente");

      return data;
    } catch (err) {
      console.error("Error creating conversation:", err);
      setError("Error creating conversation");
      throw err;
    }
  };

  const sendEmailToCustomer = async (inquiryId: string, message: string) => {
    try {
      const response = await fetch(`/api/vendor/inquiries/${inquiryId}/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error sending email");
      }

      alert("Email enviado exitosamente");
      return data;
    } catch (err) {
      console.error("Error sending email:", err);
      setError("Error sending email");
      throw err;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pendiente
          </Badge>
        );
      case "replied":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Respondido
          </Badge>
        );
      case "closed":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            Cerrado
          </Badge>
        );
      case "converted":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Convertido
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Inicia sesión para ver las consultas
          </h3>
          <p className="text-sm text-gray-600">
            Necesitas estar autenticado para acceder a las consultas
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Cargando consultas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 text-red-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error al cargar consultas
          </h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="sm"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (inquiries.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay consultas
          </h3>
          <p className="text-sm text-gray-600">
            Los clientes aún no han enviado consultas sobre tus vehículos
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Consultas de Clientes
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {inquiries.length} consulta{inquiries.length !== 1 ? "s" : ""}{" "}
            pendiente{inquiries.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="space-y-4 p-6">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {inquiry.customer.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span className="text-gray-400">
                            {inquiry.customer.email.replace(
                              /(.{2}).*(@.*)/,
                              "$1***$2"
                            )}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            {inquiry.isGuest
                              ? "(Usuario invitado)"
                              : "(Usuario registrado)"}
                          </span>
                        </div>
                        {inquiry.customer.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span>{inquiry.customer.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(inquiry.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(inquiry.status)}
                    {inquiry.isGuest && (
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        Invitado
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Car className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Vehículo consultado:
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900">
                      {inquiry.vehicle.brand} {inquiry.vehicle.name}
                    </h4>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Mensaje:
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-900">{inquiry.message}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {inquiry.isGuest
                      ? "Usuario invitado"
                      : "Usuario registrado"}
                  </div>
                  <div className="flex space-x-2">
                    {inquiry.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateInquiryStatus(inquiry.id, "replied")
                          }
                        >
                          Marcar como Respondido
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateInquiryStatus(inquiry.id, "closed")
                          }
                        >
                          Cerrar
                        </Button>
                      </>
                    )}
                    {inquiry.status === "replied" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateInquiryStatus(inquiry.id, "closed")
                        }
                      >
                        Cerrar
                      </Button>
                    )}
                    {inquiry.status === "closed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateInquiryStatus(inquiry.id, "pending")
                        }
                      >
                        Reabrir
                      </Button>
                    )}
                    {inquiry.status !== "converted" && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            const initialMessage = prompt(
                              "Escribe tu mensaje inicial para el cliente:",
                              `Hola ${inquiry.customer.name}, gracias por tu interés en nuestro vehículo. ¿En qué puedo ayudarte?`
                            );
                            if (initialMessage && initialMessage.trim()) {
                              createConversation(
                                inquiry.id,
                                initialMessage.trim()
                              );
                            }
                          }}
                        >
                          Iniciar Conversación
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                          onClick={() => {
                            const emailMessage = prompt(
                              inquiry.isGuest
                                ? "Escribe tu mensaje para enviar por email:"
                                : "Escribe tu mensaje para el cliente:",
                              `Hola ${inquiry.customer.name}, gracias por tu interés en nuestro vehículo. ¿En qué puedo ayudarte?`
                            );
                            if (emailMessage && emailMessage.trim()) {
                              sendEmailToCustomer(
                                inquiry.id,
                                emailMessage.trim()
                              );
                            }
                          }}
                        >
                          {inquiry.isGuest ? "Enviar Email" : "Enviar Mensaje"}
                        </Button>
                      </>
                    )}
                    {inquiry.status === "converted" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                        disabled
                      >
                        Conversación Creada
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
