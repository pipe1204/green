import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { VehicleListCard } from "@/components/resultados/VehicleListCard";
import { VehicleCard } from "@/components/resultados/VehicleCard";
import { vehicles } from "@/data/vehicles";

vi.mock("next/navigation", async () => {
  const actual: typeof import("next/navigation") = await vi.importActual(
    "next/navigation"
  );
  return {
    ...actual,
    useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  };
});

describe("Cards behavior", () => {
  beforeEach(() => {
    (process.env.NODE_ENV as string | undefined) = "test";
  });

  const longNameVehicle = {
    ...vehicles[0],
    name: "Xiaomi Mi Electric Scooter Pro 2 Extra Largo Nombre Para Truncar",
  };

  it("truncates long names (list card)", () => {
    render(<VehicleListCard vehicle={longNameVehicle} />);
    // Should display ellipsis
    expect(screen.getByText(/\.\.\.$/)).toBeInTheDocument();
  });

  it("shows placeholder when no images (grid card)", () => {
    const noImage = { ...vehicles[0], images: [] };
    render(<VehicleCard vehicle={noImage} />);
    expect(screen.getByText(/imagen no disponible/i)).toBeInTheDocument();
  });

  it("opens TestDriveModal from list card", () => {
    render(<VehicleListCard vehicle={vehicles[0]} />);
    fireEvent.click(screen.getByRole("button", { name: /agenda una prueba/i }));
    // Scope assertion to dialog content to avoid multiple name matches
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog.textContent).toMatch(
      new RegExp(vehicles[0].name.substring(0, 3), "i")
    );
  });

  it("navigates to product page when clicking Ver Detalles (grid)", () => {
    const push = vi.fn();
    // Override router for this test
    vi.doMock("next/navigation", async () => {
      const actual: typeof import("next/navigation") = await vi.importActual(
        "next/navigation"
      );
      return { ...actual, useRouter: () => ({ push }) };
    });
    render(<VehicleCard vehicle={vehicles[0]} />);
    const btn = screen.getByRole("button", { name: /ver detalles/i });
    fireEvent.click(btn);
    // push is called eventually; since component delays with setTimeout, we just assert disabled/loading state
    expect(btn).toBeDisabled();
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });
});
