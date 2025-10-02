"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useConversations, useConversation } from "@/hooks/useMessaging";
import { ConversationList } from "./ConversationList";
import { MessageList } from "./MessageList";
import { MessageComposer } from "./MessageComposer";
import { MessageSquare } from "lucide-react";
import { ConversationHeader } from "./ConversationHeader";
import { MessageAttachment } from "@/types/messaging";

interface MessagingInterfaceProps {
  initialConversationId?: string;
  onClose?: () => void;
}

export function MessagingInterface({
  initialConversationId,
  onClose,
}: MessagingInterfaceProps) {
  const { user } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(initialConversationId || null);
  const [showMobileList, setShowMobileList] = useState(true);

  // Fetch conversations
  const {
    conversations,
    loading: conversationsLoading,
    error: conversationsError,
  } = useConversations();

  // Fetch selected conversation
  const {
    conversation,
    messages,
    loading: messagesLoading,
    error: messagesError,
    sendMessage,
    markAsRead,
  } = useConversation(selectedConversationId);

  // Auto-select first conversation if none selected
  useEffect(() => {
    if (!selectedConversationId && conversations.length > 0) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [selectedConversationId, conversations]);

  // Handle conversation selection
  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setShowMobileList(false); // Hide list on mobile when conversation is selected
  };

  // Handle sending messages
  const handleSendMessage = async (data: {
    content: string;
    attachments?: MessageAttachment[];
  }) => {
    if (!selectedConversationId) return;

    try {
      await sendMessage(data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle message read
  const handleMessageRead = (messageId: string) => {
    markAsRead(messageId);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Inicia sesión para usar los mensajes
          </h3>
          <p className="text-sm text-gray-600">
            Necesitas estar autenticado para acceder a los mensajes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-white">
      {/* Conversations Sidebar */}
      <div
        className={`
        flex flex-col w-full md:w-80 lg:w-96 border-r border-gray-200
        ${showMobileList ? "flex" : "hidden md:flex"}
      `}
      >
        <ConversationList
          conversations={conversations}
          loading={conversationsLoading}
          error={conversationsError}
          onConversationSelect={handleConversationSelect}
          selectedConversationId={selectedConversationId || undefined}
        />
      </div>

      {/* Main Chat Area */}
      <div
        className={`
        flex-1 flex flex-col
        ${!showMobileList ? "flex" : "hidden md:flex"}
      `}
      >
        {selectedConversationId && conversation ? (
          <>
            {/* Conversation Header */}
            <ConversationHeader
              conversation={{
                subject: conversation.subject,
                participant: conversation.participant,
                vehicle: conversation.vehicle,
                status: conversation.status,
              }}
              onClose={onClose}
              onBack={() => setShowMobileList(true)}
              showBackButton={true}
            />

            {/* Messages */}
            <MessageList
              messages={messages}
              loading={messagesLoading}
              error={messagesError}
              currentUserId={user.id}
              onMessageRead={handleMessageRead}
            />

            {/* Message Composer */}
            <MessageComposer
              onSubmit={handleSendMessage}
              disabled={messagesLoading}
              placeholder="Escribe tu mensaje..."
            />
          </>
        ) : (
          /* No conversation selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Selecciona una conversación
              </h3>
              <p className="text-sm text-gray-600">
                Elige una conversación de la lista para comenzar a chatear
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
