import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { VehicleCard } from "@/components/resultados/VehicleCard";
import { VehicleListCard } from "@/components/resultados/VehicleListCard";
import { vehicles, staticVehicleToVehicle } from "@/data/vehicles";

// next/navigation is mocked in __tests__/setup.ts

describe("Vehicle cards", () => {
  const sampleVehicle = staticVehicleToVehicle(
    vehicles.find((v) => v.images.length > 0) ?? vehicles[0]
  );

  // Create a Pro vendor version for testing
  const proVehicle = {
    ...sampleVehicle,
    vendor: {
      ...sampleVehicle.vendor,
      isPro: true,
    },
  };

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

  // ========================================
  // PRO VENDOR BADGE TESTS
  // ========================================

  describe("Pro Vendor Badges", () => {
    it("does NOT show verified badge for non-Pro vendors in VehicleListCard", () => {
      render(<VehicleListCard vehicle={sampleVehicle} />);

      // Should NOT find "Verificado Pro" text
      expect(screen.queryByText("Verificado")).not.toBeInTheDocument();
    });

    it("does NOT show respuesta rapida badge for non-Pro vendors in VehicleListCard", () => {
      render(<VehicleListCard vehicle={sampleVehicle} />);

      // Should NOT find "Respuesta Rápida" text
      expect(screen.queryByText("Respuesta Rápida")).not.toBeInTheDocument();
    });

    it("shows verified badge for Pro vendors in VehicleListCard", () => {
      render(<VehicleListCard vehicle={proVehicle} />);

      // Should find "Verificado Pro" badge
      expect(screen.getByText("Verificado")).toBeInTheDocument();
    });

    it("shows respuesta rapida badge for Pro vendors in VehicleListCard", () => {
      render(<VehicleListCard vehicle={proVehicle} />);

      // Should find "Respuesta Rápida" badge
      expect(screen.getByText("Respuesta Rápida")).toBeInTheDocument();
    });

    it("does NOT show verified badge for non-Pro vendors in VehicleCard", () => {
      render(<VehicleCard vehicle={sampleVehicle} />);

      // Should NOT find "Verificado Pro" text
      expect(screen.queryByText("Verificado")).not.toBeInTheDocument();
    });

    it("does NOT show respuesta rapida badge for non-Pro vendors in VehicleCard", () => {
      render(<VehicleCard vehicle={sampleVehicle} />);

      // Should NOT find "Respuesta Rápida" text
      expect(screen.queryByText("Respuesta Rápida")).not.toBeInTheDocument();
    });

    it("shows verified badge for Pro vendors in VehicleCard", () => {
      render(<VehicleCard vehicle={proVehicle} />);

      // Should find "Verificado Pro" badge
      expect(screen.getByText("Verificado")).toBeInTheDocument();
    });

    it("shows respuesta rapida badge for Pro vendors in VehicleCard", () => {
      render(<VehicleCard vehicle={proVehicle} />);

      // Should find "Respuesta Rápida" badge
      expect(screen.getByText("Respuesta Rápida")).toBeInTheDocument();
    });

    it("renders ProCardBorder wrapper for Pro vendors", () => {
      const { container } = render(<VehicleListCard vehicle={proVehicle} />);

      // Check for the pro-card-wrapper class
      const proWrapper = container.querySelector(".pro-card-wrapper");
      expect(proWrapper).toBeInTheDocument();
    });

    it("does NOT render ProCardBorder wrapper for non-Pro vendors", () => {
      const { container } = render(<VehicleListCard vehicle={sampleVehicle} />);

      // Should NOT have the pro-card-wrapper class
      const proWrapper = container.querySelector(".pro-card-wrapper");
      expect(proWrapper).not.toBeInTheDocument();
    });

    it("shows both badges together for Pro vendors", () => {
      render(<VehicleListCard vehicle={proVehicle} />);

      // Both badges should be present
      expect(screen.getByText("Verificado")).toBeInTheDocument();
      expect(screen.getByText("Respuesta Rápida")).toBeInTheDocument();
    });
  });
});
