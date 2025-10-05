"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Clock, AlertCircle, Zap } from "lucide-react";
import { timeSlots } from "@/data";

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newDate: string, newTime: string, reason: string) => Promise<void>;
  vehicleName: string;
  currentDate: string;
  currentTime: string;
  rescheduleCount: number;
  loading: boolean;
}

export function RescheduleModal({
  isOpen,
  onClose,
  onSubmit,
  vehicleName,
  currentDate,
  currentTime,
  rescheduleCount,
  loading,
}: RescheduleModalProps) {
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newDate || !newTime || !reason.trim()) {
      return;
    }

    try {
      await onSubmit(newDate, newTime, reason.trim());
      // Reset form
      setNewDate("");
      setNewTime("");
      setReason("");
    } catch (error) {
      // Error handling is done in parent component
      console.error("Error submitting reschedule request:", error);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setNewDate("");
    setNewTime("");
    setReason("");
    onClose();
  };

  // Calculate remaining reschedules
  const remainingReschedules = 2 - rescheduleCount;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Reagendar Prueba de Manejo</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Vehicle Info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-gray-900 mb-1">Vehículo</h4>
            <p className="text-sm text-gray-600">{vehicleName}</p>
          </div>

          {/* Current Schedule */}
          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <Clock className="w-4 h-4 mr-1 text-yellow-600" />
              Horario Actual
            </h4>
            <div className="text-sm text-gray-600">
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(currentDate).toLocaleDateString("es-CO")}
              </p>
              <p>
                <strong>Hora:</strong> {currentTime}
              </p>
            </div>
          </div>

          {/* Reschedule Limit Warning */}
          {remainingReschedules <= 1 && (
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-orange-800">
                    Límite de Reagendamientos
                  </p>
                  <p className="text-orange-700">
                    Te quedan {remainingReschedules} reagendamiento
                    {remainingReschedules !== 1 ? "s" : ""} disponible
                    {remainingReschedules !== 1 ? "s" : ""}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Reschedule Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Date */}
            <div>
              <label
                htmlFor="newDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nueva Fecha *
              </label>
              <Input
                id="newDate"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]} // Today's date
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            {/* New Time */}
            <div>
              <label
                htmlFor="newTime"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nueva Hora *
              </label>
              <select
                id="newTime"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Seleccionar hora</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* Reason */}
            <div>
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Motivo del Reagendamiento *
              </label>
              <Textarea
                id="reason"
                placeholder="Explica por qué necesitas reagendar la prueba de manejo..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                disabled={loading}
                rows={3}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Este mensaje será enviado al vendedor.
              </p>
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
                disabled={loading || !newDate || !newTime || !reason.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  "Enviar Solicitud"
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
                  El vendedor recibirá tu solicitud de reagendamiento y podrá
                  aprobarla o sugerir una fecha alternativa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
