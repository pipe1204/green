import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

/**
 * GET /api/customer/test-drives
 * Get all test drive bookings for the authenticated customer
 */
export async function GET(request: NextRequest) {
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

    // Use service role client to bypass RLS
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get test drive bookings for this customer
    const { data: bookings, error: bookingsError } = await serviceSupabase
      .from("test_drive_bookings")
      .select(
        `
        *,
        vehicles (
          id,
          name,
          brand,
          type,
          price,
          images,
          location
        ),
        vendors (
          id,
          business_name,
          profiles!vendors_user_id_fkey (
            id,
            full_name,
            email
          )
        )
      `
      )
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false });

    if (bookingsError) {
      console.error("Error fetching test drive bookings:", bookingsError);
      return NextResponse.json(
        { error: "Error fetching test drive bookings" },
        { status: 500 }
      );
    }

    // Transform data to include vehicle and vendor info
    const transformedBookings =
      bookings?.map((booking) => ({
        id: booking.id,
        vehicleId: booking.vehicle_id,
        customerId: booking.customer_id,
        vendorId: booking.vendor_id,
        customerName: booking.customer_name,
        customerEmail: booking.customer_email,
        customerPhone: booking.customer_phone,
        preferredDate: booking.preferred_date,
        preferredTime: booking.preferred_time,
        message: booking.message,
        status: booking.status,
        vendorResponse: booking.vendor_response,
        vendorMessage: booking.vendor_message,
        vendorResponseDate: booking.vendor_response_date,
        // Reschedule fields
        rescheduleCount: booking.reschedule_count,
        rescheduleReason: booking.reschedule_reason,
        rescheduleRequestedBy: booking.reschedule_requested_by,
        rescheduleRequestedAt: booking.reschedule_requested_at,
        rescheduleStatus: booking.reschedule_status,
        originalPreferredDate: booking.original_preferred_date,
        originalPreferredTime: booking.original_preferred_time,
        createdAt: booking.created_at,
        updatedAt: booking.updated_at,
        vehicle: booking.vehicles
          ? {
              id: booking.vehicles.id,
              name: booking.vehicles.name,
              brand: booking.vehicles.brand,
              type: booking.vehicles.type,
              price: booking.vehicles.price,
              images: booking.vehicles.images,
              location: booking.vehicles.location,
            }
          : null,
        vendor: booking.vendors
          ? {
              id: booking.vendors.id,
              businessName: booking.vendors.business_name,
              contact: booking.vendors.profiles
                ? {
                    id: booking.vendors.profiles.id,
                    name: booking.vendors.profiles.full_name,
                    email: booking.vendors.profiles.email,
                  }
                : null,
            }
          : null,
      })) || [];

    return NextResponse.json({
      bookings: transformedBookings,
      count: transformedBookings.length,
    });
  } catch (error) {
    console.error("Error fetching customer test drives:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
