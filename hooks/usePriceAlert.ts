import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";

interface PriceAlertData {
  id: string;
  target_price: number;
  is_active: boolean;
}

export const usePriceAlert = (vehicleId: string) => {
  const { user } = useAuth();
  const [hasAlert, setHasAlert] = useState(false);
  const [alertData, setAlertData] = useState<PriceAlertData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkPriceAlert = useCallback(async () => {
    if (!user || !vehicleId) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("price_alerts")
        .select("id, target_price, is_active")
        .eq("customer_id", user.id)
        .eq("vehicle_id", vehicleId)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setHasAlert(true);
        setAlertData(data);
      } else {
        setHasAlert(false);
        setAlertData(null);
      }
    } catch (err) {
      console.error("Error checking price alert:", err);
      setError("Error checking price alert");
      setHasAlert(false);
      setAlertData(null);
    } finally {
      setLoading(false);
    }
  }, [user, vehicleId]);

  useEffect(() => {
    if (user && vehicleId) {
      checkPriceAlert();
    } else {
      setHasAlert(false);
      setAlertData(null);
    }
  }, [user, vehicleId, checkPriceAlert]);

  const refreshAlert = () => {
    checkPriceAlert();
  };

  return {
    hasAlert,
    alertData,
    loading,
    error,
    refreshAlert,
  };
};
