"use client";

import React from "react";
import { Conversation } from "@/types/messaging";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, AlertCircle } from "lucide-react";
import { ConversationItem } from "./ConversationItem";

interface ConversationListProps {
  conversations: Conversation[];
  loading?: boolean;
  error?: string | null;
  onConversationSelect: (conversationId: string) => void;
  selectedConversationId?: string;
}

export function ConversationList({
  conversations,
  loading,
  error,
  onConversationSelect,
  selectedConversationId,
}: ConversationListProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="text-sm text-gray-500">Cargando conversaciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 p-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error al cargar conversaciones
          </h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="text-sm"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 p-4">
        <MessageSquare className="h-16 w-16 text-gray-300" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No tienes conversaciones
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Inicia una conversación con un vendedor desde el catálogo de
            vehículos
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Conversaciones</h2>
        <Button
          variant="outline"
          size="sm"
          className="text-green-600 border-green-200 hover:bg-green-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva
        </Button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-2">
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedConversationId === conversation.id}
              onClick={() => onConversationSelect(conversation.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
