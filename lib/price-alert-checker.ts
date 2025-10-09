import { createClient } from "@supabase/supabase-js";
import { sendPriceAlertMatchEmail } from "./email-service";

const serviceSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Check and trigger price alerts for a vehicle
 * @param vehicleId - ID of the vehicle
 * @param newPrice - The new price to check against alerts (could be sale_price or regular price)
 * @param vehicleData - Vehicle data for email
 */
export async function checkAndTriggerPriceAlerts(
  vehicleId: string,
  newPrice: number,
  vehicleData: {
    name: string;
    brand: string;
    type: string;
    regularPrice: number;
    images?: { url: string }[];
  }
): Promise<void> {
  try {
    // Find active price alerts for this vehicle where target price >= new price
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
      .gte("target_price", newPrice);

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
            vehicleName: vehicleData.name,
            vehicleBrand: vehicleData.brand,
            vehicleType: vehicleData.type,
            oldPrice: vehicleData.regularPrice,
            newPrice: newPrice,
            targetPrice: alert.target_price,
            savings: vehicleData.regularPrice - newPrice,
            vehicleUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://green.co"}/product/${vehicleId}`,
            vehicleImageUrl: vehicleData.images?.[0]?.url || undefined,
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
  } catch (error) {
    console.error("Error processing price alerts:", error);
    // Don't throw - we don't want to fail the main operation
  }
}
