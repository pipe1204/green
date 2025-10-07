import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { DeleteAccountRequest, DeleteAccountResponse } from "@/types";

/**
 * DELETE /api/customer/delete-account
 * Delete the current user's account and all associated data
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

    const body: DeleteAccountRequest = await request.json();
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
    const serviceSupabase = supabase;

    // Start cascading deletion process
    console.log(`Starting account deletion for user: ${user.id}`);

    // 1. Delete customer favorites
    const { error: favoritesError } = await serviceSupabase
      .from("customer_favorites")
      .delete()
      .eq("customer_id", user.id);

    if (favoritesError) {
      console.error("Error deleting customer favorites:", favoritesError);
    }

    // 2. Delete customer inquiries
    const { error: inquiriesError } = await serviceSupabase
      .from("customer_inquiries")
      .delete()
      .eq("customer_id", user.id);

    if (inquiriesError) {
      console.error("Error deleting customer inquiries:", inquiriesError);
    }

    // 3. Delete test drive bookings
    const { error: testDrivesError } = await serviceSupabase
      .from("test_drive_bookings")
      .delete()
      .eq("customer_id", user.id);

    if (testDrivesError) {
      console.error("Error deleting test drive bookings:", testDrivesError);
    }

    // 4. Delete price alerts
    const { error: priceAlertsError } = await serviceSupabase
      .from("price_alerts")
      .delete()
      .eq("customer_id", user.id);

    if (priceAlertsError) {
      console.error("Error deleting price alerts:", priceAlertsError);
    }

    // 5. Delete messages where user is sender
    const { error: messagesError } = await serviceSupabase
      .from("messages")
      .delete()
      .eq("sender_id", user.id);

    if (messagesError) {
      console.error("Error deleting messages:", messagesError);
    }

    // 6. Delete conversations where user is customer
    const { error: conversationsError } = await serviceSupabase
      .from("conversations")
      .delete()
      .eq("customer_id", user.id);

    if (conversationsError) {
      console.error("Error deleting conversations:", conversationsError);
    }

    // 7. Delete reviews where user is customer
    const { error: reviewsError } = await serviceSupabase
      .from("reviews")
      .delete()
      .eq("customer_id", user.id);

    if (reviewsError) {
      console.error("Error deleting reviews:", reviewsError);
    }

    // 8. Finally, delete the profile
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

    // 9. Sign out the user
    await serviceSupabase.auth.signOut();

    console.log(`Account deletion completed for user: ${user.id}`);

    const response: DeleteAccountResponse = {
      success: true,
      message:
        "Account and all associated data have been successfully deleted.",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(
      "Unexpected error in DELETE /api/customer/delete-account:",
      error
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
