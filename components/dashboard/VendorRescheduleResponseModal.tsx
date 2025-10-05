"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  AlertCircle,
  Zap,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { VendorTestDriveBooking } from "@/types";

interface VendorRescheduleResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    response: "approved" | "rejected",
    message: string
  ) => Promise<void>;
  testDrive: VendorTestDriveBooking;
  loading: boolean;
}

export function VendorRescheduleResponseModal({
  isOpen,
  onClose,
  onSubmit,
  testDrive,
  loading,
}: VendorRescheduleResponseModalProps) {
  const [response, setResponse] = useState<"approved" | "rejected" | null>(
    null
  );
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!response || !message.trim()) {
      return;
    }

    try {
      await onSubmit(response, message.trim());

      // Reset form
      setResponse(null);
      setMessage("");
    } catch (error) {
      // Error handling is done in parent component
      console.error("Error submitting reschedule response:", error);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setResponse(null);
    setMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Responder a Solicitud de Reagendamiento</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer Info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-gray-900 mb-1">Cliente</h4>
            <p className="text-sm text-gray-600">{testDrive.customerName}</p>
            <p className="text-sm text-gray-600">{testDrive.vehicle?.name}</p>
          </div>

          {/* Original Schedule */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <Clock className="w-4 h-4 mr-1 text-blue-600" />
              Horario Original
            </h4>
            <div className="text-sm text-gray-600">
              <p>
                <strong>Fecha:</strong>{" "}
                {testDrive.originalPreferredDate
                  ? new Date(
                      testDrive.originalPreferredDate
                    ).toLocaleDateString("es-CO")
                  : new Date(testDrive.preferredDate).toLocaleDateString(
                      "es-CO"
                    )}
              </p>
              <p>
                <strong>Hora:</strong>{" "}
                {testDrive.originalPreferredTime || testDrive.preferredTime}
              </p>
            </div>
          </div>

          {/* Customer's New Request */}
          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1 text-yellow-600" />
              Nueva Solicitud del Cliente
            </h4>
            <div className="text-sm text-gray-600">
              <p>
                <strong>Nueva Fecha:</strong>{" "}
                {new Date(testDrive.preferredDate).toLocaleDateString("es-CO")}
              </p>
              <p>
                <strong>Nueva Hora:</strong> {testDrive.preferredTime}
              </p>
              {testDrive.rescheduleReason && (
                <div className="mt-2">
                  <p className="font-medium">Motivo:</p>
                  <p className="text-gray-700 italic">
                    &quot;{testDrive.rescheduleReason}&quot;
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Response Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Approve/Reject Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Decisión *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={response === "approved" ? "default" : "outline"}
                  onClick={() => setResponse("approved")}
                  disabled={loading}
                  className={`flex items-center justify-center ${
                    response === "approved"
                      ? "bg-green-600 hover:bg-green-700"
                      : ""
                  }`}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Aprobar
                </Button>
                <Button
                  type="button"
                  variant={response === "rejected" ? "default" : "outline"}
                  onClick={() => setResponse("rejected")}
                  disabled={loading}
                  className={`flex items-center justify-center ${
                    response === "rejected" ? "bg-red-600 hover:bg-red-700" : ""
                  }`}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Rechazar
                </Button>
              </div>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mensaje al Cliente *
              </label>
              <Textarea
                id="message"
                placeholder={
                  response === "approved"
                    ? "Mensaje de confirmación para el cliente..."
                    : "Explica por qué no puedes aceptar este reagendamiento..."
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                disabled={loading}
                rows={3}
                className="w-full"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || !response || !message.trim()}
                className={`flex-1 ${
                  response === "approved"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {loading ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  `${
                    response === "approved" ? "Aprobar" : "Rechazar"
                  } Solicitud`
                )}
              </Button>
            </div>
          </form>

          {/* Info Note */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium">¿Qué sucede después?</p>
                <p className="text-blue-600">
                  {response === "approved"
                    ? "El cliente será notificado de la aprobación y la prueba se confirmará para la nueva fecha."
                    : "El cliente será notificado del rechazo. Si sugieres una fecha alternativa en tu mensaje, el cliente podrá usar el botón 'Reagendar Prueba' para reservar esa fecha."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
