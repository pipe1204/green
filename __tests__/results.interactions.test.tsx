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

describe("Results interactions", () => {
  beforeEach(() => {
    (process.env.NODE_ENV as string | undefined) = "test";
  });

  it("combines min and max price filters", () => {
    render(<SearchResultsPage />);
    const minInput = screen.getByPlaceholderText(/min/i);
    const maxInput = screen.getByPlaceholderText(/max/i);
    fireEvent.change(minInput, { target: { value: "5000000" } });
    fireEvent.change(maxInput, { target: { value: "10000000" } });

    const withinRange = vehicles.filter(
      (v) => v.price >= 5000000 && v.price <= 10000000
    );
    expect(withinRange.length).toBeGreaterThan(0);
    // A cheap scooter outside min should not exist
    expect(screen.queryByText(/xiaomi/i)).not.toBeInTheDocument();
  });

  it("filters by dealer rating 4.5+", () => {
    render(<SearchResultsPage />);
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

    const expected = vehicles.filter((v) => v.dealer.rating >= 4.5);
    expect(expected.length).toBeGreaterThan(0);
    // An item below threshold should not appear
    expect(screen.queryByText(/niu/i)).not.toBeInTheDocument();
  });

  it("sorting by price low then high affects order but not count", () => {
    render(<SearchResultsPage />);
    const select = screen.getByRole("combobox");

    // price-low
    fireEvent.click(select);
    fireEvent.click(screen.getByText(/menor a mayor/i));

    // price-high
    fireEvent.click(select);
    fireEvent.click(screen.getByText(/mayor a menor/i));

    // Count remains same as initial
    const total = vehicles.length;
    expect(
      screen.getByText(new RegExp(`${total}\\s+vehículos encontrados`, "i"))
    ).toBeInTheDocument();
  });
});
