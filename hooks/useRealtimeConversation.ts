"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { ConversationDetails, Message } from "@/types/messaging";

export function useRealtimeConversation(conversationId: string | null) {
  const { user } = useAuth();
  const [conversation, setConversation] = useState<ConversationDetails | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!conversationId || !user) return;

    // Initial fetch
    const fetchConversation = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch conversation details
        const { data: convData, error: convError } = await supabase
          .from("conversations")
          .select(
            `
            *,
            profiles!conversations_customer_id_fkey(full_name, email),
            vendors!conversations_vendor_id_fkey(business_name, user_id),
            vehicles(name, brand, images, price)
          `
          )
          .eq("id", conversationId)
          .single();

        if (convError) throw convError;

        // Fetch messages
        const { data: messagesData, error: messagesError } = await supabase
          .from("messages")
          .select(
            `
            *,
            message_attachments(file_url, file_name, file_type, file_size)
          `
          )
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true });

        if (messagesError) throw messagesError;

        // Transform conversation
        const transformedConversation: ConversationDetails = {
          id: convData.id as string,
          subject: convData.subject as string,
          status: convData.status as "open" | "closed" | "archived",
          participant: {
            name:
              ((convData.profiles as Record<string, unknown>)
                ?.full_name as string) ||
              ((convData.vendors as Record<string, unknown>)
                ?.business_name as string) ||
              "Unknown",
            email:
              ((convData.profiles as Record<string, unknown>)
                ?.email as string) || "",
          },
          vehicle: {
            id:
              ((convData.vehicles as Record<string, unknown>)?.id as string) ||
              "",
            name:
              ((convData.vehicles as Record<string, unknown>)
                ?.name as string) || "Unknown Vehicle",
            brand:
              ((convData.vehicles as Record<string, unknown>)
                ?.brand as string) || "Unknown Brand",
            images:
              ((convData.vehicles as Record<string, unknown>)?.images as Array<{
                url: string;
                alt: string;
              }>) || [],
            price: (convData.vehicles as Record<string, unknown>)
              ?.price as number,
          },
          lastMessageAt: convData.last_message_at as string,
          unreadCount: 0, // Will be calculated separately
          createdAt: convData.created_at as string,
          updatedAt: convData.updated_at as string,
          customer: {
            id: convData.customer_id as string,
            name:
              ((convData.profiles as Record<string, unknown>)
                ?.full_name as string) || "Unknown",
            email:
              ((convData.profiles as Record<string, unknown>)
                ?.email as string) || "",
          },
          vendor: {
            id: convData.vendor_id as string,
            name:
              ((convData.vendors as Record<string, unknown>)
                ?.business_name as string) || "Unknown",
          },
        };

        // Transform messages
        const transformedMessages: Message[] =
          messagesData?.map((msg: Record<string, unknown>) => ({
            id: msg.id as string,
            content: msg.content as string,
            senderId: msg.sender_id as string,
            senderType: msg.sender_id === user.id ? "customer" : "vendor",
            messageType:
              (msg.message_type as "image" | "text" | "file" | "mixed") ||
              "text",
            createdAt: msg.created_at as string,
            isRead: msg.is_read as boolean,
            attachments:
              (msg.message_attachments as Record<string, unknown>[])?.map(
                (att: Record<string, unknown>) => ({
                  id: att.id as string,
                  url: att.file_url as string,
                  fileName: att.file_name as string,
                  fileType: att.file_type as string,
                  fileSize: att.file_size as number,
                })
              ) || [],
          })) || [];

        setConversation(transformedConversation);
        setMessages(transformedMessages);
      } catch (err) {
        console.error("Error fetching conversation:", err);
        setError("Error al cargar la conversación");
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();

    // Set up real-time subscription for messages
    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          console.log("New message:", payload);
          // Add new message to the list
          const newMessage = payload.new as Record<string, unknown>;
          const transformedMessage: Message = {
            id: newMessage.id as string,
            content: newMessage.content as string,
            senderId: newMessage.sender_id as string,
            senderType:
              newMessage.sender_id === user.id ? "customer" : "vendor",
            messageType:
              (newMessage.message_type as
                | "image"
                | "text"
                | "file"
                | "mixed") || "text",
            createdAt: newMessage.created_at as string,
            isRead: newMessage.is_read as boolean,
            attachments: [],
          };

          setMessages((prev) => [...prev, transformedMessage]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          console.log("Message updated:", payload);
          // Update message in the list
          const updatedMessage = payload.new as Record<string, unknown>;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === updatedMessage.id
                ? { ...msg, isRead: updatedMessage.is_read as boolean }
                : msg
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user]);

  const markAsRead = async (messageId: string) => {
    if (!user) return;

    try {
      await supabase
        .from("messages")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("id", messageId)
        .eq("conversation_id", conversationId);
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  };

  const sendMessage = async (data: {
    content: string;
    attachments?: Array<{
      url: string;
      fileName: string;
      fileType: string;
      fileSize: number;
    }>;
  }) => {
    if (!conversationId || !user) return;

    try {
      const { data: message, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: data.content,
          message_type: "text",
        })
        .select()
        .single();

      if (error) throw error;

      // Handle attachments if any
      if (data.attachments && data.attachments.length > 0) {
        const attachmentInserts = data.attachments.map((att) => ({
          message_id: message.id,
          file_url: att.url,
          file_name: att.fileName,
          file_type: att.fileType,
          file_size: att.fileSize,
        }));

        await supabase.from("message_attachments").insert(attachmentInserts);
      }

      return message;
    } catch (err) {
      console.error("Error sending message:", err);
      throw err;
    }
  };

  return {
    conversation,
    messages,
    loading,
    error,
    markAsRead,
    sendMessage,
  };
}
