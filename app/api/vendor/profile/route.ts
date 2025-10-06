import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import {
  UpdateVendorProfileRequest,
  UpdateVendorProfileResponse,
  VendorProfile,
} from "@/types";

/**
 * GET /api/vendor/profile
 * Get the current vendor's profile and business information
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

    // Use service role client to bypass RLS
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get vendor profile with business details
    const { data: profile, error: profileError } = await serviceSupabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return NextResponse.json(
        { error: "Failed to fetch profile" },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Get vendor business details
    const { data: vendor, error: vendorError } = await serviceSupabase
      .from("vendors")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (vendorError) {
      console.error("Error fetching vendor details:", vendorError);
      return NextResponse.json(
        { error: "Failed to fetch vendor details" },
        { status: 500 }
      );
    }

    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor profile not found" },
        { status: 404 }
      );
    }

    // Combine profile and vendor data
    const vendorProfile: VendorProfile = {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
      business_name: vendor.business_name,
      business_type: vendor.business_type,
      nit: vendor.nit,
      address: vendor.address,
      city: vendor.city,
      department: vendor.department,
      state: vendor.state,
      country: vendor.country,
      phone: vendor.phone,
      website: vendor.website,
      description: vendor.description,
      locations: vendor.locations,
      is_verified: vendor.is_verified,
      rating: vendor.rating,
      total_reviews: vendor.total_reviews,
      business_created_at: vendor.created_at,
      business_updated_at: vendor.updated_at,
    };

    return NextResponse.json({ profile: vendorProfile });
  } catch (error) {
    console.error("Unexpected error in GET /api/vendor/profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/vendor/profile
 * Update the current vendor's profile and business information
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
      console.error("Auth error:", userError);
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    const body: UpdateVendorProfileRequest = await request.json();
    const {
      full_name,
      avatar_url,
      business_name,
      business_type,
      nit,
      address,
      city,
      department,
      state,
      country,
      phone,
      website,
      description,
    } = body;

    // Validate input
    if (full_name !== undefined && full_name.trim().length === 0) {
      return NextResponse.json(
        { error: "Full name cannot be empty" },
        { status: 400 }
      );
    }

    if (business_name !== undefined && business_name.trim().length === 0) {
      return NextResponse.json(
        { error: "Business name cannot be empty" },
        { status: 400 }
      );
    }

    // Use service role client to bypass RLS
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Prepare profile update data
    const profileUpdateData: Partial<{
      full_name: string;
      avatar_url: string;
    }> = {};
    if (full_name !== undefined) profileUpdateData.full_name = full_name.trim();
    if (avatar_url !== undefined) profileUpdateData.avatar_url = avatar_url;

    // Prepare vendor update data
    const vendorUpdateData: Partial<{
      business_name: string;
      business_type: string;
      nit: string;
      address: string;
      city: string;
      department: string;
      state: string;
      country: string;
      phone: string;
      email: string;
      website: string;
      description: string;
    }> = {};
    if (business_name !== undefined)
      vendorUpdateData.business_name = business_name.trim();
    if (business_type !== undefined)
      vendorUpdateData.business_type = business_type.trim();
    if (nit !== undefined) vendorUpdateData.nit = nit.trim();
    if (address !== undefined) vendorUpdateData.address = address.trim();
    if (city !== undefined) vendorUpdateData.city = city.trim();
    if (department !== undefined)
      vendorUpdateData.department = department.trim();
    if (state !== undefined) vendorUpdateData.state = state.trim();
    if (country !== undefined) vendorUpdateData.country = country.trim();
    if (phone !== undefined) vendorUpdateData.phone = phone.trim();
    if (website !== undefined) vendorUpdateData.website = website.trim();
    if (description !== undefined)
      vendorUpdateData.description = description.trim();

    // Update profile if there are profile changes
    if (Object.keys(profileUpdateData).length > 0) {
      const { error: profileError } = await serviceSupabase
        .from("profiles")
        .update(profileUpdateData)
        .eq("id", user.id);

      if (profileError) {
        console.error("Error updating profile:", profileError);
        return NextResponse.json(
          { error: "Failed to update profile" },
          { status: 500 }
        );
      }
    }

    // Update vendor if there are vendor changes
    if (Object.keys(vendorUpdateData).length > 0) {
      const { error: vendorError } = await serviceSupabase
        .from("vendors")
        .update(vendorUpdateData)
        .eq("user_id", user.id);

      if (vendorError) {
        console.error("Error updating vendor:", vendorError);
        return NextResponse.json(
          { error: "Failed to update vendor details" },
          { status: 500 }
        );
      }
    }

    // Fetch updated data to return
    const { data: updatedProfile, error: profileFetchError } =
      await serviceSupabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (profileFetchError) {
      console.error("Error fetching updated profile:", profileFetchError);
      return NextResponse.json(
        { error: "Failed to fetch updated profile" },
        { status: 500 }
      );
    }

    const { data: updatedVendor, error: vendorFetchError } =
      await serviceSupabase
        .from("vendors")
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (vendorFetchError) {
      console.error("Error fetching updated vendor:", vendorFetchError);
      return NextResponse.json(
        { error: "Failed to fetch updated vendor" },
        { status: 500 }
      );
    }

    // Combine updated data
    const updatedVendorProfile: VendorProfile = {
      id: updatedProfile.id,
      email: updatedProfile.email,
      full_name: updatedProfile.full_name,
      avatar_url: updatedProfile.avatar_url,
      created_at: updatedProfile.created_at,
      updated_at: updatedProfile.updated_at,
      business_name: updatedVendor.business_name,
      business_type: updatedVendor.business_type,
      nit: updatedVendor.nit,
      address: updatedVendor.address,
      city: updatedVendor.city,
      department: updatedVendor.department,
      state: updatedVendor.state,
      country: updatedVendor.country,
      phone: updatedVendor.phone,
      website: updatedVendor.website,
      description: updatedVendor.description,
      locations: updatedVendor.locations,
      is_verified: updatedVendor.is_verified,
      rating: updatedVendor.rating,
      total_reviews: updatedVendor.total_reviews,
      business_created_at: updatedVendor.created_at,
      business_updated_at: updatedVendor.updated_at,
    };

    const response: UpdateVendorProfileResponse = {
      success: true,
      profile: updatedVendorProfile,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Unexpected error in PATCH /api/vendor/profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
