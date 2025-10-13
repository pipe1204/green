"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Zap } from "lucide-react";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Wait a moment for the session to be established
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          router.push("/?error=auth_callback_failed");
          return;
        }

        if (data.session) {
          // User is authenticated, redirect to appropriate dashboard
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.session.user.id)
            .single();

          if (profile?.role === "vendor") {
            // Check if vendor profile exists, if not create it
            const { data: existingVendor } = await supabase
              .from("vendors")
              .select("id")
              .eq("user_id", data.session.user.id)
              .single();

            if (!existingVendor) {
              // Get vendor data from localStorage
              const pendingVendorData =
                localStorage.getItem("pendingVendorData");

              if (pendingVendorData) {
                const vendorData = JSON.parse(pendingVendorData);
                const mainLocation =
                  vendorData.locations.find(
                    (loc: { isMain: boolean }) => loc.isMain
                  ) || vendorData.locations[0];

                // Create vendor profile with actual form data
                // All new vendors get 30-day Pro trial
                const trialEndDate = new Date();
                trialEndDate.setDate(trialEndDate.getDate() + 30);

                await supabase.from("vendors").insert({
                  user_id: data.session.user.id,
                  business_name: vendorData.businessName,
                  business_type: vendorData.businessType,
                  nit: vendorData.nit,
                  phone: vendorData.phone,
                  website: vendorData.website,
                  address: mainLocation?.address,
                  city: mainLocation?.city,
                  department: mainLocation?.department,
                  country: "Colombia",
                  locations: vendorData.locations,
                  is_verified: false,
                  rating: 0,
                  total_reviews: 0,
                  // 30-day Pro trial for all new vendors
                  subscription_tier: "pro",
                  is_trial: true,
                  trial_end_date: trialEndDate.toISOString(),
                  subscription_start_date: new Date().toISOString(),
                });

                // Clean up localStorage
                localStorage.removeItem("pendingVendorData");
              } else {
                // Fallback to default values if no data found
                // All new vendors get 30-day Pro trial
                const trialEndDate = new Date();
                trialEndDate.setDate(trialEndDate.getDate() + 30);

                await supabase.from("vendors").insert({
                  user_id: data.session.user.id,
                  business_name: "Mi Empresa",
                  business_type: "tienda",
                  country: "Colombia",
                  is_verified: false,
                  rating: 0,
                  total_reviews: 0,
                  // 30-day Pro trial for all new vendors
                  subscription_tier: "pro",
                  is_trial: true,
                  trial_end_date: trialEndDate.toISOString(),
                  subscription_start_date: new Date().toISOString(),
                });
              }
            }
            router.push("/dashboard");
          } else {
            router.push("/customer-dashboard");
          }
        } else {
          // No session, redirect to home
          router.push("/");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        router.push("/?error=auth_callback_failed");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center justify-center h-64">
        <Zap className="w-8 h-8 animate-spin text-green-600" />
      </div>
    </div>
  );
}
