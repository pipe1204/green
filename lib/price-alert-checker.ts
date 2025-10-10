import { createClient } from "@supabase/supabase-js";

const serviceSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Check and send price alert emails for a vehicle
 * @param vehicleId - The vehicle ID to check alerts for
 * @param effectivePrice - The effective price to check against (sale price if on sale, otherwise regular price)
 * @param previousPrice - The previous price before the update (for accurate savings calculation)
 * @param vehicleData - Vehicle data for email template (optional, will fetch if not provided)
 */
export async function checkAndSendPriceAlerts(
  vehicleId: string,
  effectivePrice: number,
  previousPrice: number,
  vehicleData?: {
    name: string;
    brand: string;
    type: string;
    price: number;
    images?: Array<{ url: string }> | null;
  }
) {
  if (!effectivePrice || effectivePrice <= 0) {
    return;
  }

  try {
    const { sendPriceAlertMatchEmail } = await import("@/lib/email-service");

    // Fetch vehicle data if not provided
    let vehicle = vehicleData;
    if (!vehicle) {
      const { data: fetchedVehicle } = await serviceSupabase
        .from("vehicles")
        .select("name, brand, type, price, images")
        .eq("id", vehicleId)
        .single();

      if (!fetchedVehicle) {
        console.error(`Vehicle ${vehicleId} not found for price alert check`);
        return;
      }

      vehicle = fetchedVehicle;
    }

    // Find active price alerts for this vehicle where target price >= effective price
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
      .gte("target_price", effectivePrice);

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
            vehicleName: vehicle.name,
            vehicleBrand: vehicle.brand,
            vehicleType: vehicle.type,
            oldPrice: previousPrice,
            newPrice: effectivePrice,
            targetPrice: alert.target_price,
            savings: previousPrice - effectivePrice,
            vehicleUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://green.co"}/product/${vehicleId}`,
            vehicleImageUrl: vehicle.images?.[0]?.url || undefined,
          });

          // Deactivate the alert after sending (one-time notification)
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
