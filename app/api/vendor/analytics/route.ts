import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { VendorAnalyticsResponse, VehicleAnalytics } from "@/types";
import { FavoriteRecord, InquiryRecord, ViewRecord } from "@/types/queries";

/**
 * GET /api/vendor/analytics
 * Get comprehensive analytics data for the vendor's vehicles
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

    // Use service role client to bypass RLS for analytics queries
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

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

    // Get vendor record
    const { data: vendor, error: vendorError } = await serviceSupabase
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

    // Get date range from query params (default to last 30 days)
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get("days") || "30");
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split("T")[0];

    // Get all vehicles for this vendor
    const { data: vehicles, error: vehiclesError } = await serviceSupabase
      .from("vehicles")
      .select("id, name, created_at")
      .eq("vendor_id", vendor.id);

    if (vehiclesError) {
      console.error("Error fetching vehicles:", vehiclesError);
      return NextResponse.json(
        { error: "Failed to fetch vehicles" },
        { status: 500 }
      );
    }

    if (!vehicles || vehicles.length === 0) {
      return NextResponse.json({
        success: true,
        analytics: {
          summary: {
            total_vehicles: 0,
            total_views: 0,
            total_favorites: 0,
            total_inquiries: 0,
            total_test_drives: 0,
            total_price_alerts: 0,
            average_conversion_rate: 0,
          },
          top_performing_vehicles: [],
          engagement_metrics: {
            views_by_day: [],
            favorites_by_day: [],
            inquiries_by_day: [],
          },
          vehicle_performance: [],
        },
      });
    }

    const vehicleIds = vehicles.map((v) => v.id);

    // Get analytics data for each vehicle
    const vehicleAnalyticsPromises = vehicles.map(async (vehicle) => {
      // Get views
      const { data: views } = await serviceSupabase
        .from("vehicle_views")
        .select("id, customer_id")
        .eq("vehicle_id", vehicle.id)
        .gte("viewed_at", `${startDateStr}T00:00:00.000Z`);

      // Get favorites
      const { data: favorites } = await serviceSupabase
        .from("customer_favorites")
        .select("id")
        .eq("vehicle_id", vehicle.id)
        .gte("created_at", `${startDateStr}T00:00:00.000Z`);

      // Get inquiries
      const { data: inquiries } = await serviceSupabase
        .from("customer_inquiries")
        .select("id")
        .eq("vehicle_id", vehicle.id)
        .gte("created_at", `${startDateStr}T00:00:00.000Z`);

      // Get test drives
      const { data: testDrives } = await serviceSupabase
        .from("test_drive_bookings")
        .select("id")
        .eq("vehicle_id", vehicle.id)
        .gte("created_at", `${startDateStr}T00:00:00.000Z`);

      // Get price alerts
      const { data: priceAlerts } = await serviceSupabase
        .from("price_alerts")
        .select("id")
        .eq("vehicle_id", vehicle.id)
        .gte("created_at", `${startDateStr}T00:00:00.000Z`);

      const totalViews = views?.length || 0;
      const uniqueViewers = new Set(
        views?.map((v) => v.customer_id).filter(Boolean)
      ).size;
      const favoritesCount = favorites?.length || 0;
      const inquiriesCount = inquiries?.length || 0;
      const testDrivesCount = testDrives?.length || 0;
      const priceAlertsCount = priceAlerts?.length || 0;

      // Calculate conversion rate (inquiries / views)
      const conversionRate =
        totalViews > 0 ? (inquiriesCount / totalViews) * 100 : 0;

      return {
        vehicle_id: vehicle.id,
        vehicle_name: vehicle.name,
        total_views: totalViews,
        unique_viewers: uniqueViewers,
        favorites_count: favoritesCount,
        inquiries_count: inquiriesCount,
        test_drives_count: testDrivesCount,
        price_alerts_count: priceAlertsCount,
        conversion_rate: Math.round(conversionRate * 100) / 100,
      } as VehicleAnalytics;
    });

    const vehiclePerformance = await Promise.all(vehicleAnalyticsPromises);

    // Calculate summary metrics
    const summary = {
      total_vehicles: vehicles.length,
      total_views: vehiclePerformance.reduce(
        (sum, v) => sum + v.total_views,
        0
      ),
      total_favorites: vehiclePerformance.reduce(
        (sum, v) => sum + v.favorites_count,
        0
      ),
      total_inquiries: vehiclePerformance.reduce(
        (sum, v) => sum + v.inquiries_count,
        0
      ),
      total_test_drives: vehiclePerformance.reduce(
        (sum, v) => sum + v.test_drives_count,
        0
      ),
      total_price_alerts: vehiclePerformance.reduce(
        (sum, v) => sum + v.price_alerts_count,
        0
      ),
      average_conversion_rate:
        vehiclePerformance.length > 0
          ? Math.round(
              (vehiclePerformance.reduce(
                (sum, v) => sum + v.conversion_rate,
                0
              ) /
                vehiclePerformance.length) *
                100
            ) / 100
          : 0,
    };

    // Get top performing vehicles (by conversion rate)
    const topPerformingVehicles = vehiclePerformance
      .sort((a, b) => b.conversion_rate - a.conversion_rate)
      .slice(0, 5);

    // Get engagement metrics by day - inline to avoid typing issues
    const [viewsByDayResult, favoritesByDayResult, inquiriesByDayResult] =
      await Promise.all([
        serviceSupabase
          .from("vehicle_views")
          .select("viewed_at")
          .in("vehicle_id", vehicleIds)
          .gte("viewed_at", `${startDateStr}T00:00:00.000Z`)
          .order("viewed_at", { ascending: true }),
        serviceSupabase
          .from("customer_favorites")
          .select("created_at")
          .in("vehicle_id", vehicleIds)
          .gte("created_at", `${startDateStr}T00:00:00.000Z`)
          .order("created_at", { ascending: true }),
        serviceSupabase
          .from("customer_inquiries")
          .select("created_at")
          .in("vehicle_id", vehicleIds)
          .gte("created_at", `${startDateStr}T00:00:00.000Z`)
          .order("created_at", { ascending: true }),
      ]);

    const viewsByDay = viewsByDayResult.data || [];
    const favoritesByDay = favoritesByDayResult.data || [];
    const inquiriesByDay = inquiriesByDayResult.data || [];

    // Group by date
    const groupByDate = (
      data: ViewRecord[] | FavoriteRecord[] | InquiryRecord[],
      dateField: string
    ) => {
      const grouped = data.reduce((acc, item) => {
        const dateValue =
          dateField === "viewed_at"
            ? (item as ViewRecord).viewed_at
            : (item as FavoriteRecord | InquiryRecord).created_at;
        const date = new Date(dateValue).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(grouped).map(([date, count]) => ({
        date,
        views: dateField === "viewed_at" ? count : 0,
        favorites: dateField === "created_at" && data.length > 0 ? count : 0,
        inquiries: dateField === "created_at" && data.length > 0 ? count : 0,
      }));
    };

    const viewsByDayGrouped = groupByDate(viewsByDay, "viewed_at");
    const favoritesByDayGrouped = groupByDate(favoritesByDay, "created_at");
    const inquiriesByDayGrouped = groupByDate(inquiriesByDay, "created_at");

    // Combine all dates
    const allDates = new Set([
      ...viewsByDayGrouped.map((v) => v.date),
      ...favoritesByDayGrouped.map((f) => f.date),
      ...inquiriesByDayGrouped.map((i) => i.date),
    ]);

    const views_by_day = Array.from(allDates).map((date) => ({
      date,
      views: viewsByDayGrouped.find((v) => v.date === date)?.views || 0,
    }));

    const favorites_by_day = Array.from(allDates).map((date) => ({
      date,
      favorites:
        favoritesByDayGrouped.find((f) => f.date === date)?.favorites || 0,
    }));

    const inquiries_by_day = Array.from(allDates).map((date) => ({
      date,
      inquiries:
        inquiriesByDayGrouped.find((i) => i.date === date)?.inquiries || 0,
    }));

    const engagementMetrics = {
      views_by_day,
      favorites_by_day,
      inquiries_by_day,
    };

    const analytics = {
      summary,
      top_performing_vehicles: topPerformingVehicles,
      engagement_metrics: engagementMetrics,
      vehicle_performance: vehiclePerformance,
    };

    return NextResponse.json({
      success: true,
      analytics,
    } as VendorAnalyticsResponse);
  } catch (error) {
    console.error("Error in vendor analytics API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
