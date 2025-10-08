import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
  useParams: () => ({ id: "test-vehicle-id" }),
  useSearchParams: () => ({
    get: vi.fn(() => null),
  }),
}));

// Mock auth provider
vi.mock("@/components/auth/AuthProvider", () => ({
  useAuth: () => ({
    user: {
      id: "test-user-id",
      email: "test@example.com",
    },
    session: {
      access_token: "test-token",
    },
  }),
}));

// Mock Supabase
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn((tableName: string) => {
      if (tableName === "vendors") {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(() => ({
                data: {
                  locations: [], // Empty array to keep location as an input field
                },
                error: null,
              })),
            })),
          })),
        };
      }
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => ({
              data: {
                id: "test-vehicle-id",
                name: "Test Vehicle",
                brand: "Tesla",
                type: "carro",
                price: 50000000,
                is_on_sale: false,
                sale_price: null,
                vendor_id: "test-vendor-id",
                images: [{ url: "/test-image.jpg", alt: "Test Vehicle" }],
                specifications: {
                  range: "400",
                  chargeTime: "8",
                  warranty: "3 años",
                  battery: "100 kWh",
                  performance: { maxSpeed: "200", power: "300" },
                },
                deliveryTime: "2 weeks",
                availability: "in-stock",
                passengerCapacity: 5,
                chargingTime: "8 hours",
                maxSpeed: "200 km/h",
                power: "300 kW",
                location: "Bogotá",
                description: "Test vehicle description",
                features: ["Autopilot", "Supercharger"],
                reviews: { average: 4.5, count: 10 },
                vendors: {
                  business_name: "Test Dealer",
                  phone: "+57 123 456 7890",
                  email: "dealer@test.com",
                  rating: 4.8,
                },
                created_at: "2024-01-01T00:00:00Z",
                updated_at: "2024-01-01T00:00:00Z",
              },
              error: null,
            })),
          })),
        })),
        upsert: vi.fn(() => ({
          data: null,
          error: null,
        })),
      };
    }),
    auth: {
      getUser: vi.fn(() => ({
        data: { user: { id: "test-user-id" } },
        error: null,
      })),
      getSession: vi.fn(async () => ({
        data: {
          session: {
            user: { id: "test-user-id" },
          },
        },
        error: null,
      })),
    },
  },
}));

// Mock vehicle queries
vi.mock("@/lib/vehicle-queries", () => ({
  getVehicleById: vi.fn(() =>
    Promise.resolve({
      id: "test-vehicle-id",
      name: "Test Vehicle",
      brand: "Tesla",
      type: "carro",
      price: 50000000,
      is_on_sale: false,
      sale_price: undefined,
      vendorId: "test-vendor-id",
      images: [{ url: "/test-image.jpg", alt: "Test Vehicle" }],
      specifications: {
        range: "400",
        chargeTime: "8",
        warranty: "3 años",
        battery: "100 kWh",
        performance: { maxSpeed: "200", power: "300" },
      },
      deliveryTime: "2 weeks",
      availability: "in-stock",
      passengerCapacity: 5,
      chargingTime: "8 hours",
      maxSpeed: "200 km/h",
      power: "300 kW",
      location: "Bogotá",
      description: "Test vehicle description",
      features: ["Autopilot", "Supercharger"],
      reviews: { average: 4.5, count: 10 },
      vendor: {
        businessName: "Test Dealer",
        phone: "+57 123 456 7890",
        email: "dealer@test.com",
        rating: 4.8,
      },
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    })
  ),
}));

// Define proper types for UI components
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: string;
  size?: string;
  [key: string]: unknown;
}

interface InputProps {
  className?: string;
  type?: string;
  value?: string | number;
  placeholder?: string;
  required?: boolean;
  id?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: unknown;
}

interface LabelProps {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
  [key: string]: unknown;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

interface DialogProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

// Mock UI components
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, className, ...props }: ButtonProps) => (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/input", () => ({
  Input: ({ className, ...props }: InputProps) => {
    // Auto-generate id from placeholder or use existing id
    const id =
      typeof props.id === "string"
        ? props.id
        : props.placeholder
        ? props.placeholder.toLowerCase().replace(/[^a-z0-9]/g, "")
        : "input";
    return <input id={id} className={className} {...props} />;
  },
}));

vi.mock("@/components/ui/label", () => ({
  Label: ({ children, className, ...props }: LabelProps) => {
    // Auto-generate htmlFor from label text or use existing htmlFor
    const labelText = typeof children === "string" ? children : "";
    let htmlFor = props.htmlFor;

    if (!htmlFor && labelText) {
      // Map specific label texts to their corresponding input IDs
      if (labelText.includes("Nombre del Vehículo")) {
        htmlFor = "ejteslamodel3";
      } else if (labelText.includes("Marca")) {
        htmlFor = "ejtesla";
      } else if (labelText.includes("Precio")) {
        htmlFor = "50000000";
      } else if (labelText.includes("Ubicación")) {
        htmlFor = "ejbogotcolombia";
      } else if (labelText.includes("Autonomía")) {
        htmlFor = "ej400";
      } else if (labelText.includes("Tiempo de Carga")) {
        htmlFor = "ej8";
      } else if (labelText.includes("Batería")) {
        htmlFor = "ej75kwh";
      } else if (labelText.includes("Velocidad Máxima")) {
        htmlFor = "ej200";
      } else if (labelText.includes("Potencia")) {
        htmlFor = "ej300";
      } else {
        htmlFor = labelText.toLowerCase().replace(/[^a-z0-9]/g, "");
      }
    }

    return (
      <label className={className} htmlFor={htmlFor} {...props}>
        {children}
      </label>
    );
  },
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({ children, className, ...props }: CardProps) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  CardContent: ({ children, className, ...props }: CardProps) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  CardHeader: ({ children, className, ...props }: CardProps) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  CardTitle: ({ children, className, ...props }: CardProps) => (
    <h3 className={className} {...props}>
      {children}
    </h3>
  ),
}));

vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open }: DialogProps) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children, className, ...props }: DialogContentProps) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  DialogHeader: ({ children, className, ...props }: DialogContentProps) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  DialogTitle: ({ children, className, ...props }: DialogContentProps) => (
    <h2 className={className} {...props}>
      {children}
    </h2>
  ),
}));

// Mock icons
vi.mock("lucide-react", () => ({
  Plus: () => <span data-testid="plus-icon">+</span>,
  Edit: () => <span data-testid="edit-icon">Edit</span>,
  Trash2: () => <span data-testid="trash-icon">Trash</span>,
  Eye: () => <span data-testid="eye-icon">Eye</span>,
  Car: () => <span data-testid="car-icon">Car</span>,
  Star: () => <span data-testid="star-icon">Star</span>,
  Bell: () => <span data-testid="bell-icon">Bell</span>,
  Battery: () => <span data-testid="battery-icon">Battery</span>,
  MapPin: () => <span data-testid="mappin-icon">MapPin</span>,
  Clock: () => <span data-testid="clock-icon">Clock</span>,
  Calendar: () => <span data-testid="calendar-icon">Calendar</span>,
  Mail: () => <span data-testid="mail-icon">Mail</span>,
  MessageSquare: () => <span data-testid="message-icon">Message</span>,
  Users: () => <span data-testid="users-icon">Users</span>,
  Zap: () => <span data-testid="zap-icon">Zap</span>,
  ArrowLeft: () => <span data-testid="arrow-left-icon">←</span>,
  CheckCircle: () => <span data-testid="check-icon">✓</span>,
  Shield: () => <span data-testid="shield-icon">Shield</span>,
  ChevronLeft: () => <span data-testid="chevron-left-icon">‹</span>,
  ChevronRight: () => <span data-testid="chevron-right-icon">›</span>,
  ChevronDown: () => <span data-testid="chevron-down-icon">↓</span>,
  ChevronUp: () => <span data-testid="chevron-up-icon">↑</span>,
  X: () => <span data-testid="x-icon">X</span>,
}));

// Define types for modal components
interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  [key: string]: unknown;
}

// Mock other components
vi.mock("@/components/resultados/FavoritesButton", () => ({
  FavoritesButton: () => (
    <button data-testid="favorites-button">Favorites</button>
  ),
}));

vi.mock("@/components/resultados/TestDriveModal", () => ({
  TestDriveModal: ({ isOpen }: ModalProps) =>
    isOpen ? <div data-testid="test-drive-modal">Test Drive Modal</div> : null,
}));

vi.mock("@/components/resultados/ContactVendorModal", () => ({
  ContactVendorModal: ({ isOpen }: ModalProps) =>
    isOpen ? <div data-testid="contact-modal">Contact Modal</div> : null,
}));

vi.mock("@/components/resultados/PriceAlertModal", () => ({
  PriceAlertModal: ({ isOpen }: ModalProps) =>
    isOpen ? (
      <div data-testid="price-alert-modal">Price Alert Modal</div>
    ) : null,
}));

vi.mock("@/components/resultados/WhatsAppContactButton", () => ({
  WhatsAppContactButton: () => (
    <button data-testid="whatsapp-button">WhatsApp</button>
  ),
}));

vi.mock("@/components/auth/AuthPromptModal", () => ({
  AuthPromptModal: ({ isOpen }: ModalProps) =>
    isOpen ? <div data-testid="auth-modal">Auth Modal</div> : null,
}));

// Mock Select components
vi.mock("@/components/ui/select", () => ({
  Select: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid="select" {...props}>
      {children}
    </div>
  ),
  SelectContent: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid="select-content" {...props}>
      {children}
    </div>
  ),
  SelectItem: ({
    children,
    value,
    ...props
  }: {
    children: React.ReactNode;
    value: string;
    [key: string]: unknown;
  }) => (
    <div data-testid="select-item" data-value={value} {...props}>
      {children}
    </div>
  ),
  SelectTrigger: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <button data-testid="select-trigger" {...props}>
      {children}
    </button>
  ),
  SelectValue: ({
    placeholder,
    ...props
  }: {
    placeholder?: string;
    [key: string]: unknown;
  }) => (
    <span data-testid="select-value" {...props}>
      {placeholder}
    </span>
  ),
}));

vi.mock("@/components/Header", () => ({
  default: () => <header data-testid="header">Header</header>,
}));

vi.mock("@/components/Footer", () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock("@/hooks/useVehicleViewTracking", () => ({
  useVehicleViewTracking: () => {},
}));

// Mock useAuthActions hook
vi.mock("@/hooks/useAuthCheck", () => ({
  useAuthCheck: () => ({
    user: null,
    isAuthenticated: false,
    requireAuth: vi.fn(),
    authPrompt: { isOpen: false, action: "general" as const },
    closeAuthPrompt: vi.fn(),
    handleAuthSuccess: vi.fn(),
  }),
  useAuthActions: () => ({
    requireAuthForFavorite: vi.fn(),
    requireAuthForTestDrive: vi.fn(),
    requireAuthForMessage: vi.fn(),
    requireAuthForPriceAlert: vi.fn(),
    requireAuthGeneral: vi.fn(),
    authPrompt: { isOpen: false, action: "general" as const },
    closeAuthPrompt: vi.fn(),
    handleAuthSuccess: vi.fn(),
    user: null,
    isAuthenticated: false,
  }),
}));

// Mock usePriceAlert hook
vi.mock("@/hooks/usePriceAlert", () => ({
  usePriceAlert: () => ({
    alerts: [],
    createAlert: vi.fn(),
    updateAlert: vi.fn(),
    deleteAlert: vi.fn(),
  }),
}));

// Mock data module
vi.mock("@/data", () => ({
  colombianDepartments: {
    bogota: "Bogotá",
    antioquia: "Antioquia",
    valle: "Valle del Cauca",
  },
  departmentLabels: {
    bogota: "Bogotá",
    antioquia: "Antioquia",
    valle: "Valle del Cauca",
  },
  getCitiesForDepartment: () => [
    { value: "bogota", label: "Bogotá" },
    { value: "medellin", label: "Medellín" },
  ],
}));

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} data-testid="next-image" />
  ),
}));

// Don't mock React useState - let the components use real React state

// Import the components we want to test
import ProductPage from "@/app/product/[id]/page";
import { ProductForm } from "@/components/dashboard/ProductForm";
import { VehicleCard } from "@/components/resultados/VehicleCard";
import { VehicleListCard } from "@/components/resultados/VehicleListCard";
import VendorVehicleCard from "@/components/dashboard/VendorVehicleCard";

describe("Sale Functionality Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("ProductForm Sale Toggle", () => {
    it("should initialize sale fields correctly for new vehicle", async () => {
      render(
        <ProductForm
          isOpen={true}
          onClose={vi.fn()}
          onSubmit={vi.fn()}
          editingVehicle={null}
          loading={false}
        />
      );

      // Check that sale checkbox is not checked by default
      const saleCheckbox = screen.getByLabelText(/🔥 Activar Oferta/i);
      expect(saleCheckbox).not.toBeChecked();

      // Check that sale price input is not visible
      const salePriceInput = screen.queryByPlaceholderText("40000000");
      expect(salePriceInput).not.toBeInTheDocument();
    });

    it("should initialize sale fields correctly for existing vehicle with sale", async () => {
      const vehicleWithSale = {
        id: "test-vehicle-id",
        name: "Test Vehicle",
        brand: "Tesla",
        type: "carro" as const,
        price: 50000000,
        is_on_sale: true,
        sale_price: 40000000,
        vendorId: "test-vendor-id",
        images: [{ url: "/test-image.jpg", alt: "Test Vehicle" }],
        specifications: {
          range: "400",
          chargeTime: "8",
          warranty: "3 años",
          battery: "100 kWh",
          performance: { maxSpeed: "200", power: "300" },
        },
        deliveryTime: "2 weeks",
        availability: "in-stock" as const,
        passengerCapacity: 5,
        chargingTime: "8 hours",
        maxSpeed: "200 km/h",
        power: "300 kW",
        location: "Bogotá",
        description: "Test vehicle description",
        features: ["Autopilot", "Supercharger"],
        reviews: { average: 4.5, count: 10 },
        vendor: {
          businessName: "Test Dealer",
          phone: "+57 123 456 7890",
          email: "dealer@test.com",
          rating: 4.8,
        },
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      };

      render(
        <ProductForm
          isOpen={true}
          onClose={vi.fn()}
          onSubmit={vi.fn()}
          editingVehicle={vehicleWithSale}
          loading={false}
        />
      );

      // Check that sale checkbox is checked
      const saleCheckbox = screen.getByLabelText(/🔥 Activar Oferta/i);
      expect(saleCheckbox).toBeChecked();

      // Check that sale price input is visible with correct value
      const salePriceInput = screen.getByDisplayValue("40000000");
      expect(salePriceInput).toBeInTheDocument();
    });

    it("should show/hide sale price input when toggle is clicked", async () => {
      const user = userEvent.setup();

      render(
        <ProductForm
          isOpen={true}
          onClose={vi.fn()}
          onSubmit={vi.fn()}
          editingVehicle={null}
          loading={false}
        />
      );

      const saleCheckbox = screen.getByLabelText(/🔥 Activar Oferta/i);

      // Initially, sale price input should not be visible
      expect(screen.queryByPlaceholderText("40000000")).not.toBeInTheDocument();

      // Click the checkbox
      await user.click(saleCheckbox);

      // Wait for the sale price input to appear
      await waitFor(() => {
        expect(screen.getByPlaceholderText("40000000")).toBeInTheDocument();
      });
    });

    it("should validate sale price requirements", async () => {
      const user = userEvent.setup();
      const mockOnSubmit = vi.fn();

      render(
        <ProductForm
          isOpen={true}
          onClose={vi.fn()}
          onSubmit={mockOnSubmit}
          editingVehicle={null}
          loading={false}
        />
      );

      // Fill in required fields using input IDs directly
      await user.type(
        screen.getByPlaceholderText(/Ej: Tesla Model 3/i),
        "Test Vehicle"
      );
      await user.type(screen.getByPlaceholderText(/^Ej: Tesla$/i), "Tesla");
      await user.type(screen.getByDisplayValue("0"), "50000000");
      await user.type(screen.getByPlaceholderText(/Ej: Bogotá/i), "Bogotá");
      await user.type(screen.getByPlaceholderText(/Ej: 400/i), "400");
      // Use getAllBy to get both "Ej: 8" inputs and select the first one (Tiempo de Carga)
      const tiempoCargaInputs = screen.getAllByPlaceholderText(/Ej: 8/i);
      await user.type(tiempoCargaInputs[0], "8");
      await user.type(screen.getByPlaceholderText(/Ej: 75 kWh/i), "100 kWh");
      await user.type(screen.getByPlaceholderText(/Ej: 200/i), "200");
      await user.type(screen.getByPlaceholderText(/Ej: 300/i), "300");

      // Fill warranty value (required field) - this is the warranty input
      const warrantyInputs = screen.getAllByPlaceholderText(/Ej: 8/i);
      await user.type(warrantyInputs[1], "5"); // Second Ej: 8 input is warranty

      // Enable sale and set invalid sale price (greater than regular price)
      const saleCheckbox = screen.getByLabelText(/🔥 Activar Oferta/i);
      await user.click(saleCheckbox);

      // Wait for the sale price input to appear
      await waitFor(() => {
        expect(screen.getByPlaceholderText("40000000")).toBeInTheDocument();
      });

      const salePriceInput = screen.getByPlaceholderText("40000000");
      await user.type(salePriceInput, "60000000"); // Higher than regular price

      // Try to submit
      const submitButton = screen.getByText(/Crear Vehículo/i);
      await user.click(submitButton);

      // Should show validation error
      await waitFor(() => {
        expect(
          screen.getByText(
            /El precio de oferta debe ser menor al precio regular/i
          )
        ).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("should submit form with sale data when valid", async () => {
      const user = userEvent.setup();
      const mockOnSubmit = vi.fn();

      render(
        <ProductForm
          isOpen={true}
          onClose={vi.fn()}
          onSubmit={mockOnSubmit}
          editingVehicle={null}
          loading={false}
        />
      );

      // Fill in required fields using input IDs directly
      await user.type(
        screen.getByPlaceholderText(/Ej: Tesla Model 3/i),
        "Test Vehicle"
      );
      await user.type(screen.getByPlaceholderText(/^Ej: Tesla$/i), "Tesla");
      await user.type(screen.getByDisplayValue("0"), "50000000");
      await user.type(screen.getByPlaceholderText(/Ej: Bogotá/i), "Bogotá");
      await user.type(screen.getByPlaceholderText(/Ej: 400/i), "400");
      // Use getAllBy to get both "Ej: 8" inputs and select the first one (Tiempo de Carga)
      const tiempoCargaInputs = screen.getAllByPlaceholderText(/Ej: 8/i);
      await user.type(tiempoCargaInputs[0], "8");
      await user.type(screen.getByPlaceholderText(/Ej: 75 kWh/i), "100 kWh");
      await user.type(screen.getByPlaceholderText(/Ej: 200/i), "200");
      await user.type(screen.getByPlaceholderText(/Ej: 300/i), "300");

      // Fill warranty value (required field) - this is the warranty input
      const warrantyInputs = screen.getAllByPlaceholderText(/Ej: 8/i);
      await user.type(warrantyInputs[1], "5"); // Second Ej: 8 input is warranty

      // Enable sale and set valid sale price
      const saleCheckbox = screen.getByLabelText(/🔥 Activar Oferta/i);
      await user.click(saleCheckbox);

      // Wait for the sale price input to appear
      await waitFor(() => {
        expect(screen.getByPlaceholderText("40000000")).toBeInTheDocument();
      });

      const salePriceInput = screen.getByPlaceholderText("40000000");
      await user.type(salePriceInput, "40000000");

      // Submit form
      const submitButton = screen.getByText(/Crear Vehículo/i);
      await user.click(submitButton);

      // Check that onSubmit was called with sale data
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          is_on_sale: true,
          sale_price: 40000000,
        })
      );
    });
  });

  describe("Vehicle Display Components", () => {
    const vehicleWithSale = {
      id: "test-vehicle-id",
      name: "Test Vehicle",
      brand: "Tesla",
      type: "carro" as const,
      price: 50000000,
      is_on_sale: true,
      sale_price: 40000000,
      vendorId: "test-vendor-id",
      images: [{ url: "/test-image.jpg", alt: "Test Vehicle" }],
      specifications: {
        range: "400",
        chargeTime: "8",
        warranty: "3 años",
        battery: "100 kWh",
        performance: { maxSpeed: "200", power: "300" },
      },
      deliveryTime: "2 weeks",
      availability: "in-stock" as const,
      passengerCapacity: 5,
      chargingTime: "8 hours",
      maxSpeed: "200 km/h",
      power: "300 kW",
      location: "Bogotá",
      description: "Test vehicle description",
      features: ["Autopilot", "Supercharger"],
      reviews: { average: 4.5, count: 10 },
      vendor: {
        businessName: "Test Dealer",
        phone: "+57 123 456 7890",
        email: "dealer@test.com",
        rating: 4.8,
      },
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    };

    const vehicleWithoutSale = {
      ...vehicleWithSale,
      is_on_sale: false,
      sale_price: undefined,
    };

    it("should display sale badge and pricing for VehicleCard", () => {
      render(<VehicleCard vehicle={vehicleWithSale} />);

      // Check for sale badge
      expect(screen.getByText(/🔥 ¡EN OFERTA!/i)).toBeInTheDocument();

      // Check for sale price (Colombian format)
      expect(screen.getByText(/\$ 40\.000\.000/i)).toBeInTheDocument();

      // Check for crossed out regular price (Colombian format)
      expect(screen.getByText(/\$ 50\.000\.000/i)).toBeInTheDocument();

      // Check for discount percentage
      expect(screen.getByText(/-20% OFF/i)).toBeInTheDocument();
    });

    it("should not display sale elements for VehicleCard without sale", () => {
      render(<VehicleCard vehicle={vehicleWithoutSale} />);

      // Should not show sale badge
      expect(screen.queryByText(/🔥 ¡EN OFERTA!/i)).not.toBeInTheDocument();

      // Should show regular price only (Colombian format)
      expect(screen.getByText(/\$ 50\.000\.000/i)).toBeInTheDocument();
      expect(screen.queryByText(/\$ 40\.000\.000/i)).not.toBeInTheDocument();
    });

    it("should display sale badge and pricing for VehicleListCard", () => {
      render(<VehicleListCard vehicle={vehicleWithSale} />);

      // Check for sale badge
      expect(screen.getByText(/🔥 ¡EN OFERTA!/i)).toBeInTheDocument();

      // Check for sale price (Colombian format)
      expect(screen.getByText(/\$ 40\.000\.000/i)).toBeInTheDocument();

      // Check for crossed out regular price (Colombian format)
      expect(screen.getByText(/\$ 50\.000\.000/i)).toBeInTheDocument();

      // Check for discount percentage
      expect(screen.getByText(/-20% OFF/i)).toBeInTheDocument();
    });

    it("should display sale badge and pricing for VendorVehicleCard", () => {
      render(
        <VendorVehicleCard
          vehicle={vehicleWithSale}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
          onView={vi.fn()}
        />
      );

      // Check for sale badge
      expect(screen.getByText(/🔥 EN OFERTA/i)).toBeInTheDocument();

      // Check for sale price (Colombian format)
      expect(screen.getByText(/\$ 40\.000\.000/i)).toBeInTheDocument();

      // Check for crossed out regular price (Colombian format)
      expect(screen.getByText(/\$ 50\.000\.000/i)).toBeInTheDocument();

      // Check for discount percentage
      expect(screen.getByText(/-20% OFF/i)).toBeInTheDocument();
    });
  });

  describe("Product Page Sale Display", () => {
    it("should display sale badge and pricing on product page", async () => {
      // Mock the vehicle data with sale
      const { getVehicleById } = await import("@/lib/vehicle-queries");
      vi.mocked(getVehicleById).mockResolvedValue({
        id: "test-vehicle-id",
        name: "Test Vehicle",
        brand: "Tesla",
        type: "carro" as const,
        price: 50000000,
        is_on_sale: true,
        sale_price: 40000000,
        vendorId: "test-vendor-id",
        images: [{ url: "/test-image.jpg", alt: "Test Vehicle" }],
        specifications: {
          range: "400",
          chargeTime: "8",
          warranty: "3 años",
          battery: "100 kWh",
          performance: { maxSpeed: "200", power: "300" },
        },
        deliveryTime: "2 weeks",
        availability: "in-stock" as const,
        passengerCapacity: 5,
        chargingTime: "8 hours",
        maxSpeed: "200 km/h",
        power: "300 kW",
        location: "Bogotá",
        description: "Test vehicle description",
        features: ["Autopilot", "Supercharger"],
        reviews: { average: 4.5, count: 10 },
        vendor: {
          businessName: "Test Dealer",
          phone: "+57 123 456 7890",
          email: "dealer@test.com",
          rating: 4.8,
        },
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      });

      render(<ProductPage />);

      // Wait for the component to load
      await waitFor(() => {
        expect(screen.getByText("Test Vehicle")).toBeInTheDocument();
      });

      // Check for sale badge
      expect(screen.getByText(/🔥 ¡OFERTA ESPECIAL!/i)).toBeInTheDocument();

      // Check for sale price (larger text) - Colombian format
      expect(screen.getByText(/40\.000\.000 COP/i)).toBeInTheDocument();

      // Check for crossed out regular price - Colombian format
      expect(screen.getByText(/50\.000\.000 COP/i)).toBeInTheDocument();

      // Check for savings amount - Colombian format (text might be split across elements)
      const savingsElements = screen.getAllByText((_, element) => {
        return Boolean(
          element?.textContent?.includes("Ahorras:") &&
            element?.textContent?.includes("10.000.000")
        );
      });
      expect(savingsElements.length).toBeGreaterThan(0);

      // Check for discount percentage
      expect(screen.getByText(/-20% OFF/i)).toBeInTheDocument();
    });
  });

  describe("Database Mapping Functions", () => {
    it("should correctly map sale fields from frontend to database", async () => {
      const { vehicleToDatabase } = await import("@/lib/database-mapping");

      const frontendVehicle = {
        id: "test-vehicle-id",
        name: "Test Vehicle",
        brand: "Tesla",
        type: "carro" as const,
        price: 50000000,
        is_on_sale: true,
        sale_price: 40000000,
        vendorId: "test-vendor-id",
        images: [{ url: "/test-image.jpg", alt: "Test Vehicle" }],
        specifications: {
          range: "400",
          chargeTime: "8",
          warranty: "3 años",
          battery: "100 kWh",
          performance: { maxSpeed: "200", power: "300" },
        },
        deliveryTime: "2 weeks",
        availability: "in-stock" as const,
        passengerCapacity: 5,
        chargingTime: "8 hours",
        maxSpeed: "200 km/h",
        power: "300 kW",
        location: "Bogotá",
        description: "Test vehicle description",
        features: ["Autopilot", "Supercharger"],
        reviews: { average: 4.5, count: 10 },
        vendor: {
          businessName: "Test Dealer",
          phone: "+57 123 456 7890",
          email: "dealer@test.com",
          rating: 4.8,
        },
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      };

      const databaseVehicle = vehicleToDatabase(frontendVehicle);

      expect(databaseVehicle.is_on_sale).toBe(true);
      expect(databaseVehicle.sale_price).toBe(40000000);
    });

    it("should correctly map sale fields from database to frontend", async () => {
      const { databaseToVehicle } = await import("@/lib/database-mapping");

      const databaseVehicle = {
        id: "test-vehicle-id",
        vendor_id: "test-vendor-id",
        name: "Test Vehicle",
        brand: "Tesla",
        type: "carro",
        price: 50000000,
        is_on_sale: true,
        sale_price: 40000000,
        images: [{ url: "/test-image.jpg", alt: "Test Vehicle" }],
        specifications: {
          range: "400",
          chargeTime: "8",
          warranty: "3 años",
          battery: "100 kWh",
          performance: { maxSpeed: "200", power: "300" },
        },
        delivery_time: "2 weeks",
        availability: "in-stock",
        passenger_capacity: 5,
        charging_time: "8 hours",
        max_speed: "200 km/h",
        power: "300 kW",
        location: "Bogotá",
        description: "Test vehicle description",
        features: ["Autopilot", "Supercharger"],
        reviews: { average: 4.5, count: 10 },
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };

      const frontendVehicle = databaseToVehicle(databaseVehicle);

      expect(frontendVehicle.is_on_sale).toBe(true);
      expect(frontendVehicle.sale_price).toBe(40000000);
    });

    it("should handle undefined sale_price correctly", async () => {
      const { databaseToVehicle } = await import("@/lib/database-mapping");

      const databaseVehicle = {
        id: "test-vehicle-id",
        vendor_id: "test-vendor-id",
        name: "Test Vehicle",
        brand: "Tesla",
        type: "carro",
        price: 50000000,
        is_on_sale: false,
        sale_price: null,
        images: [],
        specifications: {},
        delivery_time: "",
        availability: "in-stock",
        passenger_capacity: 5,
        charging_time: "",
        max_speed: "",
        power: "",
        location: "",
        description: "",
        features: [],
        reviews: { average: 0, count: 0 },
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };

      const frontendVehicle = databaseToVehicle(databaseVehicle);

      expect(frontendVehicle.is_on_sale).toBe(false);
      expect(frontendVehicle.sale_price).toBeUndefined();
    });
  });
});
