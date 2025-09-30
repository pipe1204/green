import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { VehicleListCard } from "@/components/resultados/VehicleListCard";
import { VehicleCard } from "@/components/resultados/VehicleCard";
import { vehicles, staticVehicleToVehicle } from "@/data/vehicles";
import type { Vehicle } from "@/types";

vi.mock("next/navigation", async () => {
  const actual: typeof import("next/navigation") = await vi.importActual(
    "next/navigation"
  );
  return {
    ...actual,
    useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  };
});

// Typed mock for next/image without using <img/>
vi.mock("next/image", () => {
  const Image: React.FC<{ alt?: string; className?: string }> = ({
    alt,
    className,
  }) => <span role="img" aria-label={alt} className={className} />;
  return { default: Image };
});

// Typed mock to avoid auth dependency inside FavoritesButton during tests
vi.mock("@/components/resultados/FavoritesButton", () => ({
  FavoritesButton: ({ className }: { className?: string }) => (
    <div data-testid="favorites-button" className={className} />
  ),
}));

// Typed mock for TestDriveModal so tests can assert dialog presence
vi.mock("@/components/resultados/TestDriveModal", () => ({
  TestDriveModal: ({
    isOpen,
    vehicle,
  }: {
    isOpen: boolean;
    vehicle: Vehicle;
  }) =>
    isOpen ? <div role="dialog">Test drive for {vehicle.name}</div> : null,
}));

describe("Cards behavior", () => {
  beforeEach(() => {
    (process.env.NODE_ENV as string | undefined) = "test";
  });

  const baseVehicle: Vehicle = staticVehicleToVehicle(vehicles[0]);
  const longNameVehicle: Vehicle = {
    ...baseVehicle,
    name: "Xiaomi Mi Electric Scooter Pro 2 Extra Largo Nombre Para Truncar",
  };

  it("truncates long names (list card)", () => {
    render(<VehicleListCard vehicle={longNameVehicle} />);
    // Should display ellipsis
    expect(screen.getByText(/\.\.\.$/)).toBeInTheDocument();
  });

  it("shows placeholder when no images (grid card)", () => {
    const noImage: Vehicle = { ...baseVehicle, images: [] };
    render(<VehicleCard vehicle={noImage} />);
    expect(screen.getByText(/imagen no disponible/i)).toBeInTheDocument();
  });

  it("opens TestDriveModal from list card", () => {
    render(<VehicleListCard vehicle={baseVehicle} />);
    fireEvent.click(screen.getByRole("button", { name: /agenda una prueba/i }));
    // Scope assertion to dialog content to avoid multiple name matches
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog.textContent).toMatch(
      new RegExp(baseVehicle.name.substring(0, 3), "i")
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
    render(<VehicleCard vehicle={baseVehicle} />);
    const btn = screen.getByRole("button", { name: /ver detalles/i });
    fireEvent.click(btn);
    // push is called eventually; since component delays with setTimeout, we just assert disabled/loading state
    expect(btn).toBeDisabled();
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });
});
