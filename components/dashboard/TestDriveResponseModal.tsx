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
import { CheckCircle, XCircle, Calendar, Clock, Car } from "lucide-react";
import { VendorTestDriveBooking } from "@/types";

interface TestDriveResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    response: "accepted" | "declined",
    message: string
  ) => Promise<void>;
  testDrive: VendorTestDriveBooking;
  loading: boolean;
}

export function TestDriveResponseModal({
  isOpen,
  onClose,
  onSubmit,
  testDrive,
  loading,
}: TestDriveResponseModalProps) {
  const [response, setResponse] = useState<"accepted" | "declined" | null>(
    null
  );
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!response || !message.trim()) return;

    try {
      await onSubmit(response, message.trim());
      // Reset form
      setResponse(null);
      setMessage("");
      onClose();
    } catch (error) {
      console.error("Error responding to test drive:", error);
    }
  };

  const handleClose = () => {
    setResponse(null);
    setMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center">
            <Calendar className="w-6 h-6 text-blue-600 mr-2" />
            Responder a Prueba de Manejo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Test Drive Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Car className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-900">
                {testDrive.vehicle?.brand} {testDrive.vehicle?.name}
              </span>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm text-gray-600">Cliente:</span>
              <span className="text-sm font-medium">
                {testDrive.customerName}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {new Date(testDrive.preferredDate).toLocaleDateString("es-CO")}{" "}
                a las {testDrive.preferredTime}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Response Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Respuesta *
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="response"
                    value="accepted"
                    checked={response === "accepted"}
                    onChange={(e) => setResponse(e.target.value as "accepted")}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Aceptar
                    </span>
                  </div>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="response"
                    value="declined"
                    checked={response === "declined"}
                    onChange={(e) => setResponse(e.target.value as "declined")}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Declinar
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje para el cliente *
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  response === "accepted"
                    ? "¡Perfecto! Te esperamos el día acordado. ¿Podrías confirmar tu asistencia?"
                    : "Lamentamos informarte que no podemos atender tu solicitud en esa fecha. ¿Te gustaría programar para otra fecha?"
                }
                rows={3}
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="submit"
                disabled={!response || !message.trim() || loading}
                className={`flex-1 ${
                  response === "accepted"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : response === "declined"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gray-600 hover:bg-gray-700 text-white"
                }`}
              >
                {loading ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    {response === "accepted" ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : response === "declined" ? (
                      <XCircle className="w-4 h-4 mr-2" />
                    ) : null}
                    {response === "accepted"
                      ? "Aceptar Prueba"
                      : response === "declined"
                      ? "Declinar Prueba"
                      : "Seleccionar Respuesta"}
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
