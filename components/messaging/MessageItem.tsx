"use client";

import React, { useEffect } from "react";
import { Message } from "@/types/messaging";
import { MessageAttachment } from "./MessageAttachment";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { MessageBubble } from "./MessageBubble";

interface MessageItemProps {
  message: Message;
  currentUserId: string;
  onMessageRead?: (messageId: string) => void;
}

export function MessageItem({
  message,
  currentUserId,
  onMessageRead,
}: MessageItemProps) {
  const isOwn = message.senderId === currentUserId;

  const formatMessageTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
      });
    } catch {
      return "Hace un momento";
    }
  };

  const handleMessageRead = () => {
    if (!isOwn && !message.isRead && onMessageRead) {
      onMessageRead(message.id);
    }
  };

  useEffect(() => {
    // Mark message as read when it comes into view (if it's not our own message)
    if (!isOwn && !message.isRead) {
      const timer = setTimeout(() => {
        handleMessageRead();
      }, 1000); // Mark as read after 1 second of being visible

      return () => clearTimeout(timer);
    }
  }, [isOwn, message.isRead, message.id, onMessageRead]);

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? "order-2" : "order-1"}`}>
        {/* Message Bubble */}
        <MessageBubble
          message={message}
          isOwn={isOwn}
          showAvatar={!isOwn}
          showTimestamp={true}
          onRead={handleMessageRead}
        />

        {/* Message Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className={`mt-2 space-y-2 ${isOwn ? "ml-auto" : "mr-auto"}`}>
            {message.attachments.map((attachment) => (
              <MessageAttachment
                key={attachment.id}
                attachment={attachment}
                isOwn={isOwn}
              />
            ))}
          </div>
        )}

        {/* Message Status */}
        <div
          className={`flex items-center mt-1 ${
            isOwn ? "justify-end" : "justify-start"
          }`}
        >
          <span className="text-xs text-gray-500">
            {formatMessageTime(message.createdAt)}
          </span>
          {isOwn && (
            <div className="ml-2 flex items-center">
              {message.isRead ? (
                <span className="text-xs text-blue-500">✓✓</span>
              ) : (
                <span className="text-xs text-gray-400">✓</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
