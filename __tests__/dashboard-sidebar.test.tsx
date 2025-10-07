import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  DashboardSidebar,
  DashboardSection,
} from "@/components/dashboard/DashboardSidebar";

// Mock Lucide React icons
vi.mock("lucide-react", () => ({
  BarChart3: () => <div data-testid="analytics-icon">Analytics</div>,
  MessageSquare: () => <div data-testid="messages-icon">Messages</div>,
  ChevronLeft: () => <div data-testid="chevron-left">Left</div>,
  ChevronRight: () => <div data-testid="chevron-right">Right</div>,
  Bike: () => <div data-testid="bike-icon">Bike</div>,
  Heart: () => <div data-testid="heart-icon">Heart</div>,
  Calendar: () => <div data-testid="calendar-icon">Calendar</div>,
  Bell: () => <div data-testid="bell-icon">Bell</div>,
}));

describe("DashboardSidebar", () => {
  const mockOnSectionChange = vi.fn();

  const defaultProps = {
    activeSection: "vehicles" as DashboardSection,
    onSectionChange: mockOnSectionChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders sidebar with correct navigation items", () => {
    render(<DashboardSidebar {...defaultProps} />);

    // Check header
    expect(screen.getByText("Panel de Vendedor")).toBeInTheDocument();
    expect(screen.getByText("Gestión de inventario")).toBeInTheDocument();

    // Check navigation items
    expect(screen.getByText("Mis Vehículos")).toBeInTheDocument();
    expect(screen.getByText("Analítica")).toBeInTheDocument();
    expect(screen.getByText("Mensajes")).toBeInTheDocument();

    // Check descriptions
    expect(
      screen.getByText("Gestiona tu inventario de vehículos")
    ).toBeInTheDocument();
    // Updated description for enabled analytics
    expect(
      screen.getByText("Métricas y estadísticas de tus vehículos")
    ).toBeInTheDocument();
    expect(screen.getByText("Conversaciones con clientes")).toBeInTheDocument();
  });

  it("shows active section with correct styling", () => {
    render(<DashboardSidebar {...defaultProps} />);

    const vehiclesButton = screen.getByText("Mis Vehículos").closest("button");
    expect(vehiclesButton).toHaveClass(
      "bg-green-50",
      "border-green-200",
      "text-green-700"
    );
  });

  it("calls onSectionChange when clicking navigation items", () => {
    render(<DashboardSidebar {...defaultProps} />);

    const vehiclesButton = screen.getByText("Mis Vehículos").closest("button");
    fireEvent.click(vehiclesButton!);

    expect(mockOnSectionChange).toHaveBeenCalledWith("vehicles");
  });

  it("calls onSectionChange for analytics now that it's enabled", () => {
    render(<DashboardSidebar {...defaultProps} />);

    const analyticsButton = screen.getByText("Analítica").closest("button");
    expect(analyticsButton).not.toBeDisabled();
    fireEvent.click(analyticsButton!);
    expect(mockOnSectionChange).toHaveBeenCalledWith("analytics");
  });

  it("toggles collapse state when clicking toggle button", () => {
    render(<DashboardSidebar {...defaultProps} />);

    const toggleButton = screen.getByTestId("chevron-left");
    fireEvent.click(toggleButton);

    // When collapsed, descriptions should be hidden
    expect(
      screen.queryByText("Gestiona tu inventario de vehículos")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Métricas y estadísticas (Próximamente)")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Consulta con clientes (Próximamente)")
    ).not.toBeInTheDocument();

    // Footer should also be hidden when collapsed
    expect(screen.queryByText("Green Platform")).not.toBeInTheDocument();
  });

  it("shows correct icons for each navigation item", () => {
    render(<DashboardSidebar {...defaultProps} />);

    expect(screen.getByTestId("bike-icon")).toBeInTheDocument();
    expect(screen.getByTestId("analytics-icon")).toBeInTheDocument();
    // Both Consultas and Mensajes use MessageSquare icon, so we expect 2 instances
    expect(screen.getAllByTestId("messages-icon")).toHaveLength(2);
  });

  it("displays footer when not collapsed", () => {
    render(<DashboardSidebar {...defaultProps} />);

    expect(screen.getByText("Green Platform")).toBeInTheDocument();
    expect(screen.getByText("Versión 1.0")).toBeInTheDocument();
  });

  it("applies correct active state for different sections", () => {
    const { rerender } = render(
      <DashboardSidebar {...defaultProps} activeSection="analytics" />
    );

    // Analytics should appear active
    const analyticsButton = screen.getByText("Analítica").closest("button");
    expect(analyticsButton).toHaveClass(
      "bg-green-50",
      "border-green-200",
      "text-green-700"
    );

    // Vehicles should not be active
    const vehiclesButton = screen.getByText("Mis Vehículos").closest("button");
    expect(vehiclesButton).not.toHaveClass("bg-green-50");

    rerender(<DashboardSidebar {...defaultProps} activeSection="messages" />);

    // Messages should appear active
    const messagesButton = screen.getByText("Mensajes").closest("button");
    expect(messagesButton).toHaveClass(
      "bg-green-50",
      "border-green-200",
      "text-green-700"
    );
  });

  it("applies custom className when provided", () => {
    render(<DashboardSidebar {...defaultProps} className="custom-class" />);

    // Look for the main sidebar container with the custom class
    const sidebar = screen.getByTestId("dashboard-sidebar");
    expect(sidebar).toHaveClass("custom-class");
  });
});
