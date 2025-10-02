import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * POST /api/vendor/inquiries/[id]/email
 * Send email to customer through platform
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const inquiryId = params.id;
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
    const customerName = isGuest
      ? inquiry.guest_name
      : inquiry.profiles?.full_name;

    // TODO: Implement actual email sending
    // For now, we'll just log the email details
    console.log("Email to be sent:", {
      to: customerEmail,
      from: "Green Platform",
      subject: `Respuesta sobre ${inquiry.vehicles?.name}`,
      message: message,
      vendor: vendor.business_name,
      inquiryId: inquiryId,
      isGuest: isGuest,
    });

    // TODO: Send email using your email service (SendGrid, Resend, etc.)
    // For GUEST users:
    // 1. Come from "Green Platform"
    // 2. Include vendor's message
    // 3. Have a reply-to that goes back to your platform
    // 4. Include a link for customer to reply
    //
    // For REGISTERED users:
    // 1. Come from "Green Platform"
    // 2. Say "You have a new message on Green Platform"
    // 3. Include link to login and view message
    // 4. Don't include the actual message content

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
