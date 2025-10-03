import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
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

    // First, let's check ALL inquiries in the database using service role
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: inquiries, error: inquiriesError } = await serviceSupabase
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
