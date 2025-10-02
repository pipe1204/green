"use client";

import React from "react";
import { Message } from "@/types/messaging";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  showTimestamp?: boolean;
  onRead?: () => void;
}

export function MessageBubble({
  message,
  isOwn,
  showAvatar = false,
  showTimestamp = false,
  onRead,
}: MessageBubbleProps) {
  const formatTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const getSenderInitials = () => {
    // This would typically come from user data, for now just use a default
    return message.senderType === "customer" ? "T" : "V";
  };

  const getSenderName = () => {
    return message.senderType === "customer" ? "Tú" : "Vendedor";
  };

  return (
    <div
      className={`flex items-end space-x-2 ${
        isOwn ? "flex-row-reverse space-x-reverse" : ""
      }`}
    >
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-green-100 text-green-700 text-xs">
            {getSenderInitials()}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message Content */}
      <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
        {/* Sender Name */}
        {showAvatar && !isOwn && (
          <span className="text-xs text-gray-500 mb-1">{getSenderName()}</span>
        )}

        {/* Message Bubble */}
        <div
          className={`
            px-4 py-2 rounded-2xl max-w-xs break-words
            ${
              isOwn
                ? "bg-green-500 text-white rounded-br-md"
                : "bg-gray-100 text-gray-900 rounded-bl-md"
            }
          `}
          onClick={onRead}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>

        {/* Timestamp */}
        {showTimestamp && (
          <span className="text-xs text-gray-500 mt-1">
            {formatTime(message.createdAt)}
          </span>
        )}
      </div>

      {/* Avatar for own messages (spacer) */}
      {showAvatar && isOwn && <div className="h-8 w-8 flex-shrink-0" />}
    </div>
  );
}
