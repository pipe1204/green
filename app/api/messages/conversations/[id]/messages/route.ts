import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  DatabaseMessageDetails,
  SendMessageRequest,
  DatabaseConversationAccess,
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
 * POST /api/messages/conversations/[id]/messages
 * Send a message in a conversation
 */
export async function POST(
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
    const body = (await request.json()) as SendMessageRequest;
    const { content, messageType = "text", attachments = [] } = body;

    // Validate required fields
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    // Check if conversation exists and user has access
    const { data: conversation, error: convError } = (await supabaseClient
      .from("conversations")
      .select(
        `
        id,
        customer_id,
        vendor_id,
        status,
        vendors(user_id)
      `
      )
      .eq("id", conversationId)
      .single()) as { data: DatabaseConversationAccess | null; error: unknown };

    if (convError || !conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Check if conversation is still open
    if (conversation.status === "closed") {
      return NextResponse.json(
        { error: "Cannot send messages to closed conversation" },
        { status: 400 }
      );
    }

    // Check if user has access to this conversation
    const isCustomer = conversation.customer_id === user.id;
    const isVendor = conversation.vendors?.user_id === user.id;

    if (!isCustomer && !isVendor) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Determine sender type
    const senderType = isCustomer ? "customer" : "vendor";

    // Create message
    const { data: message, error: msgError } = await supabaseClient
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        sender_type: senderType,
        content: content.trim(),
        message_type: messageType,
      })
      .select()
      .single();

    if (msgError) throw msgError;

    // Handle attachments if provided
    if (attachments.length > 0) {
      const attachmentData = attachments.map((att) => ({
        message_id: message.id,
        file_url: att.url,
        file_name: att.fileName,
        file_type: att.fileType,
        file_size: att.fileSize,
      }));

      const { error: attError } = await supabaseClient
        .from("message_attachments")
        .insert(attachmentData);

      if (attError) {
        console.error("Error inserting attachments:", attError);
        // Don't fail the message if attachments fail, just log the error
      }
    }

    // Update conversation's last_message_at
    await supabaseClient
      .from("conversations")
      .update({
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", conversationId);

    // Get the complete message with attachments
    const { data: completeMessage, error: completeError } =
      (await supabaseClient
        .from("messages")
        .select(
          `
        *,
        message_attachments(file_url, file_name, file_type, file_size)
      `
        )
        .eq("id", message.id)
        .single()) as { data: DatabaseMessageDetails | null; error: unknown };

    if (completeError || !completeMessage)
      throw completeError || new Error("Message not found");

    // Transform message data
    const transformedMessage = {
      id: completeMessage.id,
      content: completeMessage.content,
      senderId: completeMessage.sender_id,
      senderType: completeMessage.sender_type,
      messageType: completeMessage.message_type,
      isRead: completeMessage.is_read,
      readAt: completeMessage.read_at,
      createdAt: completeMessage.created_at,
      attachments:
        completeMessage.message_attachments?.map((att) => ({
          id: att.id,
          url: att.file_url,
          fileName: att.file_name,
          fileType: att.file_type,
          fileSize: att.file_size,
        })) || [],
    };

    return NextResponse.json({ message: transformedMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
