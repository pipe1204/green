import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const serviceSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/vendor/vehicles/[id]/price-alerts
 * Check and send price alert emails for a vehicle after price update
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: vehicleId } = await params;

    if (!vehicleId) {
      return NextResponse.json(
        { error: "Vehicle ID is required" },
        { status: 400 }
      );
    }

    // Get user from auth header
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized - No auth token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    // Get user from token
    const {
      data: { user },
      error: userError,
    } = await serviceSupabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    // Verify vehicle exists and belongs to this vendor
    const { data: vehicle, error: vehicleError } = await serviceSupabase
      .from("vehicles")
      .select(
        `
        id,
        name,
        brand,
        type,
        price,
        is_on_sale,
        sale_price,
        images,
        vendor_id,
        vendors!inner(user_id)
      `
      )
      .eq("id", vehicleId)
      .single();

    if (vehicleError || !vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    // Verify vendor ownership
    const vendorData = vehicle.vendors as unknown as { user_id: string };
    if (vendorData.user_id !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized - Vehicle does not belong to you" },
        { status: 403 }
      );
    }

    // Determine effective price (sale price if on sale, otherwise regular price)
    const effectivePrice =
      vehicle.is_on_sale && vehicle.sale_price
        ? vehicle.sale_price
        : vehicle.price;

    // Check and send price alerts
    const { checkAndSendPriceAlerts } = await import(
      "@/lib/price-alert-checker"
    );

    await checkAndSendPriceAlerts(vehicleId, effectivePrice, {
      name: vehicle.name,
      brand: vehicle.brand,
      type: vehicle.type,
      price: vehicle.price,
      images: vehicle.images,
    });

    return NextResponse.json({
      success: true,
      message: "Price alerts checked successfully",
      effectivePrice,
    });
  } catch (error) {
    console.error("Error in price alerts check:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
