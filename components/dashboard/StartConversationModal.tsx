"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, MessageSquare, User } from "lucide-react";

interface StartConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (message: string) => void;
  customerName: string;
  vehicleName: string;
  loading?: boolean;
}

export function StartConversationModal({
  isOpen,
  onClose,
  onSubmit,
  customerName,
  vehicleName,
  loading = false,
}: StartConversationModalProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message.trim());
      setMessage("");
    }
  };

  const handleClose = () => {
    setMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Iniciar Conversación
              </h3>
              <p className="text-sm text-gray-600">
                Envía un mensaje inicial al cliente
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
              <User className="h-4 w-4" />
              <span>
                Cliente:{" "}
                <span className="font-medium text-gray-900">
                  {customerName}
                </span>
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Vehículo:{" "}
              <span className="font-medium text-gray-900">{vehicleName}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mensaje inicial
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Hola ${customerName}, gracias por tu interés en nuestro vehículo. ¿En qué puedo ayudarte?`}
                className="min-h-[120px] resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Este mensaje iniciará la conversación con el cliente
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                disabled={loading || !message.trim()}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Enviando...</span>
                  </div>
                ) : (
                  "Iniciar Conversación"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
