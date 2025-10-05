import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

/**
 * POST /api/link-guest-inquiries
 * Link guest inquiries to a newly registered user
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

    if (!user.email) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    // Use service role client to bypass RLS for guest inquiries
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Find all guest inquiries with matching email
    const { data: guestInquiries, error: fetchError } = await serviceSupabase
      .from("customer_inquiries")
      .select("id, guest_name, guest_email, message, created_at, is_guest")
      .eq("guest_email", user.email)
      .eq("is_guest", true);

    if (fetchError) {
      console.error("Error fetching guest inquiries:", fetchError);
      return NextResponse.json(
        { success: false, linkedCount: 0, error: fetchError.message },
        { status: 500 }
      );
    }

    if (!guestInquiries || guestInquiries.length === 0) {
      return NextResponse.json({ success: true, linkedCount: 0 });
    }

    // Update the inquiries to link them to the user
    const { error: updateError } = await serviceSupabase
      .from("customer_inquiries")
      .update({
        customer_id: user.id,
        is_guest: false,
        // Keep guest info for reference but mark as linked
        guest_name: null,
        guest_email: null,
        guest_phone: null,
      })
      .eq("guest_email", user.email)
      .eq("is_guest", true);

    if (updateError) {
      console.error("Error linking guest inquiries:", updateError);
      return NextResponse.json(
        { success: false, linkedCount: 0, error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      linkedCount: guestInquiries.length,
    });
  } catch (error) {
    console.error("Unexpected error in link-guest-inquiries API:", error);
    return NextResponse.json(
      {
        success: false,
        linkedCount: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
