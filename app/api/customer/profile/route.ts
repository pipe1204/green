import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import {
  UpdateProfileRequest,
  UpdateProfileResponse,
  CustomerProfile,
} from "@/types";

/**
 * GET /api/customer/profile
 * Get the current user's profile information
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
      console.error("Auth error:", userError);
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: profile, error } = await serviceSupabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      console.error("User ID being queried:", user.id);
      return NextResponse.json(
        { error: "Failed to fetch profile" },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Unexpected error in GET /api/customer/profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/customer/profile
 * Update the current user's profile information
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

    const body: UpdateProfileRequest = await request.json();
    const { full_name, avatar_url } = body;

    // Validate input
    if (full_name !== undefined && full_name.trim().length === 0) {
      return NextResponse.json(
        { error: "Full name cannot be empty" },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: Partial<CustomerProfile> = {};
    if (full_name !== undefined) updateData.full_name = full_name.trim();
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;

    // Update profile using service role client to bypass RLS
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: updatedProfile, error } = await serviceSupabase
      .from("profiles")
      .update(updateData)
      .eq("id", user.id)
      .select("*")
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    const response: UpdateProfileResponse = {
      success: true,
      profile: updatedProfile,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Unexpected error in PATCH /api/customer/profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
