import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  UpdateVehicleSaleRequest,
  UpdateVehicleSaleResponse,
  Vehicle,
} from "@/types";
import { databaseToVehicle } from "@/lib/database-mapping";

// Initialize Supabase client with service role key
const serviceSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Params = { id: string };
type RouteContext = { params: Params } | { params: Promise<Params> };

function isPromise<T>(value: unknown): value is Promise<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { then?: unknown }).then === "function"
  );
}

/**
 * PATCH /api/vendor/vehicles/[id]/sale
 * Update the sale status and price for a specific vehicle
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    // Resolve params (support both direct object and Promise in different runtimes)
    const resolvedParams = isPromise<Params>(context.params)
      ? await context.params
      : context.params;
    const vehicleId = resolvedParams.id;

    // Get user from auth header
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized - No auth token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    if (!vehicleId) {
      return NextResponse.json(
        { error: "Vehicle ID is required" },
        { status: 400 }
      );
    }

    // Get user from token
    const {
      data: { user },
      error: userError,
    } = await serviceSupabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    // Parse request body
    const body: UpdateVehicleSaleRequest = await request.json();
    const { is_on_sale, sale_price } = body;

    // Validate input
    if (typeof is_on_sale !== "boolean") {
      return NextResponse.json(
        { error: "is_on_sale must be a boolean" },
        { status: 400 }
      );
    }

    // If enabling sale, sale_price is required
    if (is_on_sale && (sale_price === undefined || sale_price === null)) {
      return NextResponse.json(
        { error: "sale_price is required when enabling sale" },
        { status: 400 }
      );
    }

    // If sale_price is provided, validate it
    if (sale_price !== undefined && sale_price !== null) {
      if (typeof sale_price !== "number" || sale_price <= 0) {
        return NextResponse.json(
          { error: "sale_price must be a positive number" },
          { status: 400 }
        );
      }
    }

    // Verify vehicle exists and belongs to this vendor
    const { data: vehicle, error: vehicleError } = await serviceSupabase
      .from("vehicles")
      .select("id, name, price, vendor_id")
      .eq("id", vehicleId)
      .single();

    if (vehicleError || !vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    // Verify vendor ownership
    const { data: vendor, error: vendorError } = await serviceSupabase
      .from("vendors")
      .select("id")
      .eq("id", vehicle.vendor_id)
      .eq("user_id", user.id)
      .single();

    if (vendorError || !vendor) {
      return NextResponse.json(
        { error: "Unauthorized - Vehicle does not belong to you" },
        { status: 403 }
      );
    }

    // If sale is enabled, validate sale_price is less than regular price
    if (is_on_sale && sale_price !== undefined && sale_price !== null) {
      if (sale_price >= vehicle.price) {
        return NextResponse.json(
          { error: "Sale price must be less than the regular price" },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: {
      is_on_sale: boolean;
      sale_price?: number | null;
      updated_at: string;
    } = {
      is_on_sale,
      updated_at: new Date().toISOString(),
    };

    // Handle sale_price based on is_on_sale status
    if (is_on_sale) {
      // If enabling sale, set the sale_price
      updateData.sale_price = sale_price;
    } else {
      // If disabling sale, clear the sale_price
      updateData.sale_price = null;
    }

    // Update the vehicle
    const { data: updatedVehicle, error: updateError } = await serviceSupabase
      .from("vehicles")
      .update(updateData)
      .eq("id", vehicleId)
      .select("*")
      .single();

    if (updateError) {
      console.error("Error updating vehicle sale status:", updateError);
      return NextResponse.json(
        { error: "Failed to update vehicle sale status" },
        { status: 500 }
      );
    }

    // Convert database vehicle to frontend Vehicle type
    const vehicleResponse: Vehicle = databaseToVehicle(updatedVehicle);

    // Check for price alerts that match the new price
    if (is_on_sale && sale_price) {
      try {
        const { sendPriceAlertMatchEmail } = await import(
          "@/lib/email-service"
        );

        // Find active price alerts for this vehicle where target price >= new sale price
        const { data: matchingAlerts } = await serviceSupabase
          .from("price_alerts")
          .select(
            `
            id,
            target_price,
            customer_id,
            profiles!price_alerts_customer_id_fkey(full_name, email)
          `
          )
          .eq("vehicle_id", vehicleId)
          .eq("is_active", true)
          .gte("target_price", sale_price);

        // Send email to each customer with matching alert
        if (matchingAlerts && matchingAlerts.length > 0) {
          for (const alert of matchingAlerts) {
            const profileData = alert.profiles as unknown as {
              email: string;
              full_name: string;
            } | null;
            const customerEmail = profileData?.email;
            const customerName = profileData?.full_name;

            if (customerEmail) {
              await sendPriceAlertMatchEmail({
                recipientEmail: customerEmail,
                recipientName: customerName || "Cliente",
                vehicleName: updatedVehicle.name,
                vehicleBrand: updatedVehicle.brand,
                vehicleType: updatedVehicle.type,
                oldPrice: updatedVehicle.price,
                newPrice: sale_price,
                targetPrice: alert.target_price,
                savings: updatedVehicle.price - sale_price,
                vehicleUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://green.co"}/product/${vehicleId}`,
                vehicleImageUrl: updatedVehicle.images?.[0]?.url || undefined,
              });

              // Optionally deactivate the alert after sending (one-time notification)
              await serviceSupabase
                .from("price_alerts")
                .update({
                  is_active: false,
                  updated_at: new Date().toISOString(),
                })
                .eq("id", alert.id);
            }
          }

          console.log(
            `Sent ${matchingAlerts.length} price alert emails for vehicle ${vehicleId}`
          );
        }
      } catch (emailError) {
        // Log email error but don't fail the request
        console.error("Error processing price alerts:", emailError);
      }
    }

    return NextResponse.json<UpdateVehicleSaleResponse>(
      { success: true, vehicle: vehicleResponse },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in vehicle sale API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
