"use client";

import React, { useState, useRef } from "react";
import { MessageAttachment } from "@/types/messaging";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Smile, X, Loader2 } from "lucide-react";
import { FileUpload } from "./FileUpload";
import { EmojiPicker } from "./EmojiPicker";

interface MessageComposerProps {
  onSubmit: (data: {
    content: string;
    attachments?: MessageAttachment[];
  }) => Promise<void>;
  onTyping?: () => void;
  onStopTyping?: () => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export function MessageComposer({
  onSubmit,
  onTyping,
  onStopTyping,
  disabled = false,
  placeholder = "Escribe tu mensaje...",
  maxLength = 1000,
}: MessageComposerProps) {
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleContentChange = (value: string) => {
    setContent(value);

    // Handle typing indicators
    if (onTyping && value.trim()) {
      onTyping();

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        if (onStopTyping) {
          onStopTyping();
        }
      }, 2000);
    } else if (onStopTyping && !value.trim()) {
      onStopTyping();
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && attachments.length === 0) return;
    if (isSubmitting || disabled) return;

    try {
      setIsSubmitting(true);

      await onSubmit({
        content: content.trim(),
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      // Reset form
      setContent("");
      setAttachments([]);

      // Stop typing indicator
      if (onStopTyping) {
        onStopTyping();
      }

      // Focus back to textarea
      textareaRef.current?.focus();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileUpload = (file: MessageAttachment) => {
    setAttachments((prev) => [...prev, file]);
    setShowFileUpload(false);
  };

  const handleFileRemove = (fileUrl: string) => {
    setAttachments((prev) => prev.filter((att) => att.url !== fileUrl));
  };

  const handleEmojiSelect = (emoji: string) => {
    setContent((prev) => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const canSubmit = content.trim().length > 0 || attachments.length > 0;

  return (
    <div className="border-t border-gray-200 p-4">
      {/* File Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.url}
                className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2 text-sm"
              >
                <span className="truncate max-w-32">{attachment.fileName}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFileRemove(attachment.url)}
                  className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Composer */}
      <div className="flex items-end space-x-2">
        {/* File Upload Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFileUpload(!showFileUpload)}
          disabled={disabled}
          className="h-10 w-10 p-0"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        {/* Emoji Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          disabled={disabled}
          className="h-10 w-10 p-0"
        >
          <Smile className="h-5 w-5" />
        </Button>

        {/* Text Input */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled || isSubmitting}
            maxLength={maxLength}
            className="min-h-[40px] max-h-32 resize-none pr-12"
            rows={1}
          />

          {/* Character Count */}
          {maxLength && (
            <div className="absolute bottom-1 right-1 text-xs text-gray-400">
              {content.length}/{maxLength}
            </div>
          )}
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting || disabled}
          className="h-10 w-10 p-0 bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <EmojiPicker
          onEmojiSelect={handleEmojiSelect}
          onClose={() => setShowEmojiPicker(false)}
          isOpen={showEmojiPicker}
        />
      )}

      {/* File Upload Modal */}
      {showFileUpload && (
        <FileUpload
          onFileSelect={handleFileUpload}
          onClose={() => setShowFileUpload(false)}
          maxFiles={5}
          maxSize={10 * 1024 * 1024} // 10MB
        />
      )}
    </div>
  );
}
