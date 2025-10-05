import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

/**
 * Links guest inquiries to a newly registered user based on email match
 * @param userId - The ID of the newly registered user
 * @param email - The email address to match against guest inquiries
 * @returns Promise<{ success: boolean; linkedCount: number; error?: string }>
 */
export async function linkGuestInquiriesByEmail(
  userId: string,
  email: string
): Promise<{ success: boolean; linkedCount: number; error?: string }> {
  try {
    // Use service role client to bypass RLS for guest inquiries
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    // Find all guest inquiries with matching email
    const { data: guestInquiries, error: fetchError } = await serviceSupabase
      .from("customer_inquiries")
      .select("id, guest_name, guest_email, message, created_at, is_guest")
      .eq("guest_email", email)
      .eq("is_guest", true);

    if (fetchError) {
      console.error("Error fetching guest inquiries:", fetchError);
      return { success: false, linkedCount: 0, error: fetchError.message };
    }

    if (!guestInquiries || guestInquiries.length === 0) {
      return { success: true, linkedCount: 0 };
    }

    // Update the inquiries to link them to the user
    const { error: updateError } = await serviceSupabase
      .from("customer_inquiries")
      .update({
        customer_id: userId,
        is_guest: false,
        // Keep guest info for reference but mark as linked
        guest_name: null,
        guest_email: null,
        guest_phone: null,
      })
      .eq("guest_email", email)
      .eq("is_guest", true);

    if (updateError) {
      console.error("Error linking guest inquiries:", updateError);
      return { success: false, linkedCount: 0, error: updateError.message };
    }

    return {
      success: true,
      linkedCount: guestInquiries.length,
    };
  } catch (error) {
    console.error("Unexpected error in linkGuestInquiriesByEmail:", error);
    return {
      success: false,
      linkedCount: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Gets the count of guest inquiries for a given email (before linking)
 * @param email - The email address to check
 * @returns Promise<number>
 */
export async function getGuestInquiriesCount(email: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("customer_inquiries")
      .select("*", { count: "exact", head: true })
      .eq("guest_email", email)
      .eq("is_guest", true);

    if (error) {
      console.error("Error getting guest inquiries count:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("Unexpected error in getGuestInquiriesCount:", error);
    return 0;
  }
}

/**
 * Gets linked inquiries for a user (inquiries that were originally guest inquiries)
 * @param userId - The user ID
 * @returns Promise<Array of inquiry objects>
 */
export async function getLinkedInquiries(userId: string) {
  try {
    const { data, error } = await supabase
      .from("customer_inquiries")
      .select(
        `
        *,
        vehicles (
          id,
          name,
          brand,
          type,
          price,
          images
        )
      `
      )
      .eq("customer_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching linked inquiries:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error in getLinkedInquiries:", error);
    return [];
  }
}
