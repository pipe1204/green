import { supabase } from "@/lib/supabase";
import { databaseToVehicle } from "@/lib/database-mapping";
import { Vehicle, SearchFilters } from "@/types";
import { DbVehicleRow, PaginatedVehiclesResult } from "@/types/queries";

/**
 * Get all vehicles from the database (no filters, no pagination)
 * Useful for initial data loading or simple lists
 */
export async function getAllVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all vehicles:", error);
    throw new Error("No se pudieron cargar los vehículos");
  }

  return (data || []).map(databaseToVehicle);
}

/**
 * Get a single vehicle by ID
 * Returns null if vehicle not found
 */
export async function getVehicleById(id: string): Promise<Vehicle | null> {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Not found error
      return null;
    }
    console.error("Error fetching vehicle by ID:", error);
    throw new Error("No se pudo cargar el vehículo");
  }

  if (!data) return null;

  return databaseToVehicle(data);
}

/**
 * Get vehicles by multiple IDs
 * Useful for comparison features
 */
export async function getVehiclesByIds(ids: string[]): Promise<Vehicle[]> {
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .in("id", ids);

  if (error) {
    console.error("Error fetching vehicles by IDs:", error);
    throw new Error("No se pudieron cargar los vehículos");
  }

  return (data || []).map((row) =>
    databaseToVehicle(row as unknown as DbVehicleRow)
  );
}

/**
 * Build Supabase query with server-side filters
 * Handles simple filters that can be done at database level
 */
function buildVehicleQuery(
  filters: SearchFilters,
  sortBy: string,
  page: number = 0,
  pageSize: number = 20
) {
  let query = supabase.from("vehicles").select("*", { count: "exact" });

  // Filter by vehicle type
  if (filters.vehicleType.length > 0) {
    query = query.in("type", filters.vehicleType);
  }

  // Filter by brand
  if (filters.brands.length > 0) {
    query = query.in("brand", filters.brands);
  }

  // Filter by location
  if (filters.location.length > 0) {
    query = query.in("location", filters.location);
  }

  // Filter by availability
  if (filters.availability.length > 0) {
    query = query.in("availability", filters.availability);
  }

  // Filter by price range
  if (filters.priceMin > 0) {
    query = query.gte("price", filters.priceMin);
  }
  if (filters.priceMax > 0) {
    query = query.lte("price", filters.priceMax);
  }

  // Apply sorting
  switch (sortBy) {
    case "price-low":
      query = query.order("price", { ascending: true });
      break;
    case "price-high":
      query = query.order("price", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "relevance":
    default:
      // Default to newest for relevance
      query = query.order("created_at", { ascending: false });
      break;
  }

  // Apply pagination
  const from = page * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  return query;
}

/**
 * Apply client-side filters for complex JSONB fields
 * These are harder to filter at database level efficiently
 */
function applyClientSideFilters(
  vehicles: Vehicle[],
  filters: SearchFilters
): Vehicle[] {
  let filtered = [...vehicles];

  // Filter by review rating
  if (filters.reviews.length > 0) {
    filtered = filtered.filter((v) => {
      return filters.reviews.some((rating) => {
        const minRating = parseFloat(rating.replace("+", ""));
        return v.reviews.average >= minRating;
      });
    });
  }

  // Filter by dealer rating
  if (filters.dealerRating.length > 0) {
    filtered = filtered.filter((v) => {
      return filters.dealerRating.some((rating) => {
        const minRating = parseFloat(rating.replace("+", ""));
        return v.dealer.rating >= minRating;
      });
    });
  }

  // Filter by battery range
  if (filters.batteryRange.length > 0) {
    filtered = filtered.filter((v) => {
      const range = parseInt(v.specifications.range);
      return filters.batteryRange.some((batteryRange) => {
        const [minRange, maxRangeStr] = batteryRange.split("-");
        const minRangeNum = Number(minRange);

        if (maxRangeStr && maxRangeStr !== "+") {
          const maxRangeNum = Number(maxRangeStr);
          return range >= minRangeNum && range <= maxRangeNum;
        } else {
          // Handle "300+" case
          return range >= minRangeNum;
        }
      });
    });
  }

  // Filter by passenger capacity
  if (filters.passengerCapacity.length > 0) {
    filtered = filtered.filter((v) => {
      return filters.passengerCapacity.some((capacity) => {
        if (capacity === "5+") {
          return v.passengerCapacity >= 5;
        }
        return v.passengerCapacity === parseInt(capacity);
      });
    });
  }

  // Filter by charging time
  if (filters.chargingTime.length > 0) {
    filtered = filtered.filter((v) => {
      const chargingTime = parseFloat(v.chargingTime);
      return filters.chargingTime.some((timeRange) => {
        if (timeRange === "8+") {
          return chargingTime >= 8;
        }
        const [min, max] = timeRange.split("-").map(Number);
        return chargingTime >= min && chargingTime <= max;
      });
    });
  }

  // Filter by max speed
  if (filters.maxSpeed.length > 0) {
    filtered = filtered.filter((v) => {
      const maxSpeed = parseInt(v.maxSpeed);
      return filters.maxSpeed.some((speedRange) => {
        if (speedRange === "100+") {
          return maxSpeed >= 100;
        }
        const [min, max] = speedRange.split("-").map(Number);
        return maxSpeed >= min && maxSpeed <= max;
      });
    });
  }

  // Filter by power
  if (filters.power.length > 0) {
    filtered = filtered.filter((v) => {
      const power = parseFloat(v.power);
      return filters.power.some((powerRange) => {
        if (powerRange === "5000+") {
          return power >= 5000;
        }
        const [min, max] = powerRange.split("-").map(Number);
        return power >= min && power <= max;
      });
    });
  }

  // Filter by warranty (years or km)
  if (filters.warranty.length > 0) {
    filtered = filtered.filter((v) => {
      const warrantyStr = v.specifications.warranty;

      return filters.warranty.some((warrantyFilter) => {
        // Format: "years:2+" or "km:50000+"
        const [unit, minValueStr] = warrantyFilter.split(":");
        const minValue = parseInt(minValueStr.replace("+", ""));

        if (unit === "years") {
          // Extract years from warranty string like "2 años"
          const yearsMatch = warrantyStr.match(/(\d+)\s*año/);
          if (yearsMatch) {
            return parseInt(yearsMatch[1]) >= minValue;
          }
        } else if (unit === "km") {
          // Extract km from warranty string like "50000 km"
          const kmMatch = warrantyStr.match(/(\d+)\s*km/);
          if (kmMatch) {
            return parseInt(kmMatch[1]) >= minValue;
          }
        }

        return false;
      });
    });
  }

  return filtered;
}

/**
 * Apply client-side sorting for complex fields
 * Used when server-side sorting isn't available
 */
function applyClientSideSorting(
  vehicles: Vehicle[],
  sortBy: string
): Vehicle[] {
  const sorted = [...vehicles];

  switch (sortBy) {
    case "rating":
      return sorted.sort((a, b) => b.reviews.average - a.reviews.average);
    case "range":
      return sorted.sort(
        (a, b) =>
          parseInt(b.specifications.range) - parseInt(a.specifications.range)
      );
    default:
      return sorted;
  }
}

/**
 * Get filtered and paginated vehicles
 * Combines server-side and client-side filtering for best performance
 */
export async function getFilteredVehicles(
  filters: SearchFilters,
  sortBy: string,
  page: number = 0,
  pageSize: number = 20
): Promise<PaginatedVehiclesResult> {
  try {
    // Step 1: Apply server-side filters and fetch data
    const query = buildVehicleQuery(filters, sortBy, 0, 1000); // Fetch more for client-side filtering
    const { data, error } = await query;

    if (error) {
      console.error("Error fetching filtered vehicles:", error);
      throw new Error("No se pudieron cargar los vehículos");
    }

    // Step 2: Convert to Vehicle objects (with proper type assertion for enum handling)
    let vehicles = (data || []).map((row) =>
      databaseToVehicle(row as unknown as DbVehicleRow)
    );

    // Step 3: Apply client-side filters (complex JSONB queries)
    vehicles = applyClientSideFilters(vehicles, filters);

    // Step 4: Apply client-side sorting if needed (rating, range)
    if (sortBy === "rating" || sortBy === "range") {
      vehicles = applyClientSideSorting(vehicles, sortBy);
    }

    // Step 5: Apply pagination to filtered results
    const totalFilteredCount = vehicles.length;
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedVehicles = vehicles.slice(startIndex, endIndex);

    return {
      vehicles: paginatedVehicles,
      totalCount: totalFilteredCount,
      hasNextPage: endIndex < totalFilteredCount,
      hasPrevPage: page > 0,
    };
  } catch (error) {
    console.error("Error in getFilteredVehicles:", error);
    throw error;
  }
}

/**
 * Get featured vehicles for home page
 * Returns most recent, high-rated vehicles
 */
export async function getFeaturedVehicles(
  limit: number = 6
): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("availability", "in-stock")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured vehicles:", error);
    // Return empty array instead of throwing to not break homepage
    return [];
  }

  return (data || []).map((row) =>
    databaseToVehicle(row as unknown as DbVehicleRow)
  );
}

/**
 * Search vehicles by text query
 * Searches in name, brand, and description
 */
export async function searchVehicles(
  searchQuery: string,
  limit: number = 20
): Promise<Vehicle[]> {
  if (!searchQuery.trim()) {
    return getAllVehicles();
  }

  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .or(
      `name.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
    )
    .limit(limit);

  if (error) {
    console.error("Error searching vehicles:", error);
    throw new Error("Error en la búsqueda de vehículos");
  }

  return (data || []).map((row) =>
    databaseToVehicle(row as unknown as DbVehicleRow)
  );
}

/**
 * Get vehicle count by type
 * Useful for showing statistics
 */
export async function getVehicleCountByType(): Promise<Record<string, number>> {
  const { data, error } = await supabase.from("vehicles").select("type");

  if (error) {
    console.error("Error fetching vehicle count by type:", error);
    return {};
  }

  const counts: Record<string, number> = {};
  (data || []).forEach((item) => {
    const type = item.type;
    counts[type] = (counts[type] || 0) + 1;
  });

  return counts;
}
