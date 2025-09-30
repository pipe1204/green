import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { VehicleCard } from "@/components/resultados/VehicleCard";
import { VehicleListCard } from "@/components/resultados/VehicleListCard";
import { vehicles } from "@/data/vehicles";

// next/navigation is mocked in __tests__/setup.ts

describe("Vehicle cards", () => {
  const sampleVehicle =
    vehicles.find((v) => v.images.length > 0) ?? vehicles[0];

  it("renders VehicleListCard with name, type next to name, location and price", () => {
    render(<VehicleListCard vehicle={sampleVehicle} />);

    // Name (possibly truncated) should appear
    expect(
      screen.getByText(sampleVehicle.name.substring(0, 5), { exact: false })
    ).toBeInTheDocument();

    // Type shown near name (same small gray style, but we just check text)
    const typeText =
      sampleVehicle.type === "motocicleta"
        ? "Motocicleta"
        : sampleVehicle.type === "bicicleta"
        ? "Bicicleta"
        : sampleVehicle.type === "carro"
        ? "Carro"
        : sampleVehicle.type === "camion"
        ? "Camión"
        : "Patineta";
    expect(screen.getAllByText(typeText)[0]).toBeInTheDocument();

    // Location
    expect(screen.getByText(sampleVehicle.location)).toBeInTheDocument();

    // Buttons
    expect(
      screen.getByRole("button", { name: /ver detalles/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /agenda una prueba/i })
    ).toBeInTheDocument();
  });

  it("disables 'Ver Detalles' after click and shows loader state (list)", async () => {
    render(<VehicleListCard vehicle={sampleVehicle} />);

    const btn = screen.getByRole("button", { name: /ver detalles/i });
    fireEvent.click(btn);
    // Button becomes disabled and shows loading text
    expect(btn).toBeDisabled();
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  it("renders VehicleCard (grid) with type next to name and location below", () => {
    render(<VehicleCard vehicle={sampleVehicle} />);

    // Name
    expect(
      screen.getByText(sampleVehicle.name.substring(0, 5), { exact: false })
    ).toBeInTheDocument();

    // Type next to name
    const typeText =
      sampleVehicle.type === "motocicleta"
        ? "Motocicleta"
        : sampleVehicle.type === "bicicleta"
        ? "Bicicleta"
        : sampleVehicle.type === "carro"
        ? "Carro"
        : sampleVehicle.type === "camion"
        ? "Camión"
        : "Patineta";
    expect(screen.getAllByText(typeText)[0]).toBeInTheDocument();

    // Location should be present as well
    expect(screen.getByText(sampleVehicle.location)).toBeInTheDocument();

    // Action buttons exist
    expect(
      screen.getByRole("button", { name: /ver detalles/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /agenda una prueba/i })
    ).toBeInTheDocument();
  });
});
