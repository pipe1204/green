import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import {
  VendorRescheduleResponseRequest,
  VendorRescheduleResponseResponse,
} from "@/types";

/**
 * PATCH /api/vendor/test-drives/[id]/reschedule
 * Vendor responds to a customer's reschedule request (approve/reject)
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
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (vendorError || !vendor) {
      return NextResponse.json(
        { error: "Vendor profile not found" },
        { status: 404 }
      );
    }

    const { id: bookingId } = await params;
    const body: VendorRescheduleResponseRequest = await request.json();
    const { response, message } = body;

    // Validate request body
    if (!response || !["approved", "rejected"].includes(response)) {
      return NextResponse.json(
        { error: "Invalid response. Must be 'approved' or 'rejected'" },
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

    // First, check if the booking exists, belongs to this vendor, and has a reschedule request
    const { data: booking, error: bookingError } = await serviceSupabase
      .from("test_drive_bookings")
      .select("id, vendor_id, reschedule_status, status, vendor_response")
      .eq("id", bookingId)
      .eq("vendor_id", vendor.id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: "Test drive booking not found or access denied" },
        { status: 404 }
      );
    }

    // Check if there's a pending reschedule request
    if (booking.reschedule_status !== "requested") {
      return NextResponse.json(
        { error: "No pending reschedule request found for this booking" },
        { status: 400 }
      );
    }

    // Prepare update data based on vendor response
    const updateData = {
      vendor_message: message.trim(),
      vendor_response_date: new Date().toISOString(),
      vendor_responded_by: user.id,
      reschedule_status: response,
      updated_at: new Date().toISOString(),
      ...(response === "approved"
        ? {
            // Approve reschedule - keep the customer's new preferred date/time
            status: "confirmed" as const,
            vendor_response: "accepted" as const,
          }
        : {
            // Reject reschedule - customer can reschedule again if they want
            status: "reschedule_rejected" as const,
            vendor_response: "declined" as const,
          }),
    };

    // Update the booking with vendor response
    const { data: updatedBooking, error: updateError } = await serviceSupabase
      .from("test_drive_bookings")
      .update(updateData)
      .eq("id", bookingId)
      .eq("vendor_id", vendor.id)
      .select()
      .single();

    if (updateError) {
      console.error(
        "Error updating test drive booking for reschedule response:",
        updateError
      );
      return NextResponse.json(
        { error: "Error processing reschedule response" },
        { status: 500 }
      );
    }

    const responseData: VendorRescheduleResponseResponse = {
      success: true,
      booking: {
        id: updatedBooking.id,
        status: updatedBooking.status,
        vendorResponse: updatedBooking.vendor_response,
        vendorMessage: updatedBooking.vendor_message,
        vendorResponseDate: updatedBooking.vendor_response_date,
        rescheduleStatus: updatedBooking.reschedule_status,
      },
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error processing vendor reschedule response:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
