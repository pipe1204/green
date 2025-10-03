import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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

    // Update inquiry status
    const { data, error: updateError } = await supabase
      .from("customer_inquiries")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", inquiryId)
      .eq("vendor_id", vendor.id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    const response: UpdateInquiryStatusResponse = {
      success: true,
      inquiry: data,
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
