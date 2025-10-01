import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * GET /api/favorites
 * Get all favorite vehicles for the authenticated user
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

    // Get favorites with vehicle details
    const { data: favorites, error } = await supabase
      .from("customer_favorites")
      .select(
        `
        id,
        created_at,
        vehicle_id,
        vehicles (*)
      `
      )
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching favorites:", error);
      return NextResponse.json(
        { error: "Failed to fetch favorites" },
        { status: 500 }
      );
    }

    return NextResponse.json({ favorites: favorites || [] });
  } catch (error) {
    console.error("Unexpected error in GET /api/favorites:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/favorites
 * Add a vehicle to favorites
 * Body: { vehicleId: string }
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

    // Get vehicle ID from request body
    const { vehicleId } = await request.json();
    if (!vehicleId) {
      return NextResponse.json(
        { error: "vehicleId is required" },
        { status: 400 }
      );
    }

    // Check if vehicle exists
    const { data: vehicle, error: vehicleError } = await supabase
      .from("vehicles")
      .select("id")
      .eq("id", vehicleId)
      .single();

    if (vehicleError || !vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    // Check if already favorited
    const { data: existing } = await supabase
      .from("customer_favorites")
      .select("id")
      .eq("customer_id", user.id)
      .eq("vehicle_id", vehicleId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { message: "Vehicle already in favorites", favoriteId: existing.id },
        { status: 200 }
      );
    }

    // Add to favorites
    const { data: favorite, error } = await supabase
      .from("customer_favorites")
      .insert({
        customer_id: user.id,
        vehicle_id: vehicleId,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding favorite:", error);
      return NextResponse.json(
        { error: "Failed to add favorite" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Added to favorites", favorite },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected error in POST /api/favorites:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/favorites
 * Remove a vehicle from favorites
 * Body: { vehicleId: string }
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

    // Get vehicle ID from request body
    const { vehicleId } = await request.json();
    if (!vehicleId) {
      return NextResponse.json(
        { error: "vehicleId is required" },
        { status: 400 }
      );
    }

    // Remove from favorites
    const { error } = await supabase
      .from("customer_favorites")
      .delete()
      .eq("customer_id", user.id)
      .eq("vehicle_id", vehicleId);

    if (error) {
      console.error("Error removing favorite:", error);
      return NextResponse.json(
        { error: "Failed to remove favorite" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Removed from favorites" });
  } catch (error) {
    console.error("Unexpected error in DELETE /api/favorites:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
