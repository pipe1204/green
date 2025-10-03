import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { UpdateMessageRequest, DatabaseMessageAccess } from "@/types/messaging";

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
 * PUT /api/messages/messages/[id]
 * Update message (mark as read, edit content)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id: messageId } = await params;
    const body = (await request.json()) as UpdateMessageRequest;
    const { isRead, content } = body;

    // Get message and check access
    const { data: message, error: msgError } = (await supabaseClient
      .from("messages")
      .select(
        `
        id,
        sender_id,
        conversation_id,
        conversations!inner(customer_id, vendors(user_id))
      `
      )
      .eq("id", messageId)
      .single()) as { data: DatabaseMessageAccess | null; error: unknown };

    if (msgError || !message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Check if user has access to this message
    const isCustomer = message.conversations?.customer_id === user.id;
    const isVendor = message.conversations?.vendors?.user_id === user.id;

    if (!isCustomer && !isVendor) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Prepare update data
    const updateData: {
      updated_at: string;
      is_read?: boolean;
      read_at?: string;
      content?: string;
    } = {
      updated_at: new Date().toISOString(),
    };

    // Handle marking as read (only recipient can mark as read)
    if (isRead !== undefined && message.sender_id !== user.id) {
      updateData.is_read = isRead;
      if (isRead) {
        updateData.read_at = new Date().toISOString();
      }
    }

    // Handle content editing (only sender can edit)
    if (content !== undefined && message.sender_id === user.id) {
      updateData.content = content.trim();
    }

    // Update message
    const { data: updatedMessage, error: updateError } = await supabaseClient
      .from("messages")
      .update(updateData)
      .eq("id", messageId)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({ message: updatedMessage });
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/messages/messages/[id]
 * Delete a message (only sender can delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id: messageId } = await params;

    // Get message and check if user is the sender
    const { data: message, error: msgError } = await supabaseClient
      .from("messages")
      .select("id, sender_id")
      .eq("id", messageId)
      .single();

    if (msgError || !message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Only sender can delete their message
    if (message.sender_id !== user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Delete message (this will cascade delete attachments due to foreign key)
    const { error: deleteError } = await supabaseClient
      .from("messages")
      .delete()
      .eq("id", messageId);

    if (deleteError) throw deleteError;

    return NextResponse.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  }
}
