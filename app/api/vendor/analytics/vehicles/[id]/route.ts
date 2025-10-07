import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { VehicleAnalytics } from "@/types";

interface ViewRecord {
  viewed_at: string;
}

interface FavoriteRecord {
  created_at: string;
}

interface InquiryRecord {
  created_at: string;
}

/**
 * GET /api/vendor/analytics/vehicles/[id]
 * Get detailed analytics for a specific vehicle
 */
type Params = { id: string };
type RouteContext = { params: Params } | { params: Promise<Params> };

function isPromise<T>(value: unknown): value is Promise<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { then?: unknown }).then === "function"
  );
}

export async function GET(request: NextRequest, context: RouteContext) {
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

    // Verify vehicle belongs to this vendor
    const { data: vehicle, error: vehicleError } = await serviceSupabase
      .from("vehicles")
      .select("id, name, vendor_id, created_at")
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

    // Get date range from query params (default to last 30 days)
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get("days") || "30");
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split("T")[0];

    // Get all analytics data for this vehicle
    const [
      viewsResult,
      favoritesResult,
      inquiriesResult,
      testDrivesResult,
      priceAlertsResult,
      reviewsResult,
    ] = await Promise.all([
      // Views
      serviceSupabase
        .from("vehicle_views")
        .select("id, customer_id, viewed_at, view_duration")
        .eq("vehicle_id", vehicleId)
        .gte("viewed_at", `${startDateStr}T00:00:00.000Z`),

      // Favorites
      serviceSupabase
        .from("customer_favorites")
        .select("id, customer_id, created_at")
        .eq("vehicle_id", vehicleId)
        .gte("created_at", `${startDateStr}T00:00:00.000Z`),

      // Inquiries
      serviceSupabase
        .from("customer_inquiries")
        .select("id, customer_id, created_at, status")
        .eq("vehicle_id", vehicleId)
        .gte("created_at", `${startDateStr}T00:00:00.000Z`),

      // Test drives
      serviceSupabase
        .from("test_drive_bookings")
        .select("id, customer_id, created_at, status")
        .eq("vehicle_id", vehicleId)
        .gte("created_at", `${startDateStr}T00:00:00.000Z`),

      // Price alerts
      serviceSupabase
        .from("price_alerts")
        .select("id, customer_id, created_at, target_price, is_active")
        .eq("vehicle_id", vehicleId)
        .gte("created_at", `${startDateStr}T00:00:00.000Z`),

      // Reviews
      serviceSupabase
        .from("reviews")
        .select("id, customer_id, rating, created_at")
        .eq("vehicle_id", vehicleId),
    ]);

    const views = viewsResult.data || [];
    const favorites = favoritesResult.data || [];
    const inquiries = inquiriesResult.data || [];
    const testDrives = testDrivesResult.data || [];
    const priceAlerts = priceAlertsResult.data || [];
    const reviews = reviewsResult.data || [];

    // Calculate metrics
    const totalViews = views.length;
    const uniqueViewers = new Set(
      views.map((v) => v.customer_id).filter(Boolean)
    ).size;
    const favoritesCount = favorites.length;
    const inquiriesCount = inquiries.length;
    const testDrivesCount = testDrives.length;
    const priceAlertsCount = priceAlerts.length;
    const conversionRate =
      totalViews > 0 ? (inquiriesCount / totalViews) * 100 : 0;

    // Calculate average view duration
    const validDurations = views.filter(
      (v) => v.view_duration && v.view_duration > 0
    );
    const averageViewDuration =
      validDurations.length > 0
        ? validDurations.reduce((sum, v) => sum + (v.view_duration || 0), 0) /
          validDurations.length
        : 0;

    // Calculate average rating
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    // Group by status for inquiries and test drives
    const inquiriesByStatus = inquiries.reduce((acc, inquiry) => {
      acc[inquiry.status] = (acc[inquiry.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const testDrivesByStatus = testDrives.reduce((acc, testDrive) => {
      acc[testDrive.status] = (acc[testDrive.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group by day for trends
    const viewsByDay = groupByDay(views, "viewed_at");
    const favoritesByDay = groupByDay(favorites, "created_at");
    const inquiriesByDay = groupByDay(inquiries, "created_at");

    const analytics: VehicleAnalytics & {
      average_view_duration: number;
      average_rating: number;
      total_reviews: number;
      inquiries_by_status: Record<string, number>;
      test_drives_by_status: Record<string, number>;
      trends: {
        views_by_day: { date: string; count: number }[];
        favorites_by_day: { date: string; count: number }[];
        inquiries_by_day: { date: string; count: number }[];
      };
    } = {
      vehicle_id: vehicleId,
      vehicle_name: vehicle.name,
      total_views: totalViews,
      unique_viewers: uniqueViewers,
      favorites_count: favoritesCount,
      inquiries_count: inquiriesCount,
      test_drives_count: testDrivesCount,
      price_alerts_count: priceAlertsCount,
      conversion_rate: Math.round(conversionRate * 100) / 100,
      average_view_duration: Math.round(averageViewDuration),
      average_rating: Math.round(averageRating * 100) / 100,
      total_reviews: reviews.length,
      inquiries_by_status: inquiriesByStatus,
      test_drives_by_status: testDrivesByStatus,
      trends: {
        views_by_day: viewsByDay,
        favorites_by_day: favoritesByDay,
        inquiries_by_day: inquiriesByDay,
      },
    };

    return NextResponse.json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error("Error in vehicle analytics API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to group data by day
function groupByDay(
  data: ViewRecord[] | FavoriteRecord[] | InquiryRecord[],
  dateField: string
) {
  const grouped = data.reduce((acc, item) => {
    const dateValue =
      dateField === "viewed_at"
        ? (item as ViewRecord).viewed_at
        : (item as FavoriteRecord | InquiryRecord).created_at;
    const date = new Date(dateValue).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(grouped)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
