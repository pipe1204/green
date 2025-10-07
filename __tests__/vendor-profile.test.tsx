import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import VendorProfilePage from "@/components/dashboard/VendorProfile";
import { useAuth } from "@/components/auth/AuthProvider";
import type { User, Session } from "@supabase/supabase-js";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

// Mock auth provider
vi.mock("@/components/auth/AuthProvider", () => ({
  useAuth: vi.fn(),
}));

// Mock Supabase
vi.mock("@/lib/supabase", () => ({
  createClient: vi.fn(),
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: {
              id: "test-vendor-id",
              full_name: "John Vendor",
              email: "vendor@example.com",
              created_at: "2024-01-01T00:00:00Z",
            },
            error: null,
          })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: {
                id: "test-vendor-id",
                full_name: "John Vendor",
                email: "vendor@example.com",
                created_at: "2024-01-01T00:00:00Z",
              },
              error: null,
            })),
          })),
        })),
      })),
    })),
    auth: {
      getUser: vi.fn(() => ({
        data: { user: { id: "test-vendor-id" } },
        error: null,
      })),
      getSession: vi.fn(() => ({
        data: {
          session: {
            access_token: "test-access-token",
            user: { id: "test-vendor-id" },
          },
        },
        error: null,
      })),
    },
  },
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  User: () => <div data-testid="user-icon" />,
  Mail: () => <div data-testid="mail-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  Save: () => <div data-testid="save-icon" />,
  Trash2: () => <div data-testid="trash-icon" />,
  Zap: () => <div data-testid="zap-icon" />,
  Building2: () => <div data-testid="building-icon" />,
  MapPin: () => <div data-testid="map-pin-icon" />,
  Phone: () => <div data-testid="phone-icon" />,
  Globe: () => <div data-testid="globe-icon" />,
  FileText: () => <div data-testid="file-text-icon" />,
  ChevronDown: () => <div data-testid="chevron-down-icon" />,
}));

// Mock data
vi.mock("@/data", () => ({
  colombianDepartments: {
    cundinamarca: ["Bogotá", "Zipaquirá", "Chía"],
    antioquia: ["Medellín", "Envigado", "Bello"],
  },
  departmentLabels: {
    cundinamarca: "Cundinamarca",
    antioquia: "Antioquia",
  },
}));

// Mock UI components
vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    className,
    variant,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    variant?: string;
    [key: string]: unknown;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-variant={variant}
      {...props}
    >
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/input", () => ({
  Input: ({
    value,
    onChange,
    placeholder,
    disabled,
    className,
    id,
    ...props
  }: {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    id?: string;
    [key: string]: unknown;
  }) => (
    <input
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      {...props}
    />
  ),
}));

vi.mock("@/components/ui/label", () => ({
  Label: ({
    children,
    htmlFor,
    className,
    ...props
  }: {
    children: React.ReactNode;
    htmlFor?: string;
    className?: string;
    [key: string]: unknown;
  }) => (
    <label htmlFor={htmlFor} className={className} {...props}>
      {children}
    </label>
  ),
}));

vi.mock("@/components/ui/alert", () => ({
  Alert: ({
    children,
    variant,
    className,
    ...props
  }: {
    children: React.ReactNode;
    variant?: string;
    className?: string;
    [key: string]: unknown;
  }) => (
    <div className={className} data-variant={variant} {...props}>
      {children}
    </div>
  ),
  AlertDescription: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => <div {...props}>{children}</div>,
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({
    children,
    className,
    ...props
  }: {
    children: React.ReactNode;
    className?: string;
    [key: string]: unknown;
  }) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  CardHeader: ({
    children,
    className,
    ...props
  }: {
    children: React.ReactNode;
    className?: string;
    [key: string]: unknown;
  }) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  CardTitle: ({
    children,
    className,
    ...props
  }: {
    children: React.ReactNode;
    className?: string;
    [key: string]: unknown;
  }) => (
    <h3 className={className} {...props}>
      {children}
    </h3>
  ),
  CardDescription: ({
    children,
    className,
    ...props
  }: {
    children: React.ReactNode;
    className?: string;
    [key: string]: unknown;
  }) => (
    <p className={className} {...props}>
      {children}
    </p>
  ),
  CardContent: ({
    children,
    className,
    ...props
  }: {
    children: React.ReactNode;
    className?: string;
    [key: string]: unknown;
  }) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
}));

vi.mock("@/components/ui/select", () => ({
  Select: ({
    children,
  }: {
    children: React.ReactNode;
    onValueChange?: (value: string) => void;
  }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
      <div>
        <div onClick={() => setIsOpen(!isOpen)} data-testid="select-trigger">
          {children}
        </div>
        {isOpen && <div data-testid="select-content">{children}</div>}
      </div>
    );
  },
  SelectTrigger: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div
      className={className}
      role="combobox"
      aria-label="Select option"
      aria-controls="select-content"
      aria-expanded="false"
    >
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
    <div {...props} data-testid="select-content" id="select-content">
      {children}
    </div>
  ),
  SelectItem: ({
    children,
    value,
    onSelect,
    ...props
  }: {
    children: React.ReactNode;
    value: string;
    onSelect?: (value: string) => void;
    [key: string]: unknown;
  }) => (
    <div
      onClick={() => onSelect?.(value)}
      data-value={value}
      role="option"
      aria-selected="false"
      {...props}
    >
      {children}
    </div>
  ),
  SelectValue: ({
    placeholder,
    ...props
  }: {
    placeholder?: string;
    [key: string]: unknown;
  }) => <span {...props}>{placeholder}</span>,
}));

// Mock VendorAccountDeletionModal
vi.mock("@/components/dashboard/VendorAccountDeletionModal", () => ({
  VendorAccountDeletionModal: ({
    isOpen,
    onClose,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div data-testid="vendor-account-deletion-modal">
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null,
}));

// Create mock types that extend the Supabase types
type MockUser = Pick<User, "id" | "email"> & {
  role: string;
};

type MockSession = Pick<Session, "access_token">;

interface MockVendorProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  business_name: string;
  business_type: string;
  nit: string;
  address: string;
  city: string;
  department: string;
  state: string;
  country: string;
  phone: string;
  website: string;
  description: string;
  locations: unknown[];
  is_verified: boolean;
  rating: number;
  total_reviews: number;
  business_created_at: string;
  business_updated_at: string;
}

interface MockRouter {
  push: ReturnType<typeof vi.fn>;
  back: ReturnType<typeof vi.fn>;
  forward: ReturnType<typeof vi.fn>;
  refresh: ReturnType<typeof vi.fn>;
  replace: ReturnType<typeof vi.fn>;
  prefetch: ReturnType<typeof vi.fn>;
}

const mockUser: MockUser = {
  id: "test-vendor-id",
  email: "vendor@example.com",
  role: "vendor",
};

const mockSession: MockSession = {
  access_token: "test-access-token",
};

const mockVendorProfile: MockVendorProfile = {
  id: "test-vendor-id",
  email: "vendor@example.com",
  full_name: "John Vendor",
  avatar_url: null,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  business_name: "Test Business",
  business_type: "tienda",
  nit: "900123456-7",
  address: "123 Test Street",
  city: "Bogotá",
  department: "cundinamarca",
  state: "Cundinamarca",
  country: "Colombia",
  phone: "+57 300 123 4567",
  website: "https://testbusiness.com",
  description: "Test business description",
  locations: [],
  is_verified: true,
  rating: 4.5,
  total_reviews: 10,
  business_created_at: "2024-01-01T00:00:00Z",
  business_updated_at: "2024-01-01T00:00:00Z",
};

describe("VendorProfilePage", () => {
  const mockRouter: MockRouter = {
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useRouter).mockReturnValue(mockRouter);
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockReturnValue("profile"),
      has: vi.fn(),
      getAll: vi.fn(),
      keys: vi.fn(),
      values: vi.fn(),
      entries: vi.fn(),
      forEach: vi.fn(),
      toString: vi.fn(),
      append: vi.fn(),
      delete: vi.fn(),
      set: vi.fn(),
      sort: vi.fn(),
    } as unknown as ReturnType<typeof useSearchParams>);
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser as User,
      session: mockSession as Session,
      loading: false,
      signIn: vi.fn().mockResolvedValue({ error: null }),
      signUp: vi.fn().mockResolvedValue({ error: null }),
      signInWithGoogle: vi.fn().mockResolvedValue({ error: null }),
      signOut: vi.fn().mockResolvedValue(undefined),
    });

    // Mock successful profile fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ profile: mockVendorProfile }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders vendor profile page correctly", async () => {
    render(<VendorProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("Mi Perfil")).toBeInTheDocument();
      expect(
        screen.getByText("Gestiona tu información personal y de negocio")
      ).toBeInTheDocument();
    });

    // Check personal information section
    expect(screen.getByText("Información Personal")).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("vendor@example.com")).toBeInTheDocument();

    // Check business information section
    expect(screen.getByText("Información del Negocio")).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre del negocio/i)).toBeInTheDocument();
    expect(screen.getByText("Tipo de Negocio")).toBeInTheDocument();
    expect(screen.getByLabelText(/nit/i)).toBeInTheDocument();
  });

  it("loads and displays vendor profile data", async () => {
    render(<VendorProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John Vendor")).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("vendor@example.com")
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test Business")).toBeInTheDocument();
      expect(screen.getByDisplayValue("900123456-7")).toBeInTheDocument();
    });
  });

  it("validates required personal fields", async () => {
    render(<VendorProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John Vendor")).toBeInTheDocument();
    });

    // Clear the name field
    const nameInput = screen.getByLabelText(/nombre completo/i);
    fireEvent.change(nameInput, { target: { value: "" } });

    // Try to save
    const saveButton = screen.getByText(/guardar cambios/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Full name is required")).toBeInTheDocument();
    });
  });

  it("validates required business fields", async () => {
    render(<VendorProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Business")).toBeInTheDocument();
    });

    // Clear the business name field
    const businessNameInput = screen.getByLabelText(/nombre del negocio/i);
    fireEvent.change(businessNameInput, { target: { value: "" } });

    // Try to save
    const saveButton = screen.getByText(/guardar cambios/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Business name is required")).toBeInTheDocument();
    });
  });

  it("validates NIT format", async () => {
    render(<VendorProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("900123456-7")).toBeInTheDocument();
    });

    const nitInput = screen.getByLabelText(/nit/i);

    // Test invalid NIT format
    fireEvent.change(nitInput, { target: { value: "123456789" } }); // Missing dash and check digit
    const saveButton = screen.getByText(/guardar cambios/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          /el nit debe tener el formato: 9 dígitos \+ 1 dígito de verificación/i
        )
      ).toBeInTheDocument();
    });

    // Test another invalid format
    fireEvent.change(nitInput, { target: { value: "12345678-9" } }); // Only 8 digits before dash
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          /el nit debe tener el formato: 9 dígitos \+ 1 dígito de verificación/i
        )
      ).toBeInTheDocument();
    });
  });

  it("accepts valid NIT format", async () => {
    render(<VendorProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("900123456-7")).toBeInTheDocument();
    });

    const nitInput = screen.getByLabelText(/nit/i);

    // Test valid NIT format
    fireEvent.change(nitInput, { target: { value: "900123456-7" } }); // Valid format
    const saveButton = screen.getByText(/guardar cambios/i);

    // Mock successful update
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ profile: mockVendorProfile }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: { ...mockVendorProfile, nit: "900123456-7" },
        }),
      });

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.queryByText(/el nit debe tener el formato/i)
      ).not.toBeInTheDocument();
    });
  });

  it("validates website URL format", async () => {
    render(<VendorProfilePage />);

    await waitFor(() => {
      expect(
        screen.getByDisplayValue("https://testbusiness.com")
      ).toBeInTheDocument();
    });

    const websiteInput = screen.getByLabelText(/sitio web/i);

    // Test invalid URL
    fireEvent.change(websiteInput, { target: { value: "invalid-url" } });
    const saveButton = screen.getByText(/guardar cambios/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText("Website must start with http:// or https://")
      ).toBeInTheDocument();
    });
  });

  it("handles department and city selection", async () => {
    render(<VendorProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Business")).toBeInTheDocument();
    });

    // Test department selection - find by label text
    const departmentLabel = screen.getByText("Departamento");
    expect(departmentLabel).toBeInTheDocument();

    // Test city selection - find by label text
    const cityLabel = screen.getByText("Ciudad");
    expect(cityLabel).toBeInTheDocument();

    // Check that department options are available
    expect(screen.getByText("Cundinamarca")).toBeInTheDocument();
    expect(screen.getByText("Antioquia")).toBeInTheDocument();

    // Check that city options are available
    expect(screen.getByText("Bogotá")).toBeInTheDocument();
    expect(screen.getByText("Zipaquirá")).toBeInTheDocument();
    expect(screen.getByText("Chía")).toBeInTheDocument();
  });

  it("successfully updates vendor profile", async () => {
    // Mock successful update
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ profile: mockVendorProfile }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: {
            ...mockVendorProfile,
            full_name: "Jane Vendor",
            business_name: "Updated Business",
          },
        }),
      });

    render(<VendorProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John Vendor")).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/nombre completo/i);
    fireEvent.change(nameInput, { target: { value: "Jane Vendor" } });

    const businessNameInput = screen.getByLabelText(/nombre del negocio/i);
    fireEvent.change(businessNameInput, {
      target: { value: "Updated Business" },
    });

    const saveButton = screen.getByText(/guardar cambios/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/vendor/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-access-token",
        },
        body: JSON.stringify({
          full_name: "Jane Vendor",
          business_name: "Updated Business",
          business_type: "tienda",
          nit: "900123456-7",
          address: "123 Test Street",
          city: "Bogotá",
          department: "cundinamarca",
          state: "Cundinamarca",
          country: "Colombia",
          phone: "+57 300 123 4567",
          website: "https://testbusiness.com",
          description: "Test business description",
        }),
      });
    });

    await waitFor(() => {
      expect(
        screen.getByText("Profile updated successfully!")
      ).toBeInTheDocument();
    });
  });

  it("handles profile update errors", async () => {
    // Mock failed update
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ profile: mockVendorProfile }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Update failed" }),
      });

    render(<VendorProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John Vendor")).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/nombre completo/i);
    fireEvent.change(nameInput, { target: { value: "Jane Vendor" } });

    const saveButton = screen.getByText(/guardar cambios/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Update failed")).toBeInTheDocument();
    });
  });

  it("displays loading state", () => {
    // Mock loading state
    global.fetch = vi.fn().mockImplementation(() => new Promise(() => {}));

    render(<VendorProfilePage />);

    expect(screen.getByText("Loading profile...")).toBeInTheDocument();
  });

  it("displays error state when profile fetch fails", async () => {
    // Mock failed fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Failed to fetch profile" }),
    });

    render(<VendorProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch profile")).toBeInTheDocument();
    });
  });

  it("opens vendor account deletion modal", async () => {
    render(<VendorProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John Vendor")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText(/eliminar cuenta/i);
    fireEvent.click(deleteButton);

    expect(
      screen.getByTestId("vendor-account-deletion-modal")
    ).toBeInTheDocument();
  });

  it("closes vendor account deletion modal", async () => {
    render(<VendorProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John Vendor")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText(/eliminar cuenta/i);
    fireEvent.click(deleteButton);

    expect(
      screen.getByTestId("vendor-account-deletion-modal")
    ).toBeInTheDocument();

    const closeButton = screen.getByText("Close Modal");
    fireEvent.click(closeButton);

    expect(
      screen.queryByTestId("vendor-account-deletion-modal")
    ).not.toBeInTheDocument();
  });

  it("dispatches profileUpdated event on successful update", async () => {
    const mockDispatchEvent = vi.spyOn(window, "dispatchEvent");

    // Mock successful update
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ profile: mockVendorProfile }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: { ...mockVendorProfile, full_name: "Jane Vendor" },
        }),
      });

    render(<VendorProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John Vendor")).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/nombre completo/i);
    fireEvent.change(nameInput, { target: { value: "Jane Vendor" } });

    const saveButton = screen.getByText(/guardar cambios/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "profileUpdated",
          detail: {
            profile: { ...mockVendorProfile, full_name: "Jane Vendor" },
          },
        })
      );
    });
  });

  it("handles no access token gracefully", async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser as User,
      session: null,
      loading: false,
      signIn: vi.fn().mockResolvedValue({ error: null }),
      signUp: vi.fn().mockResolvedValue({ error: null }),
      signInWithGoogle: vi.fn().mockResolvedValue({ error: null }),
      signOut: vi.fn().mockResolvedValue(undefined),
    });

    render(<VendorProfilePage />);

    // When there's no access token, the component should show an error
    await waitFor(() => {
      expect(screen.getByText("No access token available")).toBeInTheDocument();
    });

    // The profile form should not be rendered when there's no access token
    expect(screen.queryByDisplayValue("John Vendor")).not.toBeInTheDocument();
  });

  it("validates name length constraints", async () => {
    render(<VendorProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John Vendor")).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/nombre completo/i);

    // Test minimum length
    fireEvent.change(nameInput, { target: { value: "A" } });
    const saveButton = screen.getByText(/guardar cambios/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText("Full name must be at least 2 characters")
      ).toBeInTheDocument();
    });

    // Test maximum length
    fireEvent.change(nameInput, { target: { value: "A".repeat(51) } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText("Full name must be less than 50 characters")
      ).toBeInTheDocument();
    });
  });

  it("validates business name length constraints", async () => {
    render(<VendorProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Business")).toBeInTheDocument();
    });

    const businessNameInput = screen.getByLabelText(/nombre del negocio/i);

    // Test minimum length
    fireEvent.change(businessNameInput, { target: { value: "A" } });
    const saveButton = screen.getByText(/guardar cambios/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText("Business name must be at least 2 characters")
      ).toBeInTheDocument();
    });

    // Test maximum length
    fireEvent.change(businessNameInput, { target: { value: "A".repeat(101) } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText("Business name must be less than 100 characters")
      ).toBeInTheDocument();
    });
  });
});
