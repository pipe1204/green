"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { Conversation } from "@/types/messaging";

export function useRealtimeConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // Initial fetch
    const fetchConversations = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("conversations")
          .select(
            `
            *,
            profiles!conversations_customer_id_fkey(full_name, email),
            vendors!conversations_vendor_id_fkey(business_name, user_id),
            vehicles(name, brand, images, price),
            messages!messages_conversation_id_fkey(
              id,
              content,
              created_at,
              is_read,
              sender_id
            )
          `
          )
          .or(`customer_id.eq.${user.id},vendors.user_id.eq.${user.id}`)
          .order("updated_at", { ascending: false });

        if (fetchError) throw fetchError;

        // Transform data to Conversation format
        const transformedConversations: Conversation[] =
          data?.map((conv: Record<string, unknown>) => ({
            id: conv.id as string,
            subject: conv.subject as string,
            status: conv.status as "open" | "closed" | "archived",
            participant: {
              name:
                ((conv.profiles as Record<string, unknown>)
                  ?.full_name as string) ||
                ((conv.vendors as Record<string, unknown>)
                  ?.business_name as string) ||
                "Unknown",
              email:
                ((conv.profiles as Record<string, unknown>)?.email as string) ||
                "",
            },
            vehicle: {
              id:
                ((conv.vehicles as Record<string, unknown>)?.id as string) ||
                "",
              name:
                ((conv.vehicles as Record<string, unknown>)?.name as string) ||
                "Unknown Vehicle",
              brand:
                ((conv.vehicles as Record<string, unknown>)?.brand as string) ||
                "Unknown Brand",
              images:
                ((conv.vehicles as Record<string, unknown>)?.images as Array<{
                  url: string;
                  alt: string;
                }>) || [],
              price: (conv.vehicles as Record<string, unknown>)
                ?.price as number,
            },
            lastMessageAt:
              ((conv.messages as Record<string, unknown>[])?.[0]
                ?.created_at as string) || (conv.updated_at as string),
            unreadCount:
              (conv.messages as Record<string, unknown>[])?.filter(
                (msg: Record<string, unknown>) =>
                  !msg.is_read && msg.sender_id !== user.id
              ).length || 0,
            createdAt: conv.created_at as string,
            updatedAt: conv.updated_at as string,
          })) || [];

        setConversations(transformedConversations);
      } catch (err) {
        console.error("Error fetching conversations:", err);
        setError("Error al cargar las conversaciones");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // Set up real-time subscription
    const channel = supabase
      .channel("conversations")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
          filter: `or(customer_id.eq.${user.id},vendor_id.in.(select id from vendors where user_id.eq.${user.id}))`,
        },
        (payload) => {
          console.log("Conversation change:", payload);
          // Refetch conversations when there are changes
          fetchConversations();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `conversation_id.in.(select id from conversations where or(customer_id.eq.${user.id},vendor_id.in.(select id from vendors where user_id.eq.${user.id})))`,
        },
        (payload) => {
          console.log("Message change:", payload);
          // Refetch conversations when messages change
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    conversations,
    loading,
    error,
    refetch: () => {
      // Trigger a refetch manually if needed
      if (user) {
        // This will trigger the useEffect
        setLoading(true);
      }
    },
  };
}
