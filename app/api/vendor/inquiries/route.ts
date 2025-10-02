import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  CustomerInquiryWithDetails,
  VendorInquiriesResponse,
  UpdateInquiryStatusRequest,
  UpdateInquiryStatusResponse,
} from "@/types";

/**
 * GET /api/vendor/inquiries
 * Get all inquiries for the authenticated vendor
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

    // Get inquiries for this vendor's vehicles
    const { data: inquiries, error: inquiriesError } = await supabase
      .from("customer_inquiries")
      .select(
        `
        *,
        vehicles(name, brand, images),
        profiles!customer_inquiries_customer_id_fkey(full_name, email)
        `
      )
      .eq("vendor_id", vendor.id)
      .order("created_at", { ascending: false });

    if (inquiriesError) {
      throw inquiriesError;
    }

    // Transform data to include vehicle and customer info
    const transformedInquiries: CustomerInquiryWithDetails[] =
      inquiries?.map((inquiry) => ({
        id: inquiry.id,
        message: inquiry.message,
        status: inquiry.status,
        isGuest: inquiry.is_guest,
        guestName: inquiry.guest_name,
        guestEmail: inquiry.guest_email,
        guestPhone: inquiry.guest_phone,
        createdAt: inquiry.created_at,
        updatedAt: inquiry.updated_at,
        vehicle: {
          id: inquiry.vehicle_id,
          name: inquiry.vehicles?.name || "",
          brand: inquiry.vehicles?.brand || "",
          images: inquiry.vehicles?.images || [],
        },
        customer: inquiry.is_guest
          ? {
              name: inquiry.guest_name || "",
              email: inquiry.guest_email || "",
              phone: inquiry.guest_phone,
            }
          : {
              name: inquiry.profiles?.full_name || "",
              email: inquiry.profiles?.email || "",
              phone: null,
            },
      })) || [];

    const response: VendorInquiriesResponse = {
      inquiries: transformedInquiries,
      count: transformedInquiries.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching vendor inquiries:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/vendor/inquiries/[id]
 * Update inquiry status (e.g., mark as read, replied, etc.)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const inquiryId = params.id;
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
