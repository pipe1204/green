import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

// Use service role client to bypass RLS
const serviceSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Type for vendor data from query
type VendorWithProfile = {
  business_name: string;
  profiles: {
    full_name: string;
    email: string;
  } | null;
};

/**
 * POST /api/customer/inquiries
 * Create a new customer inquiry (supports both authenticated and guest users)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vehicleId, name, email, phone, message } = body;

    // Validate required fields
    if (!vehicleId || !name || !email || !message) {
      return NextResponse.json(
        { error: "Vehicle ID, name, email, and message are required" },
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

    // Create inquiry
    const inquiryData = userId
      ? {
          // Authenticated user
          customer_id: userId,
          vehicle_id: vehicleId,
          vendor_id: vehicle.vendor_id,
          message: message.trim(),
          is_guest: false,
          status: "pending",
        }
      : {
          // Guest user
          customer_id: null,
          vehicle_id: vehicleId,
          vendor_id: vehicle.vendor_id,
          message: message.trim(),
          is_guest: true,
          guest_name: name,
          guest_email: email,
          guest_phone: phone || null,
          status: "pending",
        };

    const { data: inquiry, error: insertError } = await serviceSupabase
      .from("customer_inquiries")
      .insert(inquiryData)
      .select()
      .single();

    if (insertError) {
      console.error("Error creating inquiry:", insertError);
      return NextResponse.json(
        { error: "Error creating inquiry" },
        { status: 500 }
      );
    }

    // Send email notification to vendor
    try {
      const { sendVendorNewEnquiryEmail } = await import("@/lib/email-service");

      const vendorData = vehicle.vendors as unknown as VendorWithProfile;
      const vendorProfile = vendorData?.profiles;
      const vendorEmail = vendorProfile?.email;
      const vendorName =
        vendorProfile?.full_name || vendorData?.business_name || "Vendedor";

      if (vendorEmail) {
        await sendVendorNewEnquiryEmail({
          recipientEmail: vendorEmail,
          recipientName: vendorName,
          customerName: name,
          vehicleName: vehicle.name,
          vehicleBrand: vehicle.brand,
          message: message.trim(),
          dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://green.co"}/dashboard?section=inquiries`,
          isGuest: !userId,
        });
      }
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error("Error sending vendor inquiry email:", emailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Inquiry created successfully",
        inquiryId: inquiry.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing inquiry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
