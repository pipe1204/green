import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * POST /api/vendor/inquiries/[id]/email
 * Send email to customer through platform
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
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get inquiry details
    const { data: inquiry, error: inquiryError } = await supabase
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
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    // Handle both guest and registered users
    const isGuest = inquiry.is_guest;
    const customerEmail = isGuest
      ? inquiry.guest_email
      : inquiry.profiles?.email;

    // Send email notification based on customer type
    try {
      if (isGuest) {
        // For GUEST users: Send email with vendor's message and link to create account
        const { sendCustomerVendorReplyEmail } = await import(
          "@/lib/email-service"
        );

        await sendCustomerVendorReplyEmail({
          recipientEmail: customerEmail!,
          recipientName: inquiry.guest_name || "Cliente",
          vendorName: vendor.business_name,
          vehicleName: inquiry.vehicles?.name || "el vehículo",
          vehicleBrand: inquiry.vehicles?.brand || "",
          vendorMessage: message,
          platformUrl:
            process.env.NEXT_PUBLIC_APP_URL || "https://green-ev.vercel.app/",
          loginUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://green-ev.vercel.app/"}`,
        });
      } else {
        // For REGISTERED users: Send notification to check their messages
        const { sendNewMessageNotificationEmail } = await import(
          "@/lib/email-service"
        );

        await sendNewMessageNotificationEmail({
          recipientEmail: customerEmail!,
          recipientName: inquiry.profiles?.full_name || "Cliente",
          senderName: vendor.business_name,
          messagePreview:
            message.length > 100 ? message.substring(0, 100) : message,
          conversationId: inquiryId, // Using inquiry ID as reference
          dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://green-ev.vercel.app/"}`,
          recipientType: "customer",
        });
      }

      console.log("Email sent successfully:", {
        to: customerEmail,
        vendor: vendor.business_name,
        isGuest: isGuest,
      });
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error("Error sending email to customer:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: isGuest
        ? "Email sent successfully"
        : "Notification sent successfully",
      emailDetails: {
        to: customerEmail,
        subject: `Respuesta sobre ${inquiry.vehicles?.name}`,
        vendor: vendor.business_name,
        isGuest: isGuest,
      },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
