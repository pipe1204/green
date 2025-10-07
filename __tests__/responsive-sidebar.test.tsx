import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ResponsiveDashboardSidebar } from "@/components/dashboard/ResponsiveDashboardSidebar";

// Mock the router
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the cn utility
vi.mock("@/lib/utils", () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(" "),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Bike: () => <svg data-testid="bike-icon">Bike</svg>,
  MessageSquare: () => (
    <svg data-testid="message-square-icon">MessageSquare</svg>
  ),
  BarChart3: () => <svg data-testid="bar-chart-3-icon">BarChart3</svg>,
  ChevronLeft: () => <svg data-testid="chevron-left-icon">ChevronLeft</svg>,
  ChevronRight: () => <svg data-testid="chevron-right-icon">ChevronRight</svg>,
  Heart: () => <svg data-testid="heart-icon">Heart</svg>,
  Calendar: () => <svg data-testid="calendar-icon">Calendar</svg>,
  Bell: () => <svg data-testid="bell-icon">Bell</svg>,
  Menu: () => <svg data-testid="menu-icon">Menu</svg>,
  X: () => <svg data-testid="x-icon">X</svg>,
}));

describe("ResponsiveDashboardSidebar", () => {
  const mockOnSectionChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Vendor Dashboard", () => {
    it("renders vendor navigation items correctly", () => {
      render(
        <ResponsiveDashboardSidebar
          activeSection="vehicles"
          onSectionChange={mockOnSectionChange}
          userType="vendor"
        />
      );

      // There are multiple "Panel de Vendedor" elements (desktop and mobile), so we use getAllByText
      expect(screen.getAllByText("Panel de Vendedor").length).toBeGreaterThan(
        0
      );
      expect(
        screen.getAllByText("Gestión de inventario").length
      ).toBeGreaterThan(0);
      // There are multiple navigation items (desktop and mobile), so we use getAllByText
      expect(screen.getAllByText("Mis Vehículos").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Consultas").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Mensajes").length).toBeGreaterThan(0);
      // There are multiple "Analítica" elements (desktop and mobile), so we use getAllByText
      expect(screen.getAllByText("Analítica").length).toBeGreaterThan(0);
    });

    it("calls onSectionChange when navigation item is clicked", () => {
      render(
        <ResponsiveDashboardSidebar
          activeSection="vehicles"
          onSectionChange={mockOnSectionChange}
          userType="vendor"
        />
      );

      // There are multiple "Consultas" elements (desktop and mobile), so we use getAllByText and click the first one
      const consultasButtons = screen.getAllByText("Consultas");
      expect(consultasButtons.length).toBeGreaterThan(0);
      fireEvent.click(consultasButtons[0]);

      expect(mockOnSectionChange).toHaveBeenCalledWith("inquiries");
    });

    it("shows active section with correct styling", () => {
      render(
        <ResponsiveDashboardSidebar
          activeSection="vehicles"
          onSectionChange={mockOnSectionChange}
          userType="vendor"
        />
      );

      // There are multiple "Mis Vehículos" elements (desktop and mobile), so we use getAllByText
      const vehiclesButtons = screen.getAllByText("Mis Vehículos");
      expect(vehiclesButtons.length).toBeGreaterThan(0);
      // Check that at least one has the active styling
      const activeButtons = vehiclesButtons.filter((button) =>
        button.closest("button")?.classList.contains("bg-green-50")
      );
      expect(activeButtons.length).toBeGreaterThan(0);
    });

    it("enables analytics section", () => {
      render(
        <ResponsiveDashboardSidebar
          activeSection="vehicles"
          onSectionChange={mockOnSectionChange}
          userType="vendor"
        />
      );

      // There are multiple "Analítica" elements (desktop and mobile), so we use getAllByText
      const analyticsButtons = screen.getAllByText("Analítica");
      expect(analyticsButtons.length).toBeGreaterThan(0);
      // Ensure none are disabled now that analytics is enabled
      const disabledButtons = analyticsButtons.filter((button) =>
        button.closest("button")?.hasAttribute("disabled")
      );
      expect(disabledButtons.length).toBe(0);
    });
  });

  describe("Customer Dashboard", () => {
    it("renders customer navigation items correctly", () => {
      render(
        <ResponsiveDashboardSidebar
          activeSection="favorites"
          onSectionChange={mockOnSectionChange}
          userType="customer"
        />
      );

      // There are multiple "Panel de Cliente" elements (desktop and mobile), so we use getAllByText
      expect(screen.getAllByText("Panel de Cliente").length).toBeGreaterThan(0);
      expect(
        screen.getAllByText("Gestión de favoritos y alertas").length
      ).toBeGreaterThan(0);
      // There are multiple navigation items (desktop and mobile), so we use getAllByText
      expect(screen.getAllByText("Favoritos").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Pruebas de Manejo").length).toBeGreaterThan(
        0
      );
      expect(screen.getAllByText("Alertas de Precio").length).toBeGreaterThan(
        0
      );
      expect(screen.getAllByText("Mis Consultas").length).toBeGreaterThan(0);
    });

    it("calls onSectionChange when customer navigation item is clicked", () => {
      render(
        <ResponsiveDashboardSidebar
          activeSection="favorites"
          onSectionChange={mockOnSectionChange}
          userType="customer"
        />
      );

      // There are multiple "Pruebas de Manejo" elements (desktop and mobile), so we use getAllByText
      const testDrivesButtons = screen.getAllByText("Pruebas de Manejo");
      expect(testDrivesButtons.length).toBeGreaterThan(0);
      fireEvent.click(testDrivesButtons[0]);

      expect(mockOnSectionChange).toHaveBeenCalledWith("testDrives");
    });
  });

  describe("Mobile Menu", () => {
    it("shows mobile menu button on mobile", () => {
      render(
        <ResponsiveDashboardSidebar
          activeSection="vehicles"
          onSectionChange={mockOnSectionChange}
          userType="vendor"
        />
      );

      const menuButton = screen.getByTestId("menu-icon");
      expect(menuButton).toBeInTheDocument();
    });

    it("toggles mobile menu when button is clicked", async () => {
      render(
        <ResponsiveDashboardSidebar
          activeSection="vehicles"
          onSectionChange={mockOnSectionChange}
          userType="vendor"
        />
      );

      const menuButton = screen.getByTestId("menu-icon").closest("button");
      fireEvent.click(menuButton!);

      await waitFor(() => {
        expect(screen.getByTestId("x-icon")).toBeInTheDocument();
      });
    });

    it("closes mobile menu when overlay is clicked", async () => {
      render(
        <ResponsiveDashboardSidebar
          activeSection="vehicles"
          onSectionChange={mockOnSectionChange}
          userType="vendor"
        />
      );

      // Open mobile menu
      const menuButton = screen.getByTestId("menu-icon").closest("button");
      fireEvent.click(menuButton!);

      await waitFor(() => {
        expect(screen.getByTestId("x-icon")).toBeInTheDocument();
      });

      // Click overlay to close
      const overlay = document.querySelector('[class*="bg-black"]');
      if (overlay) {
        fireEvent.click(overlay);
      }

      await waitFor(() => {
        expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
      });
    });

    it("closes mobile menu when section is changed", async () => {
      render(
        <ResponsiveDashboardSidebar
          activeSection="vehicles"
          onSectionChange={mockOnSectionChange}
          userType="vendor"
        />
      );

      // Open mobile menu
      const menuButton = screen.getByTestId("menu-icon").closest("button");
      fireEvent.click(menuButton!);

      await waitFor(() => {
        expect(screen.getByTestId("x-icon")).toBeInTheDocument();
      });

      // Click on any navigation item (both desktop and mobile will trigger the callback)
      const consultasButtons = screen.getAllByText("Consultas");
      expect(consultasButtons.length).toBeGreaterThan(0);
      fireEvent.click(consultasButtons[0]);

      expect(mockOnSectionChange).toHaveBeenCalledWith("inquiries");

      // Menu should close automatically
      await waitFor(() => {
        expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
      });
    });
  });

  describe("Desktop Sidebar", () => {
    it("shows collapse/expand button on desktop", () => {
      render(
        <ResponsiveDashboardSidebar
          activeSection="vehicles"
          onSectionChange={mockOnSectionChange}
          userType="vendor"
        />
      );

      const collapseButton = screen.getByTestId("chevron-left-icon");
      expect(collapseButton).toBeInTheDocument();
    });

    it("toggles sidebar collapse state", () => {
      render(
        <ResponsiveDashboardSidebar
          activeSection="vehicles"
          onSectionChange={mockOnSectionChange}
          userType="vendor"
        />
      );

      const collapseButton = screen
        .getByTestId("chevron-left-icon")
        .closest("button");
      fireEvent.click(collapseButton!);

      // After clicking, the button should show the opposite chevron
      expect(screen.getByTestId("chevron-right-icon")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels and roles", () => {
      render(
        <ResponsiveDashboardSidebar
          activeSection="vehicles"
          onSectionChange={mockOnSectionChange}
          userType="vendor"
        />
      );

      const sidebar = screen.getByTestId("responsive-dashboard-sidebar");
      expect(sidebar).toBeInTheDocument();

      // There are multiple navigation elements (desktop and mobile), so we use getAllByRole
      const navigations = screen.getAllByRole("navigation");
      expect(navigations.length).toBeGreaterThan(0);
    });

    it("does not disable analytics item anymore", () => {
      render(
        <ResponsiveDashboardSidebar
          activeSection="vehicles"
          onSectionChange={mockOnSectionChange}
          userType="vendor"
        />
      );

      // There are multiple "Analítica" elements (desktop and mobile), so we use getAllByText
      const analyticsButtons = screen.getAllByText("Analítica");
      expect(analyticsButtons.length).toBeGreaterThan(0);
      const disabledButtons = analyticsButtons.filter((button) =>
        button.closest("button")?.hasAttribute("disabled")
      );
      expect(disabledButtons.length).toBe(0);
    });
  });

  describe("Responsive Behavior", () => {
    it("applies correct classes for desktop and mobile", () => {
      render(
        <ResponsiveDashboardSidebar
          activeSection="vehicles"
          onSectionChange={mockOnSectionChange}
          userType="vendor"
        />
      );

      const sidebar = screen.getByTestId("responsive-dashboard-sidebar");
      expect(sidebar).toHaveClass("hidden", "lg:flex");
    });
  });
});
