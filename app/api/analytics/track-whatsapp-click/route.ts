import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * POST /api/analytics/track-whatsapp-click
 * Track WhatsApp button clicks for analytics
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vehicleId, vendorId } = body;

    if (!vehicleId || !vendorId) {
      return NextResponse.json(
        { error: "Vehicle ID and Vendor ID are required" },
        { status: 400 }
      );
    }

    // Use service role client to bypass RLS (allow guest tracking)
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Try to get authenticated user (may be null for guests)
    const authHeader = request.headers.get("authorization");
    let customerId: string | null = null;

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const {
        data: { user },
      } = await serviceSupabase.auth.getUser(token);
      customerId = user?.id || null;
    }

    // Get user agent and IP for analytics
    const userAgent = request.headers.get("user-agent");
    const forwarded = request.headers.get("x-forwarded-for");
    const ipAddress = forwarded
      ? forwarded.split(",")[0].trim()
      : request.headers.get("x-real-ip") || null;

    // Insert WhatsApp click record
    const { error: insertError } = await serviceSupabase
      .from("whatsapp_clicks")
      .insert({
        vehicle_id: vehicleId,
        vendor_id: vendorId,
        customer_id: customerId,
        clicked_at: new Date().toISOString(),
        user_agent: userAgent,
        ip_address: ipAddress,
      });

    if (insertError) {
      console.error("Error tracking WhatsApp click:", insertError);
      return NextResponse.json(
        { error: "Failed to track click" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "WhatsApp click tracked successfully",
    });
  } catch (error) {
    console.error("Error in track-whatsapp-click API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
