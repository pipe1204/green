"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { Conversation } from "@/types/messaging";

export function useRealtimeConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define fetchConversations outside useEffect so it can be accessed by event handlers
  const fetchConversations = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // First, check if user is a vendor
      const { data: vendorData, error: vendorError } = await supabase
        .from("vendors")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle(); // Use maybeSingle() instead of single() to handle no results gracefully

      if (vendorError) {
        console.error("Error fetching vendor data:", vendorError);
        // Continue as customer if vendor fetch fails
      }

      // Build the query based on whether user is a vendor or customer
      let query;

      if (vendorData) {
        // User is a vendor, get conversations where they are the vendor
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
          .eq("vendor_id", vendorData.id)
          .order("updated_at", { ascending: false })
          .abortSignal(AbortSignal.timeout(5000));

        if (fetchError) throw fetchError;
        query = { data, error: null };
      } else {
        // User is a customer, get conversations where they are the customer
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
          .eq("customer_id", user.id)
          .order("updated_at", { ascending: false })
          .abortSignal(AbortSignal.timeout(5000));

        if (fetchError) throw fetchError;
        query = { data, error: null };
      }

      const { data, error: fetchError } = query;

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
              ((conv.vehicles as Record<string, unknown>)?.id as string) || "",
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
            price: (conv.vehicles as Record<string, unknown>)?.price as number,
          },
          lastMessageAt:
            ((conv.messages as Record<string, unknown>[])?.[0]
              ?.created_at as string) || (conv.updated_at as string),
          unreadCount:
            (conv.messages as Record<string, unknown>[])?.filter(
              (msg: Record<string, unknown>) =>
                msg.sender_id !== user?.id && !msg.is_read
            ).length || 0,
          createdAt: conv.created_at as string,
          updatedAt: conv.updated_at as string,
        })) || [];

      // Debug: Log the actual messages to see their read status
      if (data && data.length > 0) {
        if (data[0].messages) {
        }
      }
      setConversations(transformedConversations);
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError("Error al cargar las conversaciones");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    fetchConversations();

    // Set up real-time subscription
    let subscription: { unsubscribe: () => void } | null = null;

    const setupSubscription = async () => {
      // Get vendor_id for the current user to set up proper filters
      const { data: vendorData } = await supabase
        .from("vendors")
        .select("id")
        .eq("user_id", user.id)
        .single();

      const channel = supabase.channel("conversations");

      if (vendorData) {
        // User is a vendor - listen for conversations where they are the vendor
        channel.on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "conversations",
            filter: `vendor_id=eq.${vendorData.id}`,
          },
          (payload) => {
            console.log("Conversation change:", payload);
            fetchConversations();
          }
        );
      } else {
        // User is a customer - listen for conversations where they are the customer
        channel.on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "conversations",
            filter: `customer_id=eq.${user.id}`,
          },
          (payload) => {
            console.log("Conversation change:", payload);
            fetchConversations();
          }
        );
      }

      // Listen for message changes
      channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          // Add a small delay to ensure database changes are committed
          setTimeout(() => {
            fetchConversations();
          }, 100);
        }
      );

      subscription = channel.subscribe();
    };

    setupSubscription();

    // Note: Removed custom event listener - using real-time subscription instead

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [user, fetchConversations]);

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
