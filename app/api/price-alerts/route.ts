import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * GET /api/price-alerts
 * Get all active price alerts for the authenticated user
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

    // Get price alerts with vehicle details
    const { data: alerts, error } = await supabase
      .from("price_alerts")
      .select(
        `
        id,
        target_price,
        is_active,
        created_at,
        vehicle_id,
        vehicles (*)
      `
      )
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching price alerts:", error);
      return NextResponse.json(
        { error: "Failed to fetch price alerts" },
        { status: 500 }
      );
    }

    return NextResponse.json({ alerts: alerts || [] });
  } catch (error) {
    console.error("Unexpected error in GET /api/price-alerts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/price-alerts
 * Create a price alert
 * Body: { vehicleId: string, targetPrice: number }
 */
export async function POST(request: NextRequest) {
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

    // Get data from request body
    const { vehicleId, targetPrice } = await request.json();

    if (!vehicleId || !targetPrice) {
      return NextResponse.json(
        { error: "vehicleId and targetPrice are required" },
        { status: 400 }
      );
    }

    // Validate target price
    if (targetPrice <= 0) {
      return NextResponse.json(
        { error: "Target price must be greater than 0" },
        { status: 400 }
      );
    }

    // Check if vehicle exists and get current price
    const { data: vehicle, error: vehicleError } = await supabase
      .from("vehicles")
      .select("id, price")
      .eq("id", vehicleId)
      .single();

    if (vehicleError || !vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    // Validate that target price is less than current price
    if (targetPrice >= vehicle.price) {
      return NextResponse.json(
        { error: "Target price must be less than current vehicle price" },
        { status: 400 }
      );
    }

    // Check if user already has an alert for this vehicle
    const { data: existing } = await supabase
      .from("price_alerts")
      .select("id")
      .eq("customer_id", user.id)
      .eq("vehicle_id", vehicleId)
      .eq("is_active", true)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        {
          error:
            "You already have an active alert for this vehicle. Update or delete it first.",
          alertId: existing.id,
        },
        { status: 409 }
      );
    }

    // Create price alert
    const { data: alert, error } = await supabase
      .from("price_alerts")
      .insert({
        customer_id: user.id,
        vehicle_id: vehicleId,
        target_price: targetPrice,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating price alert:", error);
      return NextResponse.json(
        { error: "Failed to create price alert" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Price alert created successfully", alert },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected error in POST /api/price-alerts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/price-alerts
 * Delete a price alert
 * Body: { alertId: string }
 */
export async function DELETE(request: NextRequest) {
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

    // Get alert ID from request body
    const { alertId } = await request.json();
    if (!alertId) {
      return NextResponse.json(
        { error: "alertId is required" },
        { status: 400 }
      );
    }

    // Delete the alert (RLS ensures user can only delete their own)
    const { error } = await supabase
      .from("price_alerts")
      .delete()
      .eq("id", alertId)
      .eq("customer_id", user.id);

    if (error) {
      console.error("Error deleting price alert:", error);
      return NextResponse.json(
        { error: "Failed to delete price alert" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Price alert deleted successfully" });
  } catch (error) {
    console.error("Unexpected error in DELETE /api/price-alerts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/price-alerts
 * Update a price alert's target price
 * Body: { alertId: string, targetPrice: number }
 */
export async function PATCH(request: NextRequest) {
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

    // Get data from request body
    const { alertId, targetPrice } = await request.json();

    if (!alertId || !targetPrice) {
      return NextResponse.json(
        { error: "alertId and targetPrice are required" },
        { status: 400 }
      );
    }

    // Validate target price
    if (targetPrice <= 0) {
      return NextResponse.json(
        { error: "Target price must be greater than 0" },
        { status: 400 }
      );
    }

    // Update the alert (RLS ensures user can only update their own)
    const { data: alert, error } = await supabase
      .from("price_alerts")
      .update({
        target_price: targetPrice,
        updated_at: new Date().toISOString(),
      })
      .eq("id", alertId)
      .eq("customer_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating price alert:", error);
      return NextResponse.json(
        { error: "Failed to update price alert" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Price alert updated successfully",
      alert,
    });
  } catch (error) {
    console.error("Unexpected error in PATCH /api/price-alerts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
