import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  DatabaseConversationDetails,
  DatabaseMessageDetails,
  UpdateConversationRequest,
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
 * GET /api/messages/conversations/[id]
 * Get conversation details with messages
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const conversationId = params.id;

    // Get conversation with participants and vehicle info
    const { data: conversation, error: convError } = (await supabaseClient
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
      .single()) as {
      data: DatabaseConversationDetails | null;
      error: unknown;
    };

    if (convError || !conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this conversation
    const isCustomer = conversation.customer_id === user.id;
    const isVendor = conversation.vendors?.[0]?.user_id === user.id;

    if (!isCustomer && !isVendor) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get messages with pagination
    const { data: messages, error: msgError } = (await supabaseClient
      .from("messages")
      .select(
        `
        *,
        message_attachments(file_url, file_name, file_type, file_size)
      `
      )
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })) as {
      data: DatabaseMessageDetails[] | null;
      error: unknown;
    };

    if (msgError) throw msgError;

    // Mark messages as read if user is the recipient
    const unreadMessages =
      messages?.filter((msg) => msg.sender_id !== user.id && !msg.is_read) ||
      [];

    if (unreadMessages.length > 0) {
      const messageIds = unreadMessages.map((msg) => msg.id);
      await supabaseClient
        .from("messages")
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .in("id", messageIds);
    }

    // Transform messages
    const transformedMessages =
      messages?.map((msg: DatabaseMessageDetails) => ({
        id: msg.id,
        content: msg.content,
        senderId: msg.sender_id,
        senderType: msg.sender_type,
        messageType: msg.message_type,
        isRead: msg.is_read,
        readAt: msg.read_at,
        createdAt: msg.created_at,
        attachments:
          msg.message_attachments?.map((att) => ({
            id: att.id,
            url: att.file_url,
            fileName: att.file_name,
            fileType: att.file_type,
            fileSize: att.file_size,
          })) || [],
      })) || [];

    // Transform conversation data
    const transformedConversation = {
      id: conversation.id,
      subject: conversation.subject,
      status: conversation.status,
      createdAt: conversation.created_at,
      updatedAt: conversation.updated_at,
      lastMessageAt: conversation.last_message_at,
      vehicle: {
        id: conversation.vehicle_id,
        name: conversation.vehicles?.name,
        brand: conversation.vehicles?.brand,
        images: conversation.vehicles?.images,
        price: conversation.vehicles?.price,
      },
      customer: {
        id: conversation.customer_id,
        name: conversation.profiles?.full_name,
        email: conversation.profiles?.email,
      },
      vendor: {
        id: conversation.vendor_id,
        name: conversation.vendors?.[0]?.business_name,
      },
    };

    return NextResponse.json({
      conversation: transformedConversation,
      messages: transformedMessages,
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversation" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/messages/conversations/[id]
 * Update conversation (e.g., status, subject)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const conversationId = params.id;
    const body = (await request.json()) as UpdateConversationRequest;
    const { status, subject } = body;

    // Check if user has access to this conversation
    const { data: conversation } = await supabaseClient
      .from("conversations")
      .select("customer_id, vendors(user_id)")
      .eq("id", conversationId)
      .single();

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const isCustomer = conversation.customer_id === user.id;
    const isVendor = conversation.vendors?.[0]?.user_id === user.id;

    if (!isCustomer && !isVendor) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Update conversation
    const updateData: {
      status?: string;
      subject?: string;
      updated_at: string;
    } = {
      updated_at: new Date().toISOString(),
    };
    if (status !== undefined) updateData.status = status;
    if (subject !== undefined) updateData.subject = subject;

    const { data, error } = await supabaseClient
      .from("conversations")
      .update(updateData)
      .eq("id", conversationId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ conversation: data });
  } catch (error) {
    console.error("Error updating conversation:", error);
    return NextResponse.json(
      { error: "Failed to update conversation" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/messages/conversations/[id]
 * Delete conversation (soft delete by updating status)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const conversationId = params.id;

    // Check if user has access to this conversation
    const { data: conversation } = await supabaseClient
      .from("conversations")
      .select("customer_id, vendors(user_id)")
      .eq("id", conversationId)
      .single();

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const isCustomer = conversation.customer_id === user.id;
    const isVendor = conversation.vendors?.[0]?.user_id === user.id;

    if (!isCustomer && !isVendor) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Update conversation status to closed instead of hard delete
    const { error } = await supabaseClient
      .from("conversations")
      .update({
        status: "closed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", conversationId);

    if (error) throw error;

    return NextResponse.json({ message: "Conversation closed successfully" });
  } catch (error) {
    console.error("Error closing conversation:", error);
    return NextResponse.json(
      { error: "Failed to close conversation" },
      { status: 500 }
    );
  }
}
