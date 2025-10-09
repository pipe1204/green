import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

// Type for vendor data from query
type VendorWithProfile = {
  business_name: string;
  profiles: {
    full_name: string;
    email: string;
  };
};

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

/**
 * POST /api/customer/test-drives
 * Create a new test drive booking (supports both authenticated and guest users)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      vehicleId,
      name,
      email,
      phone,
      preferredDate,
      preferredTime,
      message,
    } = body;

    // Validate required fields
    if (
      !vehicleId ||
      !name ||
      !email ||
      !phone ||
      !preferredDate ||
      !preferredTime
    ) {
      return NextResponse.json(
        { error: "All fields except message are required" },
        { status: 400 }
      );
    }

    // Get authenticated user (optional - supports guest users)
    const authHeader = request.headers.get("authorization");
    let userId: string | null = null;

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const {
        data: { user },
      } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Use service role client
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get vehicle and vendor information
    const { data: vehicle, error: vehicleError } = await serviceSupabase
      .from("vehicles")
      .select(
        `
        id,
        name,
        brand,
        vendor_id,
        vendors!inner(
          business_name,
          profiles!vendors_user_id_fkey(full_name, email)
        )
      `
      )
      .eq("id", vehicleId)
      .single();

    if (vehicleError || !vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    // Create test drive booking
    const { data: booking, error: insertError } = await serviceSupabase
      .from("test_drive_bookings")
      .insert({
        vehicle_id: vehicleId,
        customer_id: userId,
        vendor_id: vehicle.vendor_id,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        message: message || null,
        status: "pending",
        vendor_response: "pending",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating test drive booking:", insertError);
      return NextResponse.json(
        { error: "Error creating test drive booking" },
        { status: 500 }
      );
    }

    // Send email notification to vendor
    try {
      const { sendVendorTestBookingEmail } = await import(
        "@/lib/email-service"
      );

      const vendorData = vehicle.vendors as unknown as VendorWithProfile;
      const vendorProfile = vendorData?.profiles;
      const vendorEmail = vendorProfile?.email;
      const vendorName =
        vendorProfile?.full_name || vendorData?.business_name || "Vendedor";

      if (vendorEmail) {
        await sendVendorTestBookingEmail({
          recipientEmail: vendorEmail,
          recipientName: vendorName,
          customerName: name,
          vehicleName: vehicle.name,
          vehicleBrand: vehicle.brand,
          preferredDate,
          preferredTime,
          message: message || undefined,
          dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://green.co"}/dashboard?section=inquiries`,
        });
      }
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error("Error sending vendor test booking email:", emailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Test drive booking created successfully",
        bookingId: booking.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing test drive booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
