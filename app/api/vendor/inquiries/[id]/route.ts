import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import {
  UpdateInquiryStatusRequest,
  UpdateInquiryStatusResponse,
} from "@/types";

/**
 * PATCH /api/vendor/inquiries/[id]
 * Update inquiry status (e.g., mark as read, replied, etc.)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Get vendor record for this user
    const { data: vendor, error: vendorError } = await supabase
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

    const { id: inquiryId } = await params;
    const body: UpdateInquiryStatusRequest = await request.json();
    const { status } = body;

    console.log("Updating inquiry:", {
      inquiryId,
      vendorId: vendor.id,
      status,
    });

    // Use service role client to bypass RLS
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // First, let's check if the inquiry exists and what vendor_id it has
    const { data: inquiryCheck, error: checkError } = await serviceSupabase
      .from("customer_inquiries")
      .select("id, vendor_id, status")
      .eq("id", inquiryId);

    console.log("Inquiry check result:", { inquiryCheck, checkError });

    if (checkError) {
      console.error("Error checking inquiry:", checkError);
      return NextResponse.json(
        { error: "Error checking inquiry" },
        { status: 500 }
      );
    }

    if (!inquiryCheck || inquiryCheck.length === 0) {
      console.log("No inquiry found with ID:", inquiryId);
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    const inquiry = inquiryCheck[0];
    console.log("Inquiry vendor_id:", inquiry.vendor_id);
    console.log("Authenticated vendor_id:", vendor.id);
    console.log("Do they match?", inquiry.vendor_id === vendor.id);

    // Update inquiry status
    const { data, error: updateError } = await serviceSupabase
      .from("customer_inquiries")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", inquiryId)
      .eq("vendor_id", vendor.id)
      .select();

    if (updateError) {
      throw updateError;
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Inquiry not found or access denied" },
        { status: 404 }
      );
    }

    const response: UpdateInquiryStatusResponse = {
      success: true,
      inquiry: data[0],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating inquiry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
