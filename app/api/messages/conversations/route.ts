import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  DatabaseConversation,
  DatabaseMessage,
  CreateConversationRequest,
} from "@/types/messaging";

// Helper function to create authenticated Supabase client
function createAuthenticatedClient(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Missing or invalid authorization header");
  }

  const token = authHeader.replace("Bearer ", "");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );
}

/**
 * GET /api/messages/conversations
 * Get all conversations for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const supabaseClient = createAuthenticatedClient(request);

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's role to determine which conversations to fetch
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    let conversations;

    if (profile?.role === "vendor") {
      // Get vendor's conversations
      const { data: vendor } = await supabaseClient
        .from("vendors")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!vendor) {
        return NextResponse.json(
          { error: "Vendor profile not found" },
          { status: 404 }
        );
      }

      const { data, error } = await supabaseClient
        .from("conversations")
        .select(
          `
          *,
          profiles!conversations_customer_id_fkey(full_name, email),
          vehicles(name, brand, images),
          messages!inner(
            id,
            content,
            created_at,
            sender_type,
            sender_id
          )
        `
        )
        .eq("vendor_id", vendor.id)
        .order("last_message_at", { ascending: false });

      if (error) throw error;
      conversations = data;
    } else {
      // Get customer's conversations
      const { data, error } = await supabaseClient
        .from("conversations")
        .select(
          `
          *,
          vendors!conversations_vendor_id_fkey(business_name),
          vehicles(name, brand, images),
          messages!inner(
            id,
            content,
            created_at,
            sender_type,
            sender_id
          )
        `
        )
        .eq("customer_id", user.id)
        .order("last_message_at", { ascending: false });

      if (error) throw error;
      conversations = data;
    }

    // Transform data to include unread count and last message
    const transformedConversations =
      conversations?.map((conv: DatabaseConversation) => {
        const messages = conv.messages || [];
        const lastMessage = messages[messages.length - 1];

        // Count unread messages (messages not sent by current user)
        const unreadCount = messages.filter(
          (msg: DatabaseMessage) => msg.sender_id !== user.id && !msg.is_read
        ).length;

        return {
          id: conv.id,
          subject: conv.subject,
          status: conv.status,
          lastMessageAt: conv.last_message_at,
          createdAt: conv.created_at,
          updatedAt: conv.updated_at,
          unreadCount,
          lastMessage: lastMessage
            ? {
                id: lastMessage.id,
                content: lastMessage.content,
                createdAt: lastMessage.created_at,
                senderType: lastMessage.sender_type,
              }
            : null,
          vehicle: {
            id: conv.vehicle_id,
            name: conv.vehicles?.name,
            brand: conv.vehicles?.brand,
            images: conv.vehicles?.images,
          },
          participant:
            profile?.role === "vendor"
              ? {
                  name: conv.profiles?.full_name,
                  email: conv.profiles?.email,
                }
              : {
                  name: conv.vendors?.business_name,
                },
        };
      }) || [];

    return NextResponse.json({ conversations: transformedConversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/messages/conversations
 * Create a new conversation
 */
export async function POST(request: NextRequest) {
  try {
    const supabaseClient = createAuthenticatedClient(request);

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as CreateConversationRequest;
    const { vehicleId, vendorId, subject, initialMessage } = body;

    // Validate required fields
    if (!vehicleId || !vendorId || !subject || !initialMessage) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if conversation already exists
    const { data: existingConv } = await supabaseClient
      .from("conversations")
      .select("id")
      .eq("customer_id", user.id)
      .eq("vendor_id", vendorId)
      .eq("vehicle_id", vehicleId)
      .single();

    if (existingConv) {
      return NextResponse.json(
        { error: "Conversation already exists for this vehicle" },
        { status: 409 }
      );
    }

    // Create conversation
    const { data: conversation, error: convError } = await supabaseClient
      .from("conversations")
      .insert({
        customer_id: user.id,
        vendor_id: vendorId,
        vehicle_id: vehicleId,
        subject,
      })
      .select()
      .single();

    if (convError) throw convError;

    // Create initial message
    const { data: message, error: msgError } = await supabaseClient
      .from("messages")
      .insert({
        conversation_id: conversation.id,
        sender_id: user.id,
        sender_type: "customer",
        content: initialMessage,
        message_type: "text",
      })
      .select()
      .single();

    if (msgError) throw msgError;

    // Update conversation's last_message_at
    await supabaseClient
      .from("conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", conversation.id);

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        subject: conversation.subject,
        status: conversation.status,
        createdAt: conversation.created_at,
      },
      message: {
        id: message.id,
        content: message.content,
        createdAt: message.created_at,
      },
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
