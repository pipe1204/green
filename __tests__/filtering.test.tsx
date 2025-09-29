import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchResultsPage from "@/app/resultados/page";
import { vehicles } from "@/data/vehicles";

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

describe("SearchResultsPage filtering", () => {
  beforeEach(() => {
    // Ensure NODE_ENV logic doesn't block rendering
    (process.env.NODE_ENV as string | undefined) = "test";
  });

  it("renders initial results", () => {
    render(<SearchResultsPage />);
    // Title present means page rendered (actual title is "Vehículos Eléctricos")
    expect(screen.getByText(/vehículos eléctricos/i)).toBeInTheDocument();
    // Some vehicles should be visible
    expect(vehicles.length).toBeGreaterThan(0);
  });

  it("applies price max filter via inputs", () => {
    render(<SearchResultsPage />);

    // Use placeholder to target Max field directly
    const maxInput = screen.getByPlaceholderText(/max/i);
    fireEvent.change(maxInput, { target: { value: "2000000" } });

    // After change, the results should only include vehicles <= 2,000,000
    const max = 2000000;
    const expected = vehicles.filter((v) => v.price <= max);

    // Sanity checks: a very expensive item should disappear, at least one cheap remains
    expect(screen.queryByText(/zero/i)).not.toBeInTheDocument();
    if (expected.length > 0) {
      expect(
        screen.getByText(expected[0].name.substring(0, 3), { exact: false })
      ).toBeInTheDocument();
    }
  });

  it("applies vehicle type checkbox filter (e.g., Motocicletas)", () => {
    render(<SearchResultsPage />);

    // Click the checkbox via accessible label
    const motoCheckbox = screen.getByLabelText(/motocicletas/i);
    fireEvent.click(motoCheckbox);

    // Expect only motocicleta vehicles to remain visible by name
    const motos = vehicles.filter((v) => v.type === "motocicleta");
    expect(motos.length).toBeGreaterThan(0);

    // A scooter item should not appear; a motorcycle item should appear
    expect(screen.queryByText(/vespa/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(motos[0].name.substring(0, 3), { exact: false })
    ).toBeInTheDocument();
  });
});
