import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { getFilteredVehicles, getAllVehicles } from "@/lib/vehicle-queries";
import { handleVehicleError } from "@/lib/error-handler";
import { Vehicle, SearchFilters } from "@/types";

const PAGE_SIZE = 20;

export function useVehicleSearch() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Vehicle[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("relevance");

  // Helper function to parse URL array parameters
  const parseArrayParam = (param: string | null): string[] => {
    if (!param) return [];
    return param.split(",").filter((v) => v.trim().length > 0);
  };

  // Initialize filters from URL params immediately (synchronously)
  const [filters, setFilters] = useState<SearchFilters>(() => {
    const searchFilters: SearchFilters = {
      vehicleType: parseArrayParam(searchParams.get("vehicleType")),
      batteryRange: parseArrayParam(searchParams.get("batteryRange")),
      warranty: parseArrayParam(searchParams.get("warranty")),
      priceMin: parseInt(searchParams.get("priceMin") || "0"),
      priceMax: parseInt(searchParams.get("priceMax") || "0"),
      location: parseArrayParam(searchParams.get("location")),
      reviews: parseArrayParam(searchParams.get("reviews")),
      dealerRating: parseArrayParam(searchParams.get("dealerRating")),
      availability: parseArrayParam(searchParams.get("availability")),
      passengerCapacity: parseArrayParam(searchParams.get("passengerCapacity")),
      chargingTime: parseArrayParam(searchParams.get("chargingTime")),
      maxSpeed: parseArrayParam(searchParams.get("maxSpeed")),
      power: parseArrayParam(searchParams.get("power")),
      brands: parseArrayParam(searchParams.get("brands")),
    };

    return searchFilters;
  });

  const [allVehiclesForCounts, setAllVehiclesForCounts] = useState<Vehicle[]>(
    []
  );

  // Update filters when searchParams change
  useEffect(() => {
    const searchFilters: SearchFilters = {
      vehicleType: parseArrayParam(searchParams.get("vehicleType")),
      batteryRange: parseArrayParam(searchParams.get("batteryRange")),
      warranty: parseArrayParam(searchParams.get("warranty")),
      priceMin: parseInt(searchParams.get("priceMin") || "0"),
      priceMax: parseInt(searchParams.get("priceMax") || "0"),
      location: parseArrayParam(searchParams.get("location")),
      reviews: parseArrayParam(searchParams.get("reviews")),
      dealerRating: parseArrayParam(searchParams.get("dealerRating")),
      availability: parseArrayParam(searchParams.get("availability")),
      passengerCapacity: parseArrayParam(searchParams.get("passengerCapacity")),
      chargingTime: parseArrayParam(searchParams.get("chargingTime")),
      maxSpeed: parseArrayParam(searchParams.get("maxSpeed")),
      power: parseArrayParam(searchParams.get("power")),
      brands: parseArrayParam(searchParams.get("brands")),
    };

    setFilters(searchFilters);
  }, [searchParams]);

  // Fetch vehicles from database
  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getFilteredVehicles(
        filters,
        sortBy,
        currentPage,
        PAGE_SIZE
      );

      setResults(result.vehicles);
      setTotalCount(result.totalCount);
      setHasNextPage(result.hasNextPage);
      setHasPrevPage(result.hasPrevPage);
    } catch (err) {
      setError(handleVehicleError(err));
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, currentPage]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Fetch all vehicles once for filter counts
  useEffect(() => {
    const fetchAllForCounts = async () => {
      try {
        const allVehicles = await getAllVehicles();
        setAllVehiclesForCounts(allVehicles);
      } catch (err) {
        console.error("Error fetching vehicles for counts:", err);
        setAllVehiclesForCounts([]);
      }
    };
    fetchAllForCounts();
  }, []);

  // Apply filters to a vehicle array (helper for cascading filters)
  const applyFiltersToVehicles = useCallback(
    (vehicles: Vehicle[], excludeFilterKey?: string): Vehicle[] => {
      let filtered = [...vehicles];

      // Apply vehicle type filter
      if (
        excludeFilterKey !== "vehicleType" &&
        filters.vehicleType.length > 0
      ) {
        filtered = filtered.filter((v) => filters.vehicleType.includes(v.type));
      }

      // Apply location filter
      if (excludeFilterKey !== "location" && filters.location.length > 0) {
        filtered = filtered.filter((v) =>
          filters.location.includes(v.location)
        );
      }

      // Apply availability filter
      if (
        excludeFilterKey !== "availability" &&
        filters.availability.length > 0
      ) {
        filtered = filtered.filter((v) =>
          filters.availability.includes(v.availability)
        );
      }

      // Apply price filter
      if (excludeFilterKey !== "priceRange") {
        if (filters.priceMin > 0) {
          filtered = filtered.filter((v) => v.price >= filters.priceMin);
        }
        if (filters.priceMax > 0) {
          filtered = filtered.filter((v) => v.price <= filters.priceMax);
        }
      }

      // Apply battery range filter
      if (
        excludeFilterKey !== "batteryRange" &&
        filters.batteryRange.length > 0
      ) {
        filtered = filtered.filter((v) => {
          const range = parseInt(v.specifications.range);
          return filters.batteryRange.some((batteryRange) => {
            const [min, maxStr] = batteryRange.split("-");
            const minNum = Number(min);
            if (maxStr && maxStr !== "+") {
              const maxNum = Number(maxStr);
              return range >= minNum && range <= maxNum;
            }
            return range >= minNum;
          });
        });
      }

      // Apply reviews filter
      if (excludeFilterKey !== "reviews" && filters.reviews.length > 0) {
        filtered = filtered.filter((v) => {
          return filters.reviews.some((rating) => {
            const minRating = parseFloat(rating.replace("+", ""));
            return v.reviews.average >= minRating;
          });
        });
      }

      // Apply dealer rating filter
      if (
        excludeFilterKey !== "dealerRating" &&
        filters.dealerRating.length > 0
      ) {
        filtered = filtered.filter((v) => {
          return filters.dealerRating.some((rating) => {
            const minRating = parseFloat(rating.replace("+", ""));
            return v.dealer.rating >= minRating;
          });
        });
      }

      // Apply charging time filter
      if (
        excludeFilterKey !== "chargingTime" &&
        filters.chargingTime.length > 0
      ) {
        filtered = filtered.filter((v) => {
          const chargingTime = parseFloat(v.chargingTime || "0");
          return filters.chargingTime.some((timeRange) => {
            if (timeRange === "8+") return chargingTime >= 8;
            const [min, max] = timeRange.split("-").map(Number);
            return chargingTime >= min && chargingTime <= max;
          });
        });
      }

      // Apply max speed filter
      if (excludeFilterKey !== "maxSpeed" && filters.maxSpeed.length > 0) {
        filtered = filtered.filter((v) => {
          const maxSpeed = parseInt(v.maxSpeed || "0");
          return filters.maxSpeed.some((speedRange) => {
            if (speedRange === "150+") return maxSpeed >= 150;
            const [min, max] = speedRange.split("-").map(Number);
            return maxSpeed >= min && maxSpeed <= max;
          });
        });
      }

      // Apply warranty filter
      if (excludeFilterKey !== "warranty" && filters.warranty.length > 0) {
        filtered = filtered.filter((v) => {
          const warrantyStr = v.specifications.warranty || "";
          return filters.warranty.some((warrantyFilter) => {
            const [unit, minValueStr] = warrantyFilter.split(":");
            const minValue = parseInt(minValueStr.replace("+", ""));

            if (unit === "years") {
              const yearsMatch = warrantyStr.match(/(\d+)\s*año/);
              if (yearsMatch) return parseInt(yearsMatch[1]) >= minValue;
            } else if (unit === "km") {
              const kmMatch = warrantyStr.match(/(\d+)\s*km/);
              if (kmMatch) return parseInt(kmMatch[1]) >= minValue;
            }
            return false;
          });
        });
      }

      return filtered;
    },
    [filters]
  );

  // Calculate dynamic filter counts (cascading - based on current filters)
  const getFilterCount = useCallback(
    (filterKey: string, filterValue: string): number => {
      if (allVehiclesForCounts.length === 0) return 0;

      // Apply all current filters EXCEPT the one we're counting
      const filteredVehicles = applyFiltersToVehicles(
        allVehiclesForCounts,
        filterKey
      );

      // Count how many vehicles match this specific filter value
      switch (filterKey) {
        case "vehicleType":
          return filteredVehicles.filter((v) => v.type === filterValue).length;

        case "location":
          return filteredVehicles.filter((v) => v.location === filterValue)
            .length;

        case "availability":
          return filteredVehicles.filter((v) => v.availability === filterValue)
            .length;

        case "batteryRange": {
          const [min, max] = filterValue.split("-").map(Number);
          return filteredVehicles.filter((v) => {
            const range = parseInt(v.specifications.range);
            return max ? range >= min && range <= max : range >= min;
          }).length;
        }

        case "reviews": {
          const minRating = parseFloat(filterValue.replace("+", ""));
          return filteredVehicles.filter((v) => v.reviews.average >= minRating)
            .length;
        }

        case "dealerRating": {
          const minRating = parseFloat(filterValue.replace("+", ""));
          return filteredVehicles.filter((v) => v.dealer.rating >= minRating)
            .length;
        }

        case "chargingTime": {
          if (filterValue === "8+") {
            return filteredVehicles.filter(
              (v) => parseFloat(v.specifications.chargeTime || "0") >= 8
            ).length;
          }
          const [min, max] = filterValue.split("-").map(Number);
          return filteredVehicles.filter((v) => {
            const time = parseFloat(v.specifications.chargeTime || "0");
            return time >= min && time <= max;
          }).length;
        }

        case "maxSpeed": {
          if (filterValue === "150+") {
            return filteredVehicles.filter(
              (v) =>
                parseInt(v.specifications.performance?.maxSpeed || "0") >= 150
            ).length;
          }
          const [min, max] = filterValue.split("-").map(Number);
          return filteredVehicles.filter((v) => {
            const speed = parseInt(
              v.specifications.performance?.maxSpeed || "0"
            );
            return speed >= min && speed <= max;
          }).length;
        }

        case "warranty": {
          const [unit, minValueStr] = filterValue.split(":");
          const minValue = parseInt(minValueStr.replace("+", ""));

          return filteredVehicles.filter((v) => {
            const warrantyStr = v.specifications.warranty || "";

            if (unit === "years") {
              const yearsMatch = warrantyStr.match(/(\d+)\s*año/);
              if (yearsMatch) {
                return parseInt(yearsMatch[1]) >= minValue;
              }
            } else if (unit === "km") {
              const kmMatch = warrantyStr.match(/(\d+)\s*km/);
              if (kmMatch) {
                return parseInt(kmMatch[1]) >= minValue;
              }
            }

            return false;
          }).length;
        }

        default:
          return 0;
      }
    },
    [allVehiclesForCounts, applyFiltersToVehicles]
  );

  const handleFilterChange = (
    filterKey: string,
    value: string,
    checked: boolean
  ) => {
    setCurrentPage(0); // Reset to first page when filters change
    setFilters((prev) => {
      const currentArray = prev[filterKey as keyof SearchFilters] as string[];
      if (Array.isArray(currentArray)) {
        if (checked) {
          return {
            ...prev,
            [filterKey]: [...currentArray, value],
          };
        } else {
          return {
            ...prev,
            [filterKey]: currentArray.filter((item) => item !== value),
          };
        }
      }
      return prev;
    });
  };

  const clearAllFilters = () => {
    setCurrentPage(0);
    setFilters({
      vehicleType: [],
      batteryRange: [],
      warranty: [],
      priceMin: 0,
      priceMax: 0,
      location: [],
      reviews: [],
      dealerRating: [],
      availability: [],
      passengerCapacity: [],
      chargingTime: [],
      maxSpeed: [],
      power: [],
      brands: [],
    });
  };

  const getActiveFiltersCount = (): number => {
    return Object.values(filters).reduce((count, filter) => {
      if (Array.isArray(filter)) {
        return count + filter.length;
      }
      return count;
    }, 0);
  };

  return {
    // State
    loading,
    results,
    totalCount,
    currentPage,
    hasNextPage,
    hasPrevPage,
    error,
    sortBy,
    filters,
    allVehiclesForCounts,

    // Actions
    setCurrentPage,
    setSortBy,
    setFilters,
    handleFilterChange,
    clearAllFilters,
    fetchVehicles,

    // Computed
    getFilterCount,
    getActiveFiltersCount,
  };
}
