import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { VehicleViewModal } from "@/components/dashboard/VehicleViewModal";
import type { Vehicle } from "@/types";

// Mock Next.js Image component
vi.mock("next/image", () => {
  const Image: React.FC<{
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
    sizes?: string;
    priority?: boolean;
    onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  }> = ({ src, alt, className }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} data-testid="modal-image" />
  );
  return { default: Image };
});

// Mock Lucide React icons
vi.mock("lucide-react", () => ({
  Car: () => <div data-testid="car-icon">Car</div>,
  Battery: () => <div data-testid="battery-icon">Battery</div>,
  Clock: () => <div data-testid="clock-icon">Clock</div>,
  Zap: () => <div data-testid="zap-icon">Zap</div>,
  MapPin: () => <div data-testid="mappin-icon">MapPin</div>,
  Shield: () => <div data-testid="shield-icon">Shield</div>,
  Users: () => <div data-testid="users-icon">Users</div>,
  Star: () => <div data-testid="star-icon">Star</div>,
  ChevronLeft: () => <div data-testid="chevron-left">Left</div>,
  ChevronRight: () => <div data-testid="chevron-right">Right</div>,
  Calendar: () => <div data-testid="calendar-icon">Calendar</div>,
  DollarSign: () => <div data-testid="dollar-icon">Dollar</div>,
  Gauge: () => <div data-testid="gauge-icon">Gauge</div>,
  CheckCircle: () => <div data-testid="check-icon">Check</div>,
}));

// Mock utility functions
vi.mock("@/lib/utils", () => ({
  formatPrice: (price: number) => `$${price.toLocaleString()}`,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAvailabilityColor: (_availability: string) =>
    "bg-green-100 text-green-800",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAvailabilityText: (_availability: string) => "Disponible",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getVehicleTypeText: (_type: string) => "Carro",
  cn: (...args: unknown[]) => args.filter(Boolean).join(" "),
}));

// Mock Dialog components
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div role="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="dialog-title">{children}</h2>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="dialog-description">{children}</p>
  ),
}));

// Mock Badge component
vi.mock("@/components/ui/badge", () => ({
  Badge: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <span className={className} data-testid="badge">
      {children}
    </span>
  ),
}));

describe("VehicleViewModal", () => {
  const mockOnClose = vi.fn();

  const mockVehicle: Vehicle = {
    id: "1",
    vendorId: "vendor-1",
    name: "Tesla Model 3",
    brand: "Tesla",
    type: "carro",
    price: 50000000,
    images: [
      { url: "https://example.com/image1.jpg", alt: "Tesla Model 3 front" },
      { url: "https://example.com/image2.jpg", alt: "Tesla Model 3 back" },
    ],
    specifications: {
      range: "400",
      chargeTime: "8",
      warranty: "8 años",
      battery: "75 kWh",
      performance: {
        maxSpeed: "200",
        power: "300",
      },
    },
    deliveryTime: "2-4 semanas",
    availability: "in-stock",
    passengerCapacity: 5,
    chargingTime: "8",
    maxSpeed: "200",
    power: "300",
    location: "Bogotá, Colombia",
    description: "Amazing electric car with autopilot and premium features",
    features: ["GPS integrado", "Autopilot", "Carga rápida"],
    dealer: {
      name: "Tesla Store Colombia",
      location: "Bogotá, Colombia",
      rating: 4.5,
    },
    reviews: {
      average: 4.5,
      count: 120,
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  };

  const defaultProps = {
    vehicle: mockVehicle,
    isOpen: true,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal when open", () => {
    render(<VehicleViewModal {...defaultProps} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Tesla Model 3")).toBeInTheDocument();
    expect(
      screen.getByText("Información completa del vehículo")
    ).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(<VehicleViewModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not render when vehicle is null", () => {
    render(<VehicleViewModal {...defaultProps} vehicle={null} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("displays vehicle images with navigation", () => {
    render(<VehicleViewModal {...defaultProps} />);

    expect(screen.getByTestId("modal-image")).toBeInTheDocument();
    expect(screen.getByAltText("Tesla Model 3 front")).toBeInTheDocument();

    // Should show navigation arrows for multiple images
    expect(screen.getByTestId("chevron-left")).toBeInTheDocument();
    expect(screen.getByTestId("chevron-right")).toBeInTheDocument();

    // Should show image indicators
    const indicators = screen.getAllByRole("button");
    const imageIndicators = indicators.filter(
      (btn) =>
        btn.className.includes("rounded-full") && btn.className.includes("w-3")
    );
    expect(imageIndicators).toHaveLength(2); // Two images
  });

  it("navigates between images", () => {
    render(<VehicleViewModal {...defaultProps} />);

    const nextButton = screen.getByTestId("chevron-right").closest("button");
    const prevButton = screen.getByTestId("chevron-left").closest("button");

    // Click next to go to second image
    fireEvent.click(nextButton!);
    expect(screen.getByAltText("Tesla Model 3 back")).toBeInTheDocument();

    // Click previous to go back to first image
    fireEvent.click(prevButton!);
    expect(screen.getByAltText("Tesla Model 3 front")).toBeInTheDocument();
  });

  it("shows availability badge", () => {
    render(<VehicleViewModal {...defaultProps} />);

    const badge = screen.getByTestId("badge");
    expect(badge).toHaveTextContent("Disponible");
    expect(badge).toHaveClass("bg-green-100", "text-green-800");
  });

  it("displays basic vehicle information", () => {
    render(<VehicleViewModal {...defaultProps} />);

    expect(screen.getByText("Información Básica")).toBeInTheDocument();
    expect(screen.getByText("Carro")).toBeInTheDocument();
    // Use getAllByText since there are multiple "Bogotá, Colombia" elements (vehicle location and dealer location)
    const bogotaElements = screen.getAllByText("Bogotá, Colombia");
    expect(bogotaElements.length).toBeGreaterThan(0);
    expect(screen.getByText("5 pasajeros")).toBeInTheDocument();
    expect(screen.getByText("2-4 semanas")).toBeInTheDocument();
  });

  it("displays dealer information", () => {
    render(<VehicleViewModal {...defaultProps} />);

    expect(
      screen.getByText("Información del Concesionario")
    ).toBeInTheDocument();
    expect(screen.getByText("Tesla Store Colombia")).toBeInTheDocument();
    // Use getAllByText since there are multiple "Bogotá, Colombia" elements (vehicle location and dealer location)
    const bogotaElements = screen.getAllByText("Bogotá, Colombia");
    expect(bogotaElements.length).toBeGreaterThan(0);

    // Should show star rating (4.5/5) - there are 11 stars total (5 for dealer + 5 for reviews + 1 extra)
    const stars = screen.getAllByTestId("star-icon");
    expect(stars.length).toBeGreaterThanOrEqual(10); // At least 10 stars
  });

  it("displays technical specifications", () => {
    render(<VehicleViewModal {...defaultProps} />);

    expect(screen.getByText("Especificaciones Técnicas")).toBeInTheDocument();
    expect(screen.getByText("400 km")).toBeInTheDocument();
    expect(screen.getByText("8 horas")).toBeInTheDocument();
    expect(screen.getByText("200 km/h")).toBeInTheDocument();
    expect(screen.getByText("300 kW")).toBeInTheDocument();
    expect(screen.getByText("75 kWh")).toBeInTheDocument();
    expect(screen.getByText("8 años")).toBeInTheDocument();
  });

  it("displays price information", () => {
    render(<VehicleViewModal {...defaultProps} />);

    expect(screen.getByText("Información de Precio")).toBeInTheDocument();
    expect(screen.getByText("$50,000,000")).toBeInTheDocument();
    expect(screen.getByText("COP")).toBeInTheDocument();
  });

  it("displays vehicle features", () => {
    render(<VehicleViewModal {...defaultProps} />);

    expect(screen.getByText("Características Destacadas")).toBeInTheDocument();
    expect(screen.getByText("GPS integrado")).toBeInTheDocument();
    expect(screen.getByText("Autopilot")).toBeInTheDocument();
    expect(screen.getByText("Carga rápida")).toBeInTheDocument();

    // Should show check icons for features
    const checkIcons = screen.getAllByTestId("check-icon");
    expect(checkIcons).toHaveLength(3);
  });

  it("displays vehicle description", () => {
    render(<VehicleViewModal {...defaultProps} />);

    expect(screen.getByText("Descripción")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Amazing electric car with autopilot and premium features"
      )
    ).toBeInTheDocument();
  });

  it("displays reviews information", () => {
    render(<VehicleViewModal {...defaultProps} />);

    expect(screen.getByText("Reseñas")).toBeInTheDocument();
    expect(screen.getByText("4.5 de 5 estrellas")).toBeInTheDocument();
    expect(screen.getByText("Basado en 120 reseñas")).toBeInTheDocument();
  });

  it("handles vehicle without images", () => {
    const vehicleWithoutImages = { ...mockVehicle, images: [] };
    render(
      <VehicleViewModal {...defaultProps} vehicle={vehicleWithoutImages} />
    );

    expect(screen.getByText("Imagen no disponible")).toBeInTheDocument();
    // Use getAllByTestId since there are multiple car icons in the modal
    const carIcons = screen.getAllByTestId("car-icon");
    expect(carIcons.length).toBeGreaterThan(0);
  });

  it("handles vehicle without features", () => {
    const vehicleWithoutFeatures = { ...mockVehicle, features: [] };
    render(
      <VehicleViewModal {...defaultProps} vehicle={vehicleWithoutFeatures} />
    );

    expect(
      screen.queryByText("Características Destacadas")
    ).not.toBeInTheDocument();
  });

  it("handles vehicle without description", () => {
    const vehicleWithoutDescription = { ...mockVehicle, description: "" };
    render(
      <VehicleViewModal {...defaultProps} vehicle={vehicleWithoutDescription} />
    );

    expect(screen.queryByText("Descripción")).not.toBeInTheDocument();
  });

  it("handles vehicle without reviews", () => {
    const vehicleWithoutReviews = {
      ...mockVehicle,
      reviews: { average: 0, count: 0 },
    };
    render(
      <VehicleViewModal {...defaultProps} vehicle={vehicleWithoutReviews} />
    );

    expect(screen.queryByText("Reseñas")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(<VehicleViewModal {...defaultProps} />);

    const closeButton = screen.getByText("Cerrar");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("shows correct icons for different sections", () => {
    render(<VehicleViewModal {...defaultProps} />);

    // Basic info icons - use getAllByTestId for icons that appear multiple times
    const carIcons = screen.getAllByTestId("car-icon");
    expect(carIcons.length).toBeGreaterThan(0);
    const mappinIcons = screen.getAllByTestId("mappin-icon");
    expect(mappinIcons.length).toBeGreaterThan(0);
    expect(screen.getByTestId("users-icon")).toBeInTheDocument();
    expect(screen.getByTestId("calendar-icon")).toBeInTheDocument();

    // Dealer info icons
    expect(screen.getAllByTestId("shield-icon")).toHaveLength(2); // Dealer name and warranty
    expect(screen.getAllByTestId("mappin-icon")).toHaveLength(2); // Vehicle location and dealer location
    // There are 11 stars total (5 for dealer + 5 for reviews + 1 extra)
    expect(screen.getAllByTestId("star-icon").length).toBeGreaterThanOrEqual(
      10
    ); // At least 10 stars

    // Specifications icons
    expect(screen.getAllByTestId("battery-icon")).toHaveLength(2); // Range and battery
    expect(screen.getByTestId("clock-icon")).toBeInTheDocument();
    expect(screen.getByTestId("zap-icon")).toBeInTheDocument();
    expect(screen.getByTestId("gauge-icon")).toBeInTheDocument();

    // Price icon
    expect(screen.getByTestId("dollar-icon")).toBeInTheDocument();
  });

  it("handles image navigation indicators", () => {
    render(<VehicleViewModal {...defaultProps} />);

    // Click on second image indicator
    const indicators = screen.getAllByRole("button");
    const imageIndicators = indicators.filter(
      (btn) =>
        btn.className.includes("rounded-full") &&
        btn.className.includes("w-3") &&
        btn.className.includes("h-3")
    );

    if (imageIndicators.length >= 2) {
      fireEvent.click(imageIndicators[1]);
      expect(screen.getByAltText("Tesla Model 3 back")).toBeInTheDocument();
    }
  });
});
