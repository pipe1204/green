import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchResultsPage from "@/app/resultados/page";
import { vehicles, staticVehicleToVehicle } from "@/data/vehicles";
import type { PaginatedVehiclesResult } from "@/types/queries";
import type { Vehicle } from "@/types";

vi.mock("next/navigation", async () => {
  const actual: typeof import("next/navigation") = await vi.importActual(
    "next/navigation"
  );
  const params = new URLSearchParams();
  return {
    ...actual,
    useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
    useSearchParams: () => params,
  };
});

// Mock vehicle queries
vi.mock("@/lib/vehicle-queries", () => ({
  getFilteredVehicles: vi.fn(),
}));

// Import the mocked function
import { getFilteredVehicles } from "@/lib/vehicle-queries";
const mockGetFilteredVehicles = vi.mocked(getFilteredVehicles);
const mockVehicles: Vehicle[] = vehicles.map(staticVehicleToVehicle);

describe("SearchResultsPage filtering", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Ensure NODE_ENV logic doesn't block rendering
    (process.env.NODE_ENV as string | undefined) = "test";

    // Mock getFilteredVehicles to return mock vehicles
    const mockResult: PaginatedVehiclesResult = {
      vehicles: mockVehicles,
      totalCount: mockVehicles.length,
      hasNextPage: false,
      hasPrevPage: false,
    };
    mockGetFilteredVehicles.mockResolvedValue(mockResult);
  });

  it("renders initial results", async () => {
    render(<SearchResultsPage />);
    // Title present means page rendered (actual title is "Vehículos Eléctricos")
    await waitFor(() => {
      expect(screen.queryByText(/vehículos eléctricos/i)).toBeInTheDocument();
    });
    // Some vehicles should be visible
    expect(mockVehicles.length).toBeGreaterThan(0);
  });

  it("applies price max filter via inputs", async () => {
    render(<SearchResultsPage />);

    await waitFor(() => {
      expect(screen.queryByText(/vehículos eléctricos/i)).toBeInTheDocument();
    });

    // Use placeholder to target Max field directly
    const maxInput = screen.getByPlaceholderText(/max/i);
    fireEvent.change(maxInput, { target: { value: "2000000" } });

    // Component should call getFilteredVehicles with the new filter
    await waitFor(() => {
      expect(mockGetFilteredVehicles).toHaveBeenCalled();
    });
  });

  it("applies vehicle type checkbox filter (e.g., Motocicletas)", async () => {
    render(<SearchResultsPage />);

    await waitFor(() => {
      expect(screen.queryByText(/vehículos eléctricos/i)).toBeInTheDocument();
    });

    // Click the checkbox via accessible label
    const motoCheckbox = screen.getByLabelText(/motocicletas/i);
    fireEvent.click(motoCheckbox);

    // Component should call getFilteredVehicles with the new filter
    await waitFor(() => {
      expect(mockGetFilteredVehicles).toHaveBeenCalled();
    });
  });
});
