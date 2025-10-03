"use client";

import React from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRealtimeConversations } from "@/hooks/useRealtimeConversations";
import { MessagingInterface } from "@/components/messaging/MessagingInterface";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";

export function InquiriesSection() {
  const { user } = useAuth();
  const { conversations } = useRealtimeConversations();

  // Calculate unread message count
  const unreadCount = conversations.reduce(
    (total, conv) => total + conv.unreadCount,
    0
  );

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Inicia sesión para ver tus mensajes
          </h3>
          <p className="text-sm text-gray-600">
            Necesitas estar autenticado para acceder a los mensajes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Consultas</h1>
          <p className="text-sm text-gray-600 mt-1">
            {conversations.length === 0
              ? "No tienes conversaciones aún"
              : `${conversations.length} conversación${
                  conversations.length !== 1 ? "es" : ""
                }`}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {unreadCount > 0 && (
            <Badge variant="destructive" className="px-3 py-1">
              {unreadCount} sin leer
            </Badge>
          )}
        </div>
      </div>

      {/* Messages Interface - Full remaining height */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <MessagingInterface />
      </div>
    </div>
  );
}
