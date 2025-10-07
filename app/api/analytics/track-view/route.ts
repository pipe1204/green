import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { TrackViewRequest } from "@/types";

/**
 * POST /api/analytics/track-view
 * Track a vehicle view for analytics
 */
export async function POST(request: NextRequest) {
  try {
    // Get user from auth header (optional for anonymous tracking)
    const authHeader = request.headers.get("authorization");
    let userId = null;

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser(token);

      if (!userError && user) {
        userId = user.id;
      }
    }

    // Parse request body
    const body: TrackViewRequest = await request.json();
    const { vehicle_id, session_id, user_agent, referrer, view_duration } =
      body;

    if (!vehicle_id) {
      return NextResponse.json(
        { error: "Vehicle ID is required" },
        { status: 400 }
      );
    }

    // Verify vehicle exists
    const { data: vehicle, error: vehicleError } = await supabase
      .from("vehicles")
      .select("id")
      .eq("id", vehicle_id)
      .single();

    if (vehicleError || !vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    // Get client IP address
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0]
      : request.headers.get("x-real-ip") || "unknown";

    // Check if this is a duplicate view (same user, same vehicle, same day)
    const today = new Date().toISOString().split("T")[0];

    if (userId) {
      const { data: existingView } = await supabase
        .from("vehicle_views")
        .select("id")
        .eq("vehicle_id", vehicle_id)
        .eq("customer_id", userId)
        .gte("viewed_at", `${today}T00:00:00.000Z`)
        .lte("viewed_at", `${today}T23:59:59.999Z`)
        .single();

      if (existingView) {
        // Update existing view with new duration
        const { error: updateError } = await supabase
          .from("vehicle_views")
          .update({
            view_duration: view_duration || 0,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingView.id);

        if (updateError) {
          console.error("Error updating vehicle view:", updateError);
        }

        return NextResponse.json({ success: true });
      }
    } else if (session_id) {
      // For anonymous users, check by session_id
      const { data: existingView } = await supabase
        .from("vehicle_views")
        .select("id")
        .eq("vehicle_id", vehicle_id)
        .eq("session_id", session_id)
        .gte("viewed_at", `${today}T00:00:00.000Z`)
        .lte("viewed_at", `${today}T23:59:59.999Z`)
        .single();

      if (existingView) {
        // Update existing view with new duration
        const { error: updateError } = await supabase
          .from("vehicle_views")
          .update({
            view_duration: view_duration || 0,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingView.id);

        if (updateError) {
          console.error("Error updating vehicle view:", updateError);
        }

        return NextResponse.json({ success: true });
      }
    }

    // Create new view record
    const { error: insertError } = await supabase.from("vehicle_views").insert({
      vehicle_id,
      customer_id: userId,
      session_id: userId ? null : session_id,
      ip_address: ip,
      user_agent,
      referrer,
      view_duration: view_duration || 0,
    });

    if (insertError) {
      console.error("Error inserting vehicle view:", insertError);
      return NextResponse.json(
        { error: "Failed to track view" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in track-view API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
