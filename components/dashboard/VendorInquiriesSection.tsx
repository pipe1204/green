"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  User,
  Mail,
  Phone,
  Calendar,
  Car,
  Zap,
  Clock,
} from "lucide-react";
import {
  CustomerInquiryWithDetails,
  VendorInquiriesResponse,
  CreateConversationResponse,
  VendorTestDriveBooking,
  VendorTestDrivesResponse,
  TestDriveResponseResponse,
  VendorRescheduleResponseResponse,
} from "@/types";
import { StartConversationModal } from "./StartConversationModal";
import { SendMessageModal } from "./SendMessageModal";
import { TestDriveResponseModal } from "./TestDriveResponseModal";
import { VendorRescheduleResponseModal } from "./VendorRescheduleResponseModal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function VendorInquiriesSection() {
  const { user, session } = useAuth();
  const [inquiries, setInquiries] = useState<CustomerInquiryWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStartConversationModal, setShowStartConversationModal] =
    useState(false);
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] =
    useState<CustomerInquiryWithDetails | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [updatingInquiryId, setUpdatingInquiryId] = useState<string | null>(
    null
  );

  // Test drive state
  const [testDrives, setTestDrives] = useState<VendorTestDriveBooking[]>([]);
  const [testDrivesLoading, setTestDrivesLoading] = useState(false);
  const [testDrivesError, setTestDrivesError] = useState<string | null>(null);
  const [showTestDriveResponseModal, setShowTestDriveResponseModal] =
    useState(false);
  const [selectedTestDrive, setSelectedTestDrive] =
    useState<VendorTestDriveBooking | null>(null);
  const [updatingTestDriveId, setUpdatingTestDriveId] = useState<string | null>(
    null
  );

  // Reschedule response state
  const [showRescheduleResponseModal, setShowRescheduleResponseModal] =
    useState(false);
  const [selectedRescheduleTestDrive, setSelectedRescheduleTestDrive] =
    useState<VendorTestDriveBooking | null>(null);
  const [rescheduleResponseLoading, setRescheduleResponseLoading] =
    useState(false);

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

    const fetchTestDrives = async () => {
      try {
        setTestDrivesLoading(true);
        setTestDrivesError(null);

        const response = await fetch("/api/vendor/test-drives", {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        });

        const data: VendorTestDrivesResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error fetching test drives");
        }

        setTestDrives(data.bookings || []);
      } catch (err) {
        console.error("Error fetching test drives:", err);
        setTestDrivesError(
          err instanceof Error ? err.message : "Error loading test drives"
        );
      } finally {
        setTestDrivesLoading(false);
      }
    };

    fetchInquiries();
    fetchTestDrives();
  }, [user, session]);

  const updateInquiryStatus = async (inquiryId: string, status: string) => {
    try {
      setUpdatingInquiryId(inquiryId);
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
    } finally {
      setUpdatingInquiryId(null);
    }
  };

  const createConversation = async (initialMessage: string) => {
    if (!selectedInquiry) return;

    try {
      setActionLoading(true);
      console.log("Creating conversation for inquiry:", selectedInquiry.id);
      console.log("Initial message:", initialMessage);

      const response = await fetch(
        `/api/vendor/inquiries/${selectedInquiry.id}/conversation`,
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

      // Only update local state after successful API call
      setInquiries((prev) =>
        prev.map((inquiry) =>
          inquiry.id === selectedInquiry.id
            ? { ...inquiry, status: "converted" }
            : inquiry
        )
      );

      setShowStartConversationModal(false);
      setSelectedInquiry(null);

      return data;
    } catch (err) {
      console.error("Error creating conversation:", err);
      setError("Error creating conversation");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const sendEmailToCustomer = async (message: string) => {
    if (!selectedInquiry) return;

    try {
      setActionLoading(true);
      const response = await fetch(
        `/api/vendor/inquiries/${selectedInquiry.id}/email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ message }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error sending email");
      }

      setShowSendMessageModal(false);
      setSelectedInquiry(null);
      // Success - no alert needed, user can see the updated status
      return data;
    } catch (err) {
      console.error("Error sending email:", err);
      setError("Error sending email");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const respondToTestDrive = async (
    response: "accepted" | "declined",
    message: string
  ) => {
    if (!selectedTestDrive) return;

    try {
      setUpdatingTestDriveId(selectedTestDrive.id);
      const apiResponse = await fetch(
        `/api/vendor/test-drives/${selectedTestDrive.id}/respond`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ response, message }),
        }
      );

      const data: TestDriveResponseResponse = await apiResponse.json();

      if (!apiResponse.ok) {
        throw new Error(data.error || "Error responding to test drive");
      }

      // Update local state
      setTestDrives((prev) =>
        prev.map((testDrive) =>
          testDrive.id === selectedTestDrive.id
            ? {
                ...testDrive,
                vendorResponse: response,
                vendorMessage: message,
                vendorResponseDate: new Date().toISOString(),
              }
            : testDrive
        )
      );

      setShowTestDriveResponseModal(false);
      setSelectedTestDrive(null);
    } catch (err) {
      console.error("Error responding to test drive:", err);
      setError("Error responding to test drive");
      throw err;
    } finally {
      setUpdatingTestDriveId(null);
    }
  };

  const respondToRescheduleRequest = async (
    response: "approved" | "rejected",
    message: string
  ) => {
    if (!selectedRescheduleTestDrive) return;

    try {
      setRescheduleResponseLoading(true);

      const apiResponse = await fetch(
        `/api/vendor/test-drives/${selectedRescheduleTestDrive.id}/reschedule`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            response,
            message: message.trim(),
          }),
        }
      );

      const data: VendorRescheduleResponseResponse = await apiResponse.json();

      if (!apiResponse.ok) {
        throw new Error(data.error || "Error responding to reschedule request");
      }

      // Update local state
      setTestDrives((prev) =>
        prev.map((testDrive) =>
          testDrive.id === selectedRescheduleTestDrive.id
            ? {
                ...testDrive,
                status: data.booking.status,
                vendorResponse: data.booking.vendorResponse,
                vendorMessage: data.booking.vendorMessage,
                vendorResponseDate: data.booking.vendorResponseDate,
                rescheduleStatus: data.booking.rescheduleStatus,
              }
            : testDrive
        )
      );

      setShowRescheduleResponseModal(false);
      setSelectedRescheduleTestDrive(null);
    } catch (err) {
      console.error("Error responding to reschedule request:", err);
      setError("Error responding to reschedule request");
      throw err;
    } finally {
      setRescheduleResponseLoading(false);
    }
  };

  const hasRescheduleRequest = (testDrive: VendorTestDriveBooking): boolean => {
    return testDrive.rescheduleStatus === "requested";
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
          <Zap className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando consultas...</p>
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
    <Tabs defaultValue="inquiries" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <TabsList>
          <TabsTrigger value="inquiries">
            Consultas ({inquiries.length})
          </TabsTrigger>
          <TabsTrigger value="test-drives">
            Pruebas de Manejo ({testDrives.length})
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="inquiries">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-3">
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
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
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
                              <span>
                                {inquiry.customer.phone.replace(
                                  /(\d{2})\d{4}(\d{2})/,
                                  "$1****$2"
                                )}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(inquiry.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-1 md:mt-0">
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

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="text-xs text-gray-500">
                      {inquiry.isGuest
                        ? "Usuario invitado"
                        : "Usuario registrado"}
                    </div>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      {inquiry.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateInquiryStatus(inquiry.id, "replied")
                            }
                            disabled={updatingInquiryId === inquiry.id}
                          >
                            {updatingInquiryId === inquiry.id ? (
                              <>
                                <Zap className="h-4 w-4 animate-spin mr-2" />
                                Actualizando...
                              </>
                            ) : (
                              "Marcar como Respondido"
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateInquiryStatus(inquiry.id, "closed")
                            }
                            disabled={updatingInquiryId === inquiry.id}
                          >
                            {updatingInquiryId === inquiry.id ? (
                              <>
                                <Zap className="h-4 w-4 animate-spin mr-2" />
                                Cerrando...
                              </>
                            ) : (
                              "Cerrar conversación"
                            )}
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
                          disabled={updatingInquiryId === inquiry.id}
                        >
                          {updatingInquiryId === inquiry.id ? (
                            <>
                              <Zap className="h-4 w-4 animate-spin mr-2" />
                              Cerrando...
                            </>
                          ) : (
                            "Cerrar conversación"
                          )}
                        </Button>
                      )}
                      {inquiry.status === "closed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateInquiryStatus(inquiry.id, "pending")
                          }
                          disabled={updatingInquiryId === inquiry.id}
                        >
                          {updatingInquiryId === inquiry.id ? (
                            <>
                              <Zap className="h-4 w-4 animate-spin mr-2" />
                              Reabriendo...
                            </>
                          ) : (
                            "Reabrir conversación"
                          )}
                        </Button>
                      )}
                      {inquiry.status !== "converted" &&
                        inquiry.status !== "closed" && (
                          <>
                            {inquiry.isGuest ? (
                              // Guest users: Only email option
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                onClick={() => {
                                  setSelectedInquiry(inquiry);
                                  setShowSendMessageModal(true);
                                }}
                              >
                                Enviar Email
                              </Button>
                            ) : (
                              // Registered users: Only conversation option
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => {
                                  setSelectedInquiry(inquiry);
                                  setShowStartConversationModal(true);
                                }}
                              >
                                Iniciar Conversación
                              </Button>
                            )}
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
      </TabsContent>

      <TabsContent value="test-drives">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="space-y-4">
              {testDrivesLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Zap className="w-8 h-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">
                    Cargando pruebas de manejo...
                  </span>
                </div>
              ) : testDrivesError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600">{testDrivesError}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    Reintentar
                  </Button>
                </div>
              ) : testDrives.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No hay pruebas programadas
                  </h3>
                  <p className="text-sm text-gray-600">
                    Los clientes aún no han programado pruebas de manejo
                  </p>
                </div>
              ) : (
                testDrives.map((testDrive) => (
                  <div
                    key={testDrive.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {testDrive.customerName}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Mail className="h-4 w-4" />
                              {testDrive.customerEmail.replace(
                                /(.{2}).*(@.*)/,
                                "$1***$2"
                              )}
                            </div>
                            {testDrive.customerPhone && (
                              <div className="flex items-center space-x-1">
                                <Phone className="h-4 w-4" />
                                <span>
                                  {testDrive.customerPhone.replace(
                                    /(\d{2})\d{4}(\d{2})/,
                                    "$1****$2"
                                  )}
                                </span>
                              </div>
                            )}

                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(
                                  testDrive.preferredDate
                                ).toLocaleDateString("es-CO")}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{testDrive.preferredTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-1 md:mt-0">
                        {testDrive.vendorResponse === "pending" && (
                          <Badge
                            variant="outline"
                            className="bg-yellow-50 text-yellow-700 border-yellow-200"
                          >
                            Pendiente
                          </Badge>
                        )}
                        {testDrive.vendorResponse === "accepted" && (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            Aceptada
                          </Badge>
                        )}
                        {testDrive.vendorResponse === "declined" && (
                          <Badge
                            variant="outline"
                            className="bg-red-50 text-red-700 border-red-200"
                          >
                            Declinada
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Car className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          Vehículo:
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h4 className="font-medium text-gray-900">
                          {testDrive.vehicle?.brand} {testDrive.vehicle?.name}
                        </h4>
                      </div>
                    </div>

                    {testDrive.message && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Mensaje del cliente:
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-gray-900">{testDrive.message}</p>
                        </div>
                      </div>
                    )}

                    {testDrive.vendorMessage && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Tu respuesta:
                        </h4>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-gray-900">
                            {testDrive.vendorMessage}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="text-xs text-gray-500">
                        Programada:{" "}
                        {new Date(testDrive.createdAt).toLocaleDateString(
                          "es-CO"
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 md:justify-end">
                        {testDrive.vendorResponse === "pending" &&
                          !hasRescheduleRequest(testDrive) && (
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => {
                                setSelectedTestDrive(testDrive);
                                setShowTestDriveResponseModal(true);
                              }}
                              disabled={updatingTestDriveId === testDrive.id}
                            >
                              {updatingTestDriveId === testDrive.id ? (
                                <>
                                  <Zap className="h-4 w-4 animate-spin mr-2" />
                                  Respondiendo...
                                </>
                              ) : (
                                "Responder"
                              )}
                            </Button>
                          )}

                        {/* Reschedule Response Button */}
                        {hasRescheduleRequest(testDrive) && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                            onClick={() => {
                              setSelectedRescheduleTestDrive(testDrive);
                              setShowRescheduleResponseModal(true);
                            }}
                            disabled={rescheduleResponseLoading}
                          >
                            {rescheduleResponseLoading ? (
                              <>
                                <Zap className="h-4 w-4 animate-spin mr-2" />
                                Respondiendo...
                              </>
                            ) : (
                              <>
                                <Calendar className="h-4 w-4 mr-2" />
                                Responder Reagendamiento
                              </>
                            )}
                          </Button>
                        )}

                        {testDrive.vendorResponse !== "pending" &&
                          !hasRescheduleRequest(testDrive) && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-gray-50 text-gray-700 border-gray-200"
                              disabled
                            >
                              {testDrive.vendorResponse === "accepted"
                                ? "Aceptada"
                                : "Declinada"}
                            </Button>
                          )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </TabsContent>

      {/* Modals */}
      <StartConversationModal
        isOpen={showStartConversationModal}
        onClose={() => {
          setShowStartConversationModal(false);
          setSelectedInquiry(null);
        }}
        onSubmit={createConversation}
        customerName={selectedInquiry?.customer.name || ""}
        vehicleName={selectedInquiry?.vehicle.name || ""}
        loading={actionLoading}
      />

      {selectedInquiry?.isGuest && (
        <SendMessageModal
          isOpen={showSendMessageModal}
          onClose={() => {
            setShowSendMessageModal(false);
            setSelectedInquiry(null);
          }}
          onSubmit={sendEmailToCustomer}
          customerName={selectedInquiry?.customer.name || ""}
          vehicleName={selectedInquiry?.vehicle.name || ""}
          loading={actionLoading}
        />
      )}

      <TestDriveResponseModal
        isOpen={showTestDriveResponseModal}
        onClose={() => {
          setShowTestDriveResponseModal(false);
          setSelectedTestDrive(null);
        }}
        onSubmit={respondToTestDrive}
        testDrive={
          selectedTestDrive || {
            id: "",
            vehicleId: "",
            customerId: "",
            vendorId: "",
            customerName: "",
            customerEmail: "",
            customerPhone: "",
            preferredDate: "",
            preferredTime: "",
            message: "",
            status: "pending",
            vendorResponse: "pending",
            vendorMessage: "",
            vendorResponseDate: "",
            vendorRespondedBy: "",
            createdAt: "",
            updatedAt: "",
            vehicle: {
              id: "",
              name: "",
              brand: "",
              type: "",
              price: 0,
              images: [],
              location: "",
            },
            customer: {
              id: "",
              name: "",
              email: "",
            },
          }
        }
        loading={updatingTestDriveId !== null}
      />

      {/* Vendor Reschedule Response Modal */}
      {selectedRescheduleTestDrive && (
        <VendorRescheduleResponseModal
          isOpen={showRescheduleResponseModal}
          onClose={() => {
            setShowRescheduleResponseModal(false);
            setSelectedRescheduleTestDrive(null);
          }}
          onSubmit={respondToRescheduleRequest}
          testDrive={selectedRescheduleTestDrive}
          loading={rescheduleResponseLoading}
        />
      )}
    </Tabs>
  );
}
