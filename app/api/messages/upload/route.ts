import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { uploadMessageAttachment } from "@/lib/message-storage";
import { DatabaseAttachment, DatabaseMessageAccess } from "@/types/messaging";

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
 * POST /api/messages/upload
 * Upload a file for message attachment
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

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload file using our utility function
    const uploadResult = await uploadMessageAttachment(file, user.id);

    return NextResponse.json({
      success: true,
      file: uploadResult,
    });
  } catch (error) {
    console.error("Error uploading file:", error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("File size exceeds")) {
        return NextResponse.json(
          { error: "File size exceeds 10MB limit" },
          { status: 413 }
        );
      }
      if (error.message.includes("File type")) {
        return NextResponse.json(
          { error: "File type not allowed" },
          { status: 415 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/messages/upload
 * Delete an uploaded file
 */
export async function DELETE(request: NextRequest) {
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

    const body = await request.json();
    const { fileUrl } = body;

    if (!fileUrl) {
      return NextResponse.json(
        { error: "File URL is required" },
        { status: 400 }
      );
    }

    // Check if file is associated with any messages
    const { data: attachments } = (await supabaseClient
      .from("message_attachments")
      .select("id, message_id")
      .eq("file_url", fileUrl)) as { data: DatabaseAttachment[] | null };

    if (attachments && attachments.length > 0) {
      // Check if any of these messages belong to the user
      const messageIds = attachments.map((att) => att.message_id);
      const { data: messages } = (await supabaseClient
        .from("messages")
        .select("id, sender_id")
        .in("id", messageIds)) as { data: DatabaseMessageAccess[] | null };

      const userMessages =
        messages?.filter((msg) => msg.sender_id === user.id) || [];

      if (userMessages.length === 0) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
    }

    // Delete file from storage
    const { deleteMessageAttachment } = await import("@/lib/message-storage");
    await deleteMessageAttachment(fileUrl);

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
