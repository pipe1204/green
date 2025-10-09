import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

/**
 * PATCH /api/vendor/test-drives/[id]/respond
 * Accept or decline a test drive booking with a message
 */
export async function PATCH(
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

    const { id: bookingId } = await params;
    const body = await request.json();
    const { response, message } = body;

    // Validate request body
    if (!response || !["accepted", "declined"].includes(response)) {
      return NextResponse.json(
        { error: "Invalid response. Must be 'accepted' or 'declined'" },
        { status: 400 }
      );
    }

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Use service role client to bypass RLS
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // First, check if the booking exists and belongs to this vendor
    const { data: booking, error: bookingError } = await serviceSupabase
      .from("test_drive_bookings")
      .select("id, vendor_id, vendor_response")
      .eq("id", bookingId)
      .eq("vendor_id", vendor.id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: "Test drive booking not found or access denied" },
        { status: 404 }
      );
    }

    // Check if already responded
    if (booking.vendor_response !== "pending") {
      return NextResponse.json(
        { error: "Test drive booking has already been responded to" },
        { status: 409 }
      );
    }

    // Update the booking with vendor response
    const { data: updatedBooking, error: updateError } = await serviceSupabase
      .from("test_drive_bookings")
      .update({
        vendor_response: response,
        vendor_message: message.trim(),
        vendor_response_date: new Date().toISOString(),
        vendor_responded_by: user.id,
        status: response === "accepted" ? "confirmed" : "declined",
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .eq("vendor_id", vendor.id)
      .select(
        `
        *,
        vehicles(name, brand),
        profiles!test_drive_bookings_customer_id_fkey(full_name, email)
      `
      )
      .single();

    if (updateError) {
      console.error("Error updating test drive booking:", updateError);
      return NextResponse.json(
        { error: "Error updating test drive booking" },
        { status: 500 }
      );
    }

    // Send email notification to customer
    try {
      const { sendCustomerTestStatusEmail } = await import(
        "@/lib/email-service"
      );

      const customerEmail =
        updatedBooking.profiles?.email || updatedBooking.customer_email;
      const customerName =
        updatedBooking.profiles?.full_name || updatedBooking.customer_name;

      if (customerEmail) {
        await sendCustomerTestStatusEmail({
          recipientEmail: customerEmail,
          recipientName: customerName,
          vendorName: vendor.business_name || "El vendedor",
          vehicleName: updatedBooking.vehicles?.name || "el vehículo",
          vehicleBrand: updatedBooking.vehicles?.brand || "",
          status: response,
          vendorMessage: message.trim(),
          preferredDate: updatedBooking.preferred_date,
          preferredTime: updatedBooking.preferred_time,
          dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://green.co"}/dashboard?section=testDrives`,
        });
      }
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error("Error sending test status email:", emailError);
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: updatedBooking.id,
        vendorResponse: updatedBooking.vendor_response,
        vendorMessage: updatedBooking.vendor_message,
        vendorResponseDate: updatedBooking.vendor_response_date,
      },
    });
  } catch (error) {
    console.error("Error responding to test drive booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
