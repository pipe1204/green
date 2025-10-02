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

      expect(screen.getByText("Panel de Vendedor")).toBeInTheDocument();
      expect(screen.getByText("Gestión de inventario")).toBeInTheDocument();
      expect(screen.getByText("Mis Vehículos")).toBeInTheDocument();
      expect(screen.getByText("Consultas")).toBeInTheDocument();
      expect(screen.getByText("Mensajes")).toBeInTheDocument();
      expect(screen.getByText("Analítica")).toBeInTheDocument();
    });

    it("calls onSectionChange when navigation item is clicked", () => {
      render(
        <ResponsiveDashboardSidebar
          activeSection="vehicles"
          onSectionChange={mockOnSectionChange}
          userType="vendor"
        />
      );

      const consultasButton = screen.getByText("Consultas");
      fireEvent.click(consultasButton);

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

      const vehiclesButton = screen.getByText("Mis Vehículos");
      expect(vehiclesButton.closest("button")).toHaveClass("bg-green-50");
    });

    it("disables analytics section", () => {
      render(
        <ResponsiveDashboardSidebar
          activeSection="vehicles"
          onSectionChange={mockOnSectionChange}
          userType="vendor"
        />
      );

      const analyticsButton = screen.getByText("Analítica");
      expect(analyticsButton.closest("button")).toBeDisabled();
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

      expect(screen.getByText("Panel de Cliente")).toBeInTheDocument();
      expect(
        screen.getByText("Gestión de favoritos y alertas")
      ).toBeInTheDocument();
      expect(screen.getByText("Favoritos")).toBeInTheDocument();
      expect(screen.getByText("Pruebas de Manejo")).toBeInTheDocument();
      expect(screen.getByText("Alertas de Precio")).toBeInTheDocument();
      expect(screen.getByText("Mis Consultas")).toBeInTheDocument();
    });

    it("calls onSectionChange when customer navigation item is clicked", () => {
      render(
        <ResponsiveDashboardSidebar
          activeSection="favorites"
          onSectionChange={mockOnSectionChange}
          userType="customer"
        />
      );

      const testDrivesButton = screen.getByText("Pruebas de Manejo");
      fireEvent.click(testDrivesButton);

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

      const menuButton = screen.getByRole("button", { name: /menu/i });
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

      const menuButton = screen.getByRole("button", { name: /menu/i });
      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /x/i })).toBeInTheDocument();
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
      const menuButton = screen.getByRole("button", { name: /menu/i });
      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /x/i })).toBeInTheDocument();
      });

      // Click overlay to close
      const overlay = screen
        .getByRole("button", { name: /x/i })
        .closest("div")
        ?.parentElement?.querySelector("div");
      if (overlay) {
        fireEvent.click(overlay);
      }

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /menu/i })
        ).toBeInTheDocument();
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
      const menuButton = screen.getByRole("button", { name: /menu/i });
      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /x/i })).toBeInTheDocument();
      });

      // Click on a navigation item
      const consultasButton = screen.getByText("Consultas");
      fireEvent.click(consultasButton);

      expect(mockOnSectionChange).toHaveBeenCalledWith("inquiries");

      // Menu should close automatically
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /menu/i })
        ).toBeInTheDocument();
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

      const collapseButton = screen.getByRole("button", { name: /chevron/i });
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

      const collapseButton = screen.getByRole("button", { name: /chevron/i });
      fireEvent.click(collapseButton);

      // After clicking, the button should show the opposite chevron
      expect(
        screen.getByRole("button", { name: /chevron/i })
      ).toBeInTheDocument();
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

      const navigation = screen.getByRole("navigation");
      expect(navigation).toBeInTheDocument();
    });

    it("disables navigation items when they are disabled", () => {
      render(
        <ResponsiveDashboardSidebar
          activeSection="vehicles"
          onSectionChange={mockOnSectionChange}
          userType="vendor"
        />
      );

      const analyticsButton = screen.getByText("Analítica");
      expect(analyticsButton.closest("button")).toBeDisabled();
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
      expect(sidebar).toHaveClass("hidden", "lg:block");
    });
  });
});
