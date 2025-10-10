import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

/**
 * POST /api/link-guest-inquiries
 * Link guest inquiries to a newly registered user
 */
export async function POST(request: NextRequest) {
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

    if (!user.email) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    // Use service role client to bypass RLS for guest inquiries
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Find all guest inquiries with matching email
    const { data: guestInquiries, error: fetchError } = await serviceSupabase
      .from("customer_inquiries")
      .select("id, guest_name, guest_email, message, created_at, is_guest")
      .eq("guest_email", user.email)
      .eq("is_guest", true);

    if (fetchError) {
      console.error("Error fetching guest inquiries:", fetchError);
      return NextResponse.json(
        { success: false, linkedCount: 0, error: fetchError.message },
        { status: 500 }
      );
    }

    if (!guestInquiries || guestInquiries.length === 0) {
      return NextResponse.json({ success: true, linkedCount: 0 });
    }

    // Update the inquiries to link them to the user and mark as converted
    const { error: updateError } = await serviceSupabase
      .from("customer_inquiries")
      .update({
        customer_id: user.id,
        is_guest: false,
        status: "converted", // Mark as converted since we'll create conversations
        // Keep guest info for reference but mark as linked
        guest_name: null,
        guest_email: null,
        guest_phone: null,
      })
      .eq("guest_email", user.email)
      .eq("is_guest", true);

    if (updateError) {
      console.error("Error linking guest inquiries:", updateError);
      return NextResponse.json(
        { success: false, linkedCount: 0, error: updateError.message },
        { status: 500 }
      );
    }

    // Get unique vendors to notify about the customer registration
    const uniqueVendors = new Map();

    // Create conversations for each linked inquiry
    let conversationsCreated = 0;
    for (const inquiry of guestInquiries) {
      try {
        // Get full inquiry details including vehicle and vendor info
        const { data: fullInquiry } = await serviceSupabase
          .from("customer_inquiries")
          .select(
            `
            id,
            vehicle_id,
            vendor_id,
            message,
            vehicles(name, brand),
            vendors(business_name, user_id)
          `
          )
          .eq("id", inquiry.id)
          .single();

        if (!fullInquiry) continue;

        // Check if conversation already exists
        const { data: existingConversation } = await serviceSupabase
          .from("conversations")
          .select("id")
          .eq("vehicle_id", fullInquiry.vehicle_id)
          .eq("customer_id", user.id)
          .eq("vendor_id", fullInquiry.vendor_id)
          .single();

        if (existingConversation) {
          console.log(`Conversation already exists for inquiry ${inquiry.id}`);
          continue;
        }

        // Create the conversation
        const vehiclesData = fullInquiry.vehicles as Array<{
          name: string;
          brand: string;
        }> | null;
        const vehicleData = vehiclesData?.[0] || null;
        const vehicleName = vehicleData?.name || "";
        const vehicleBrand = vehicleData?.brand || "";
        const vehicleDisplay =
          [vehicleBrand, vehicleName].filter(Boolean).join(" ") || "Vehículo";

        const { data: conversation, error: conversationError } =
          await serviceSupabase
            .from("conversations")
            .insert({
              customer_id: user.id,
              vendor_id: fullInquiry.vendor_id,
              vehicle_id: fullInquiry.vehicle_id,
              subject: `Consulta sobre ${vehicleDisplay}`,
              last_message_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (conversationError) {
          console.error(
            `Error creating conversation for inquiry ${inquiry.id}:`,
            conversationError
          );
          continue;
        }

        // Create the initial message from the customer (their original inquiry)
        const { error: messageError } = await serviceSupabase
          .from("messages")
          .insert({
            conversation_id: conversation.id,
            sender_id: user.id,
            sender_type: "customer",
            content: fullInquiry.message,
            message_type: "text",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (messageError) {
          console.error(
            `Error creating initial message for conversation ${conversation.id}:`,
            messageError
          );
          continue;
        }

        // Store vendor info for notification (avoid duplicates)
        const vendorsData = fullInquiry.vendors as Array<{
          business_name: string;
          user_id: string;
        }> | null;
        const vendorData = vendorsData?.[0] || null;

        if (vendorData && !uniqueVendors.has(vendorData.user_id)) {
          uniqueVendors.set(vendorData.user_id, {
            business_name: vendorData.business_name,
            user_id: vendorData.user_id,
          });
        }

        // Note: Email notifications for conversations have been removed
        // Users should check the dashboard for new messages

        conversationsCreated++;
        console.log(
          `Created conversation ${conversation.id} for inquiry ${inquiry.id}`
        );
      } catch (error) {
        console.error(`Error processing inquiry ${inquiry.id}:`, error);
      }
    }

    // Send email notifications to vendors about the customer registration
    if (uniqueVendors.size > 0) {
      try {
        const { sendCustomerAccountCreatedEmail } = await import(
          "@/lib/email-service"
        );

        for (const [vendorUserId, vendorInfo] of uniqueVendors) {
          // Get vendor's profile for email
          const { data: vendorProfile } = await serviceSupabase
            .from("profiles")
            .select("full_name, email")
            .eq("id", vendorUserId)
            .single();

          if (vendorProfile?.email) {
            await sendCustomerAccountCreatedEmail({
              recipientEmail: vendorProfile.email,
              recipientName:
                vendorProfile.full_name || vendorInfo.business_name,
              customerName: user.user_metadata?.full_name || "Cliente",
              inquiryCount: guestInquiries.length,
              dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://green.co"}/dashboard?section=messages`,
            });

            console.log(
              `Sent account creation notification to vendor ${vendorInfo.business_name}`
            );
          }
        }
      } catch (emailError) {
        console.error("Error sending vendor notifications:", emailError);
        // Don't fail the request, just log the error
      }
    }

    return NextResponse.json({
      success: true,
      linkedCount: guestInquiries.length,
      conversationsCreated,
    });
  } catch (error) {
    console.error("Unexpected error in link-guest-inquiries API:", error);
    return NextResponse.json(
      {
        success: false,
        linkedCount: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
