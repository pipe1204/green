"use client";

import React, { useEffect, useRef } from "react";
import { Message } from "@/types/messaging";
import { AlertCircle } from "lucide-react";
import { MessageItem } from "./MessageItem";

interface MessageListProps {
  messages: Message[];
  loading?: boolean;
  error?: string | null;
  currentUserId: string;
  onMessageRead?: (messageId: string) => void;
}

export function MessageList({
  messages,
  loading,
  error,
  currentUserId,
  onMessageRead,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="text-sm text-gray-500">Cargando mensajes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 p-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error al cargar mensajes
          </h3>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 p-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay mensajes aún
          </h3>
          <p className="text-sm text-gray-600">
            Envía el primer mensaje para comenzar la conversación
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          currentUserId={currentUserId}
          onMessageRead={onMessageRead}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
