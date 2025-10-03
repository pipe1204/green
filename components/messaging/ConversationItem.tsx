"use client";

import React from "react";
import { Conversation } from "@/types/messaging";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { MessageCircle, Clock, CheckCircle2 } from "lucide-react";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

export function ConversationItem({
  conversation,
  isSelected,
  onClick,
}: ConversationItemProps) {
  const formatLastMessageTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
      });
    } catch {
      return "Hace un momento";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <MessageCircle className="h-3 w-3 text-green-500" />;
      case "closed":
        return <CheckCircle2 className="h-3 w-3 text-gray-500" />;
      default:
        return <Clock className="h-3 w-3 text-orange-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-orange-100 text-orange-800";
    }
  };

  return (
    <div
      onClick={onClick}
      className={`
        p-4 rounded-lg cursor-pointer transition-all duration-200
        ${
          isSelected
            ? "bg-green-50 border border-green-200 shadow-sm"
            : "bg-white hover:bg-gray-50 border border-transparent hover:border-gray-200"
        }
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900 truncate">
              {conversation.subject}
            </h3>
            <Badge
              variant="secondary"
              className={`text-xs ${getStatusColor(conversation.status)}`}
            >
              {getStatusIcon(conversation.status)}
              <span className="ml-1 capitalize">{conversation.status}</span>
            </Badge>
          </div>

          <p className="text-sm text-gray-600 truncate">
            Con {conversation.participant.name}
          </p>

          <p className="text-xs text-gray-500 truncate">
            {conversation.vehicle.brand} {conversation.vehicle.name}
          </p>
        </div>

        <div className="flex flex-col items-end ml-2">
          <span className="text-xs text-gray-500">
            {formatLastMessageTime(conversation.lastMessageAt)}
          </span>
          {conversation.unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="text-xs mt-1 bg-red-500 hover:bg-red-600"
            >
              {conversation.unreadCount}
            </Badge>
          )}
        </div>
      </div>

      {conversation.lastMessage && (
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-600 truncate">
              <span className="font-medium">
                {conversation.lastMessage.senderType === "customer"
                  ? "Tú"
                  : conversation.participant.name}
                :
              </span>{" "}
              {conversation.lastMessage.content}
            </p>
          </div>
          {conversation.lastMessage.senderType === "customer" && (
            <CheckCircle2 className="h-3 w-3 text-gray-400 flex-shrink-0" />
          )}
        </div>
      )}
    </div>
  );
}
