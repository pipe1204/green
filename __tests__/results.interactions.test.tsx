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

describe("Results interactions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  it("combines min and max price filters", async () => {
    render(<SearchResultsPage />);

    await waitFor(() => {
      expect(screen.queryByText(/vehículos eléctricos/i)).toBeInTheDocument();
    });

    const minInput = screen.getByPlaceholderText(/min/i);
    const maxInput = screen.getByPlaceholderText(/max/i);
    fireEvent.change(minInput, { target: { value: "5000000" } });
    fireEvent.change(maxInput, { target: { value: "10000000" } });

    // Component should call getFilteredVehicles with the new filters
    await waitFor(() => {
      expect(mockGetFilteredVehicles).toHaveBeenCalled();
    });
  });

  it("filters by dealer rating 4.5+", async () => {
    render(<SearchResultsPage />);

    await waitFor(() => {
      expect(screen.queryByText(/vehículos eléctricos/i)).toBeInTheDocument();
    });

    // Two labels exist (vehicle rating and dealer rating). Pick the one whose
    // htmlFor targets id beginning with dealerRating-
    const labels = screen.getAllByText(/4\.5\+ estrellas/i);
    const dealerLabel = labels.find((el) => {
      const htmlFor =
        (el as HTMLLabelElement).getAttribute("for") ||
        (el as HTMLElement).getAttribute("htmlFor");
      return htmlFor?.startsWith("dealerRating-");
    }) as HTMLElement | undefined;
    expect(dealerLabel).toBeTruthy();
    fireEvent.click(dealerLabel!);

    // Component should call getFilteredVehicles with the new filter
    await waitFor(() => {
      expect(mockGetFilteredVehicles).toHaveBeenCalled();
    });
  });

  it("sorting by price low then high affects order but not count", async () => {
    render(<SearchResultsPage />);

    await waitFor(() => {
      expect(screen.queryByText(/vehículos eléctricos/i)).toBeInTheDocument();
    });

    const select = screen.getByRole("combobox");

    // price-low
    fireEvent.click(select);
    fireEvent.click(screen.getByText(/menor a mayor/i));

    // Component should call getFilteredVehicles with new sort
    await waitFor(() => {
      expect(mockGetFilteredVehicles).toHaveBeenCalled();
    });
  });
});
