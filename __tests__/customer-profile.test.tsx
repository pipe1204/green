import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { CustomerProfilePage } from "@/components/dashboard/CustomerProfile";
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
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: {
              id: "test-user-id",
              full_name: "John Doe",
              email: "test@example.com",
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
                id: "test-user-id",
                full_name: "John Doe",
                email: "test@example.com",
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
        data: { user: { id: "test-user-id" } },
        error: null,
      })),
      getSession: vi.fn(() => ({
        data: {
          session: {
            access_token: "test-access-token",
            user: { id: "test-user-id" },
          },
        },
        error: null,
      })),
    },
  })),
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: {
              id: "test-user-id",
              full_name: "John Doe",
              email: "test@example.com",
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
                id: "test-user-id",
                full_name: "John Doe",
                email: "test@example.com",
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
        data: { user: { id: "test-user-id" } },
        error: null,
      })),
      getSession: vi.fn(() => ({
        data: {
          session: {
            access_token: "test-access-token",
            user: { id: "test-user-id" },
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
  AlertTriangle: () => <div data-testid="alert-icon" />,
  ChevronDown: () => <div data-testid="chevron-down-icon" />,
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

// Mock AccountDeletionModal
vi.mock("@/components/dashboard/AccountDeletionModal", () => ({
  AccountDeletionModal: ({
    isOpen,
    onClose,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div data-testid="account-deletion-modal">
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null,
}));

// Create mock types that extend the Supabase types
type MockUser = Pick<User, "id" | "email"> & {
  role: string;
};

type MockSession = Pick<Session, "access_token">;

interface MockProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

const mockUser: MockUser = {
  id: "test-user-id",
  email: "test@example.com",
  role: "customer",
};

const mockSession: MockSession = {
  access_token: "test-access-token",
};

const mockProfile: MockProfile = {
  id: "test-user-id",
  email: "test@example.com",
  full_name: "John Doe",
  avatar_url: null,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

interface MockRouter {
  push: ReturnType<typeof vi.fn>;
  back: ReturnType<typeof vi.fn>;
  forward: ReturnType<typeof vi.fn>;
  refresh: ReturnType<typeof vi.fn>;
  replace: ReturnType<typeof vi.fn>;
  prefetch: ReturnType<typeof vi.fn>;
}

describe("CustomerProfilePage", () => {
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
      json: async () => ({ profile: mockProfile }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders customer profile page correctly", async () => {
    render(<CustomerProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("Mi Perfil")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Administra tu información personal y configuración de cuenta"
        )
      ).toBeInTheDocument();
    });

    // Check form fields are present
    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByText("Miembro desde")).toBeInTheDocument();
  });

  it("loads and displays customer profile data", async () => {
    render(<CustomerProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
      expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
    });
  });

  it("validates required fields", async () => {
    render(<CustomerProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
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

  it("validates name length constraints", async () => {
    render(<CustomerProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
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

  it("successfully updates customer profile", async () => {
    // Mock successful update
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ profile: mockProfile }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: { ...mockProfile, full_name: "Jane Doe" },
        }),
      });

    render(<CustomerProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/nombre completo/i);
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });

    const saveButton = screen.getByText(/guardar cambios/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/customer/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-access-token",
        },
        body: JSON.stringify({
          full_name: "Jane Doe",
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
        json: async () => ({ profile: mockProfile }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Update failed" }),
      });

    render(<CustomerProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/nombre completo/i);
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });

    const saveButton = screen.getByText(/guardar cambios/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Update failed")).toBeInTheDocument();
    });
  });

  it("displays loading state", () => {
    // Mock loading state
    global.fetch = vi.fn().mockImplementation(() => new Promise(() => {}));

    render(<CustomerProfilePage />);

    expect(screen.getByText("Loading profile...")).toBeInTheDocument();
  });

  it("displays error state when profile fetch fails", async () => {
    // Mock failed fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Failed to fetch profile" }),
    });

    render(<CustomerProfilePage />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Failed to load profile. Please try refreshing the page."
        )
      ).toBeInTheDocument();
    });
  });

  it("opens account deletion modal", async () => {
    render(<CustomerProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText(/eliminar cuenta/i);
    fireEvent.click(deleteButton);

    expect(screen.getByTestId("account-deletion-modal")).toBeInTheDocument();
  });

  it("closes account deletion modal", async () => {
    render(<CustomerProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText(/eliminar cuenta/i);
    fireEvent.click(deleteButton);

    expect(screen.getByTestId("account-deletion-modal")).toBeInTheDocument();

    const closeButton = screen.getByText("Close Modal");
    fireEvent.click(closeButton);

    expect(
      screen.queryByTestId("account-deletion-modal")
    ).not.toBeInTheDocument();
  });

  it("dispatches profileUpdated event on successful update", async () => {
    const mockDispatchEvent = vi.spyOn(window, "dispatchEvent");

    // Mock successful update
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ profile: mockProfile }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          profile: { ...mockProfile, full_name: "Jane Doe" },
        }),
      });

    render(<CustomerProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/nombre completo/i);
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });

    const saveButton = screen.getByText(/guardar cambios/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "profileUpdated",
          detail: { profile: { ...mockProfile, full_name: "Jane Doe" } },
        })
      );
    });
  });

  it("handles no access token gracefully", async () => {
    // Mock fetch to handle different scenarios
    global.fetch = vi.fn().mockImplementation((url, options) => {
      // Successful GET request for profile fetch
      if (
        url.includes("/api/customer/profile") &&
        (!options || !options.method || options.method === "GET")
      ) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            profile: {
              id: "test-user-id",
              full_name: "John Doe",
              email: "test@example.com",
              created_at: "2024-01-01T00:00:00Z",
            },
          }),
        });
      }
      // Failed PATCH request for save operation
      return Promise.resolve({
        ok: false,
        status: 401,
        json: async () => ({ error: "No access token available" }),
      });
    });

    render(<CustomerProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/nombre completo/i);
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });

    const saveButton = screen.getByText(/guardar cambios/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("No access token available")).toBeInTheDocument();
    });
  });
});
