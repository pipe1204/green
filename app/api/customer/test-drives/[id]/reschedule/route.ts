import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import { RescheduleRequest, RescheduleResponse } from "@/types";

/**
 * POST /api/customer/test-drives/[id]/reschedule
 * Customer requests to reschedule a test drive booking
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

    const { id: bookingId } = await params;
    const body: RescheduleRequest = await request.json();
    const { newDate, newTime, reason } = body;

    // Validate request body
    if (!newDate || !newTime || !reason || reason.trim().length === 0) {
      return NextResponse.json(
        { error: "New date, time, and reason are required" },
        { status: 400 }
      );
    }

    // Use service role client to bypass RLS
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // First, check if the booking exists and belongs to this customer
    const { data: booking, error: bookingError } = await serviceSupabase
      .from("test_drive_bookings")
      .select(
        "id, customer_id, status, vendor_response, reschedule_count, preferred_date, preferred_time, original_preferred_date, original_preferred_time"
      )
      .eq("id", bookingId)
      .eq("customer_id", user.id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: "Test drive booking not found or access denied" },
        { status: 404 }
      );
    }

    // Business logic validation
    const canReschedule =
      // Must have vendor response (not pending)
      booking.vendor_response !== "pending" &&
      // Cannot be completed or cancelled
      !["completed", "cancelled"].includes(booking.status) &&
      // Cannot exceed reschedule limit
      (booking.reschedule_count || 0) < 2;

    if (!canReschedule) {
      let errorMessage = "Cannot reschedule this test drive";
      if (booking.vendor_response === "pending") {
        errorMessage = "Cannot reschedule - waiting for vendor response";
      } else if (["completed", "cancelled"].includes(booking.status)) {
        errorMessage = "Cannot reschedule completed or cancelled test drives";
      } else if ((booking.reschedule_count || 0) >= 2) {
        errorMessage = "Maximum reschedule limit (2) reached";
      }

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Update the booking with reschedule request
    const { data: updatedBooking, error: updateError } = await serviceSupabase
      .from("test_drive_bookings")
      .update({
        // Preserve original date/time if this is the first reschedule
        original_preferred_date:
          booking.original_preferred_date || booking.preferred_date,
        original_preferred_time:
          booking.original_preferred_time || booking.preferred_time,
        // Update preferred date/time to new values
        preferred_date: newDate,
        preferred_time: newTime,
        // Set reschedule fields
        reschedule_reason: reason.trim(),
        reschedule_requested_by: user.id,
        reschedule_requested_at: new Date().toISOString(),
        reschedule_status: "requested",
        reschedule_count: (booking.reschedule_count || 0) + 1,
        // Reset vendor response to pending since they need to respond again
        vendor_response: "pending",
        vendor_message: null,
        vendor_response_date: null,
        vendor_responded_by: null,
        // Update status
        status: "reschedule_requested",
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .eq("customer_id", user.id)
      .select(
        `
        *,
        vehicles(name, brand),
        vendors(business_name, profiles!vendors_user_id_fkey(full_name, email))
      `
      )
      .single();

    if (updateError) {
      console.error(
        "Error updating test drive booking for reschedule:",
        updateError
      );
      return NextResponse.json(
        { error: "Error processing reschedule request" },
        { status: 500 }
      );
    }

    // Send email notification to vendor
    try {
      const { sendVendorTestRescheduleEmail } = await import(
        "@/lib/email-service"
      );

      const vendorEmail = updatedBooking.vendors?.profiles?.email;
      const vendorName =
        updatedBooking.vendors?.profiles?.full_name ||
        updatedBooking.vendors?.business_name ||
        "Vendedor";

      if (vendorEmail) {
        await sendVendorTestRescheduleEmail({
          recipientEmail: vendorEmail,
          recipientName: vendorName,
          customerName: updatedBooking.customer_name,
          vehicleName: updatedBooking.vehicles?.name || "el vehículo",
          vehicleBrand: updatedBooking.vehicles?.brand || "",
          oldDate: booking.preferred_date,
          oldTime: booking.preferred_time,
          newDate: newDate,
          newTime: newTime,
          reason: reason.trim(),
          dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://green-ev.vercel.app/"}`,
        });
      }
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error("Error sending reschedule email:", emailError);
    }

    const response: RescheduleResponse = {
      success: true,
      booking: {
        id: updatedBooking.id,
        rescheduleStatus: "requested",
        rescheduleCount: updatedBooking.reschedule_count,
        rescheduleReason: updatedBooking.reschedule_reason,
        rescheduleRequestedAt: updatedBooking.reschedule_requested_at,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error processing reschedule request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
