import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

/**
 * POST /api/vendor/inquiries/[id]/conversation
 * Convert an inquiry to a conversation
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get user from auth header
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized - No auth token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    // Get vendor record for this user
    const { data: vendor, error: vendorError } = await supabase
      .from("vendors")
      .select("id, business_name")
      .eq("user_id", user.id)
      .single();

    if (vendorError || !vendor) {
      return NextResponse.json(
        { error: "Vendor profile not found" },
        { status: 404 }
      );
    }

    const { id: inquiryId } = await params;
    const body = await request.json();
    const { initialMessage } = body;

    if (!initialMessage) {
      return NextResponse.json(
        { error: "Initial message is required" },
        { status: 400 }
      );
    }

    // Use service role client to bypass RLS (like in inquiries API)
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: inquiry, error: inquiryError } = await serviceSupabase
      .from("customer_inquiries")
      .select(
        `
        *,
        vehicles(name, brand),
        profiles!customer_inquiries_customer_id_fkey(full_name, email)
      `
      )
      .eq("id", inquiryId)
      .eq("vendor_id", vendor.id)
      .single();

    if (inquiryError || !inquiry) {
      console.error("Inquiry not found - Error:", inquiryError);
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    // Check if conversation already exists for this inquiry
    const { data: existingConversation } = await serviceSupabase
      .from("conversations")
      .select("id")
      .eq("vehicle_id", inquiry.vehicle_id)
      .eq("customer_id", inquiry.customer_id)
      .eq("vendor_id", inquiry.vendor_id)
      .single();

    if (existingConversation) {
      return NextResponse.json(
        {
          error: "Conversation already exists for this inquiry",
          conversationId: existingConversation.id,
        },
        { status: 409 }
      );
    }

    // Create the conversation
    const vehicleName = inquiry.vehicles?.name || "";
    const vehicleBrand = inquiry.vehicles?.brand || "";
    const vehicleDisplay =
      [vehicleBrand, vehicleName].filter(Boolean).join(" ") || "Vehículo";
    const { data: conversation, error: conversationError } =
      await serviceSupabase
        .from("conversations")
        .insert({
          customer_id: inquiry.customer_id,
          vendor_id: inquiry.vendor_id,
          vehicle_id: inquiry.vehicle_id,
          subject: `Consulta sobre ${vehicleDisplay}`,
          last_message_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (conversationError) {
      throw conversationError;
    }

    // Create the initial message from the vendor
    const { data: message, error: messageError } = await serviceSupabase
      .from("messages")
      .insert({
        conversation_id: conversation.id,
        sender_id: user.id,
        sender_type: "vendor",
        content: initialMessage,
        is_read: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (messageError) {
      // If message creation fails, clean up the conversation
      await serviceSupabase
        .from("conversations")
        .delete()
        .eq("id", conversation.id);

      throw messageError;
    }

    // Update the inquiry status to "converted"
    const { error: updateError } = await serviceSupabase
      .from("customer_inquiries")
      .update({
        status: "converted",
        updated_at: new Date().toISOString(),
      })
      .eq("id", inquiryId);

    if (updateError) {
      console.error("Error updating inquiry status:", updateError);
      // Don't fail the request, just log the error
    }

    // Send email notification to customer (registered user)
    try {
      const { sendNewMessageNotificationEmail } = await import(
        "@/lib/email-service"
      );

      const customerEmail = inquiry.profiles?.email;
      const customerName = inquiry.profiles?.full_name;

      if (customerEmail) {
        const messagePreview =
          initialMessage.length > 100
            ? initialMessage.substring(0, 100)
            : initialMessage;

        await sendNewMessageNotificationEmail({
          recipientEmail: customerEmail,
          recipientName: customerName || "Cliente",
          senderName: vendor.business_name || "El vendedor",
          messagePreview,
          conversationId: conversation.id,
          dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://green.co"}/dashboard?section=inquiries`,
          recipientType: "customer",
        });

        console.log("Conversation email notification sent to:", customerEmail);
      }
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error(
        "Error sending conversation notification email:",
        emailError
      );
    }

    return NextResponse.json({
      success: true,
      conversation: {
        id: conversation.id,
        customer_id: conversation.customer_id,
        vendor_id: conversation.vendor_id,
        vehicle_id: conversation.vehicle_id,
        subject: conversation.subject,
        last_message_at: conversation.last_message_at,
      },
      message: {
        id: message.id,
        content: message.content,
        sender_id: message.sender_id,
        created_at: message.created_at,
      },
    });
  } catch (error) {
    console.error("Error creating conversation from inquiry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
