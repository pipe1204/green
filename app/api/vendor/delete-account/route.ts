import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import {
  DeleteVendorAccountRequest,
  DeleteVendorAccountResponse,
} from "@/types";

/**
 * DELETE /api/vendor/delete-account
 * Delete the current vendor's account and all associated data
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

    const body: DeleteVendorAccountRequest = await request.json();
    const { confirmation } = body;

    // Validate confirmation
    if (confirmation !== "DELETE") {
      return NextResponse.json(
        {
          error:
            "Invalid confirmation. You must type 'DELETE' to confirm account deletion.",
        },
        { status: 400 }
      );
    }

    // Use service role client for cascading deletion
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get vendor record first
    const { data: vendor, error: vendorError } = await serviceSupabase
      .from("vendors")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (vendorError || !vendor) {
      return NextResponse.json(
        { error: "Vendor profile not found" },
        { status: 404 }
      );
    }

    // 1. Delete customer favorites for this vendor's vehicles
    // First get all vehicle IDs for this vendor
    const { data: vehicleIds } = await serviceSupabase
      .from("vehicles")
      .select("id")
      .eq("vendor_id", vendor.id);

    if (vehicleIds && vehicleIds.length > 0) {
      const { error: favoritesError } = await serviceSupabase
        .from("customer_favorites")
        .delete()
        .in(
          "vehicle_id",
          vehicleIds.map((v) => v.id)
        );

      if (favoritesError) {
        console.error("Error deleting customer favorites:", favoritesError);
      }
    }

    // 2. Delete customer inquiries for this vendor's vehicles
    const { error: inquiriesError } = await serviceSupabase
      .from("customer_inquiries")
      .delete()
      .eq("vendor_id", vendor.id);

    if (inquiriesError) {
      console.error("Error deleting customer inquiries:", inquiriesError);
    }

    // 3. Delete test drive bookings for this vendor's vehicles
    const { error: testDrivesError } = await serviceSupabase
      .from("test_drive_bookings")
      .delete()
      .eq("vendor_id", vendor.id);

    if (testDrivesError) {
      console.error("Error deleting test drive bookings:", testDrivesError);
    }

    // 4. Delete reviews for this vendor's vehicles
    const { error: reviewsError } = await serviceSupabase
      .from("reviews")
      .delete()
      .eq("vendor_id", vendor.id);

    if (reviewsError) {
      console.error("Error deleting reviews:", reviewsError);
    }

    // 5. Delete messages where vendor is sender
    const { error: messagesError } = await serviceSupabase
      .from("messages")
      .delete()
      .eq("sender_id", user.id);

    if (messagesError) {
      console.error("Error deleting messages:", messagesError);
    }

    // 6. Delete conversations where vendor is participant
    const { error: conversationsError } = await serviceSupabase
      .from("conversations")
      .delete()
      .eq("vendor_id", vendor.id);

    if (conversationsError) {
      console.error("Error deleting conversations:", conversationsError);
    }

    // 7. Delete all vendor's vehicles
    const { error: vehiclesError } = await serviceSupabase
      .from("vehicles")
      .delete()
      .eq("vendor_id", vendor.id);

    if (vehiclesError) {
      console.error("Error deleting vehicles:", vehiclesError);
    }

    // 8. Delete vendor record
    const { error: vendorDeleteError } = await serviceSupabase
      .from("vendors")
      .delete()
      .eq("id", vendor.id);

    if (vendorDeleteError) {
      console.error("Error deleting vendor:", vendorDeleteError);
      return NextResponse.json(
        { error: "Failed to delete vendor profile" },
        { status: 500 }
      );
    }

    // 9. Delete the profile
    const { error: profileError } = await serviceSupabase
      .from("profiles")
      .delete()
      .eq("id", user.id);

    if (profileError) {
      console.error("Error deleting profile:", profileError);
      return NextResponse.json(
        { error: "Failed to delete profile" },
        { status: 500 }
      );
    }

    // 10. Sign out the user
    await serviceSupabase.auth.signOut();

    console.log(
      `Vendor account deletion completed for user: ${user.id}, vendor: ${vendor.id}`
    );

    const response: DeleteVendorAccountResponse = {
      success: true,
      message:
        "Vendor account and all associated data have been successfully deleted.",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(
      "Unexpected error in DELETE /api/vendor/delete-account:",
      error
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
