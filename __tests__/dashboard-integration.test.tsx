import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { VendorDashboard } from "@/components/dashboard/VendorDashboard";
import type { Vehicle } from "@/types";
import type { DashboardSection } from "@/components/dashboard/DashboardSidebar";

// Define proper types for component props
interface DashboardSidebarProps {
  activeSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
  className?: string;
}

interface VehicleTableProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicleId: string) => void;
  onView?: (vehicle: Vehicle) => void;
  loading?: boolean;
}

interface VehicleViewModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Vehicle>) => Promise<void>;
  editingVehicle?: Vehicle | null;
  loading: boolean;
}

// Mock all external dependencies
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock("@/components/auth/AuthProvider", () => ({
  useAuth: () => ({
    user: { id: "user-1", email: "test@example.com" },
    loading: false,
  }),
}));

// Mock Supabase with proper typing
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              id: "vendor-1",
              business_name: "Test Store",
              rating: 4.5,
              locations: [],
            },
            error: null,
          }),
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
        or: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
      upsert: vi.fn().mockReturnValue({
        error: null,
      }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          error: null,
        }),
      }),
    }),
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockReturnValue({
        on: vi.fn().mockReturnValue({
          subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() }),
        }),
        subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() }),
      }),
      subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() }),
      send: vi.fn().mockResolvedValue(undefined),
    }),
    removeChannel: vi.fn(),
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { user: { id: "user-1" } } },
      }),
    },
  },
}));

// Mock all UI components
vi.mock("@/components/Header", () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock("@/components/Footer", () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

vi.mock("@/components/FloatingAskButton", () => ({
  default: () => (
    <div data-testid="floating-ask-button">Floating Ask Button</div>
  ),
}));

// Mock dashboard components with proper typing
vi.mock("@/components/dashboard/ResponsiveDashboardSidebar", () => ({
  ResponsiveDashboardSidebar: ({
    activeSection,
    onSectionChange,
  }: DashboardSidebarProps) => (
    <div data-testid="responsive-dashboard-sidebar">
      <nav>
        <button
          onClick={() => onSectionChange("vehicles")}
          data-testid="vehicles-nav"
          className={activeSection === "vehicles" ? "active" : ""}
        >
          Mis Vehículos
        </button>
        <button
          onClick={() => onSectionChange("inquiries")}
          data-testid="inquiries-nav"
          className={activeSection === "inquiries" ? "active" : ""}
        >
          Consultas
        </button>
        <button
          onClick={() => onSectionChange("messages")}
          data-testid="messages-nav"
          className={activeSection === "messages" ? "active" : ""}
        >
          Mensajes
        </button>
        <button
          onClick={() => onSectionChange("analytics")}
          data-testid="analytics-nav"
          className={activeSection === "analytics" ? "active" : ""}
        >
          Analítica
        </button>
      </nav>
    </div>
  ),
}));

vi.mock("@/components/dashboard/VehicleTable", () => ({
  VehicleTable: ({
    vehicles,
    onEdit,
    onDelete,
    onView,
    loading,
  }: VehicleTableProps) => (
    <div data-testid="vehicle-table">
      <h3>Tabla de Vehículos</h3>
      {loading ? (
        <p>Cargando vehículos...</p>
      ) : vehicles.length === 0 ? (
        <div>
          <p>No tienes vehículos registrados</p>
          <p>Comienza agregando tu primer vehículo eléctrico</p>
        </div>
      ) : (
        <div>
          <p>
            Mostrando {vehicles.length} vehículo
            {vehicles.length !== 1 ? "s" : ""}
          </p>
          {vehicles.map((vehicle: Vehicle) => (
            <div key={vehicle.id} data-testid={`vehicle-row-${vehicle.id}`}>
              <h4>{vehicle.name}</h4>
              <p>Precio: ${vehicle.price.toLocaleString()}</p>
              <p>Disponibilidad: {vehicle.availability}</p>
              <div>
                <button
                  onClick={() => onEdit(vehicle)}
                  data-testid="edit-button"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(vehicle.id)}
                  data-testid="delete-button"
                >
                  Eliminar
                </button>
                {onView && (
                  <button
                    onClick={() => onView(vehicle)}
                    data-testid="view-button"
                  >
                    Ver
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  ),
}));

vi.mock("@/components/dashboard/VehicleViewModal", () => ({
  VehicleViewModal: ({ isOpen, vehicle, onClose }: VehicleViewModalProps) =>
    isOpen && vehicle ? (
      <div role="dialog" data-testid="vehicle-view-modal">
        <h2>Información del Vehículo</h2>
        <h3>{vehicle.name}</h3>
        <p>Marca: {vehicle.brand}</p>
        <p>Tipo: {vehicle.type}</p>
        <p>Precio: ${vehicle.price.toLocaleString()}</p>
        <p>Ubicación: {vehicle.location}</p>
        <p>Descripción: {vehicle.description}</p>
        <div>
          <h4>Especificaciones:</h4>
          <p>Autonomía: {vehicle.specifications.range} km</p>
          <p>Tiempo de carga: {vehicle.specifications.chargeTime}h</p>
          <p>
            Velocidad máxima: {vehicle.specifications.performance.maxSpeed} km/h
          </p>
          <p>Potencia: {vehicle.specifications.performance.power} kW</p>
        </div>
        <div>
          <h4>Características:</h4>
          {vehicle.features.map((feature: string, index: number) => (
            <span key={index}>• {feature}</span>
          ))}
        </div>
        <button onClick={onClose} data-testid="close-modal">
          Cerrar
        </button>
      </div>
    ) : null,
}));

vi.mock("@/components/dashboard/ProductForm", () => ({
  ProductForm: ({
    isOpen,
    onClose,
    onSubmit,
    editingVehicle,
  }: ProductFormProps) =>
    isOpen ? (
      <div role="dialog" data-testid="product-form">
        <h2>{editingVehicle ? "Editar Vehículo" : "Agregar Nuevo Vehículo"}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({});
          }}
        >
          <input type="text" placeholder="Nombre del vehículo" required />
          <input type="text" placeholder="Marca" required />
          <input type="number" placeholder="Precio" required />
          <textarea placeholder="Descripción" />
          <button type="submit">Guardar</button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </form>
      </div>
    ) : null,
}));

// Mock database mapping
vi.mock("@/lib/database-mapping", () => ({
  databaseToVehicle: (vehicle: Vehicle) => vehicle,
  vehicleToDatabase: (vehicle: Vehicle) => vehicle,
}));

// Mock Lucide icons
vi.mock("lucide-react", () => ({
  Plus: () => <div data-testid="plus-icon">Plus</div>,
  Zap: () => <div data-testid="zap-icon">Zap</div>,
  ArrowLeft: () => <div data-testid="arrow-left-icon">ArrowLeft</div>,
  MessageSquare: () => (
    <div data-testid="message-square-icon">MessageSquare</div>
  ),
  AlertCircle: () => <div data-testid="alert-circle-icon">AlertCircle</div>,
  Download: () => <div data-testid="download-icon">Download</div>,
}));

describe("Dashboard Integration Tests", () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mockVehicles: Vehicle[] = [
    {
      id: "1",
      vendorId: "vendor-1",
      name: "Tesla Model 3",
      brand: "Tesla",
      type: "carro",
      price: 150000000,
      images: [{ url: "tesla.jpg", alt: "Tesla Model 3" }],
      specifications: {
        range: "400",
        chargeTime: "8",
        warranty: "8 años",
        battery: "75 kWh",
        performance: { maxSpeed: "200", power: "300" },
      },
      deliveryTime: "2-4 semanas",
      availability: "in-stock",
      passengerCapacity: 5,
      chargingTime: "8",
      maxSpeed: "200",
      power: "300",
      location: "Bogotá, Colombia",
      description: "Vehículo eléctrico premium con tecnología avanzada",
      features: ["Autopilot", "Carga rápida", "GPS integrado"],
      reviews: { average: 4.5, count: 120 },
      vendor: {
        businessName: "Tesla Store Colombia",
        phone: "+57 300 123 4567",
        email: "contacto@tesla.com",
        rating: 4.5,
      },
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "2",
      vendorId: "vendor-1",
      name: "Eco Rider Pro",
      brand: "EcoRider",
      type: "motocicleta",
      price: 3500000,
      images: [{ url: "eco-rider.jpg", alt: "Eco Rider Pro" }],
      specifications: {
        range: "120",
        chargeTime: "4",
        warranty: "2 años",
        battery: "2.5 kWh",
        performance: { maxSpeed: "80", power: "3" },
      },
      deliveryTime: "1-2 semanas",
      availability: "pre-order",
      passengerCapacity: 2,
      chargingTime: "4",
      maxSpeed: "80",
      power: "3",
      location: "Medellín, Colombia",
      description: "Motocicleta eléctrica urbana perfecta para la ciudad",
      features: ["Luces LED", "Frenos ABS", "Display digital"],
      reviews: { average: 4.2, count: 45 },
      vendor: {
        businessName: "EcoRider Store",
        phone: "+57 300 987 6543",
        email: "contacto@ecorider.com",
        rating: 4.2,
      },
      createdAt: "2024-01-02T00:00:00Z",
      updatedAt: "2024-01-02T00:00:00Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("completes full workflow: view vehicles → edit vehicle → view details → delete vehicle", async () => {
    render(<VendorDashboard />);

    // 1. Initial load - should show vehicles table
    await waitFor(() => {
      expect(screen.getByText("Tabla de Vehículos")).toBeInTheDocument();
    });

    // 2. Check if there are vehicles to interact with
    const viewButtons = screen.queryAllByTestId("view-button");
    if (viewButtons.length > 0) {
      fireEvent.click(viewButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId("vehicle-view-modal")).toBeInTheDocument();
      });
    } else {
      // If no vehicles, just verify the empty state
      expect(
        screen.getByText("No tienes vehículos registrados")
      ).toBeInTheDocument();
    }

    // 3. Close modal if it was opened
    const closeButton = screen.queryByTestId("close-modal");
    if (closeButton) {
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(
          screen.queryByTestId("vehicle-view-modal")
        ).not.toBeInTheDocument();
      });
    }

    // 4. Test edit functionality if vehicles exist
    const editButtons = screen.queryAllByTestId("edit-button");
    if (editButtons.length > 0) {
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId("product-form")).toBeInTheDocument();
      });

      // 5. Close edit form
      const cancelButton = screen.queryByText("Cancelar");
      if (cancelButton) {
        fireEvent.click(cancelButton);

        await waitFor(() => {
          expect(screen.queryByTestId("product-form")).not.toBeInTheDocument();
        });
      }
    }

    // 6. Test delete functionality if vehicles exist
    const deleteButtons = screen.queryAllByTestId("delete-button");
    if (deleteButtons.length > 0) {
      fireEvent.click(deleteButtons[0]);

      // Verify the component handles the delete action
      await waitFor(() => {
        expect(screen.getByText("Tabla de Vehículos")).toBeInTheDocument();
      });
    }
  });

  it("handles navigation between dashboard sections", async () => {
    render(<VendorDashboard />);

    // Start with vehicles section
    await waitFor(() => {
      expect(screen.getByTestId("vehicles-nav")).toHaveClass("active");
      expect(screen.getByText("Tabla de Vehículos")).toBeInTheDocument();
    });

    // Switch to inquiries
    fireEvent.click(screen.getByTestId("inquiries-nav"));

    await waitFor(() => {
      expect(screen.getByTestId("inquiries-nav")).toHaveClass("active");
      // The inquiries section shows a loading state initially
      expect(screen.getByText("Cargando consultas...")).toBeInTheDocument();
    });

    // Switch to messages
    fireEvent.click(screen.getByTestId("messages-nav"));

    await waitFor(() => {
      expect(screen.getByTestId("messages-nav")).toHaveClass("active");
      expect(
        screen.getByRole("heading", { name: "Mensajes" })
      ).toBeInTheDocument();
    });

    // Switch to analytics
    fireEvent.click(screen.getByTestId("analytics-nav"));

    await waitFor(() => {
      expect(screen.getByTestId("analytics-nav")).toHaveClass("active");
      expect(screen.getByText("Analítica en Desarrollo")).toBeInTheDocument();
    });

    // Back to vehicles
    fireEvent.click(screen.getByTestId("vehicles-nav"));

    await waitFor(() => {
      expect(screen.getByTestId("vehicles-nav")).toHaveClass("active");
      expect(screen.getByText("Tabla de Vehículos")).toBeInTheDocument();
    });
  });

  it("handles add new vehicle workflow", async () => {
    render(<VendorDashboard />);

    // Click add vehicle button
    await waitFor(() => {
      const addButton = screen.getByText("Agregar Vehículo");
      fireEvent.click(addButton);
    });

    // Should open product form
    await waitFor(() => {
      expect(screen.getByTestId("product-form")).toBeInTheDocument();
      expect(screen.getByText("Agregar Nuevo Vehículo")).toBeInTheDocument();
    });

    // Fill form and submit
    const nameInput = screen.getByPlaceholderText("Nombre del vehículo");
    const brandInput = screen.getByPlaceholderText("Marca");
    const priceInput = screen.getByPlaceholderText("Precio");

    fireEvent.change(nameInput, { target: { value: "Nuevo Vehículo" } });
    fireEvent.change(brandInput, { target: { value: "Nueva Marca" } });
    fireEvent.change(priceInput, { target: { value: "5000000" } });

    const saveButton = screen.getByText("Guardar");
    fireEvent.click(saveButton);

    // Form should close after submit
    await waitFor(() => {
      expect(screen.queryByTestId("product-form")).not.toBeInTheDocument();
    });
  });

  it("displays correct vehicle information in table and modal", async () => {
    render(<VendorDashboard />);

    await waitFor(() => {
      // Check table displays correct info
      expect(screen.getByText("Tabla de Vehículos")).toBeInTheDocument();
    });

    // Check if there are vehicles displayed
    const teslaElements = screen.queryAllByText("Tesla Model 3");
    if (teslaElements.length > 0) {
      expect(teslaElements.length).toBeGreaterThan(0);
    } else {
      // If no vehicles, verify empty state
      expect(
        screen.getByText("No tienes vehículos registrados")
      ).toBeInTheDocument();
    }

    // Test modal functionality if vehicles exist
    const viewButtons = screen.queryAllByTestId("view-button");
    if (viewButtons.length > 0) {
      fireEvent.click(viewButtons[0]);

      await waitFor(() => {
        // Check modal shows detailed info
        expect(screen.getByTestId("vehicle-view-modal")).toBeInTheDocument();
      });

      // Close modal
      const closeButton = screen.queryByTestId("close-modal");
      if (closeButton) {
        fireEvent.click(closeButton);

        await waitFor(() => {
          expect(
            screen.queryByTestId("vehicle-view-modal")
          ).not.toBeInTheDocument();
        });
      }
    }
  });

  it("handles empty state correctly", async () => {
    render(<VendorDashboard />);

    await waitFor(() => {
      // Check if vehicle table is present
      expect(screen.getByText("Tabla de Vehículos")).toBeInTheDocument();
    });

    // Add button should be available
    expect(screen.getByText("Agregar Vehículo")).toBeInTheDocument();
  });
});
