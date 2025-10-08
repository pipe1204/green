import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

// Mock the Supabase client
const mockSupabaseAuth = {
  getUser: vi.fn(),
};

// Create mock functions that can be chained and support mockResolvedValueOnce
const mockSingle = vi.fn();
const mockEq = vi.fn(() => ({
  single: mockSingle,
  eq: vi.fn(() => ({ single: mockSingle })),
}));
const mockSelect = vi.fn(() => ({ eq: mockEq }));
const mockUpdateSingle = vi.fn();
const mockUpdateSelect = vi.fn(() => ({ single: mockUpdateSingle }));
const mockUpdateEq = vi.fn(() => ({ select: mockUpdateSelect }));
const mockUpdate = vi.fn(() => ({ eq: mockUpdateEq }));

const mockSupabaseFrom = vi.fn(() => ({
  select: mockSelect,
  update: mockUpdate,
}));

const mockSupabase = {
  auth: mockSupabaseAuth,
  from: mockSupabaseFrom,
};

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => mockSupabase,
}));

// Mock the database mapping function
vi.mock("@/lib/database-mapping", () => ({
  databaseToVehicle: vi.fn((vehicle) => ({
    id: vehicle.id,
    name: vehicle.name,
    price: vehicle.price,
    is_on_sale: vehicle.is_on_sale,
    sale_price: vehicle.sale_price,
    // ... other required fields
  })),
}));

describe("Sale API Route Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("PATCH /api/vendor/vehicles/[id]/sale", () => {
    it("should successfully update vehicle sale status", async () => {
      // Mock authentication
      mockSupabaseAuth.getUser.mockResolvedValue({
        data: { user: { id: "test-user-id" } },
        error: null,
      });

      // Mock vehicle ownership verification
      const mockVehicle = {
        id: "test-vehicle-id",
        vendor_id: "test-vendor-id",
        price: 50000000,
      };

      const mockVendor = {
        id: "test-vendor-id",
      };

      // Mock the database calls
      mockSingle
        .mockResolvedValueOnce({ data: mockVehicle, error: null }) // Vehicle fetch
        .mockResolvedValueOnce({ data: mockVendor, error: null }); // Vendor verification

      // Mock successful update
      const updatedVehicle = {
        ...mockVehicle,
        is_on_sale: true,
        sale_price: 40000000,
      };

      mockUpdateSingle.mockResolvedValue({ data: updatedVehicle, error: null });

      // Import the API route handler
      const { PATCH } = await import(
        "@/app/api/vendor/vehicles/[id]/sale/route"
      );

      // Create request
      const request = new NextRequest(
        "http://localhost:3000/api/vendor/vehicles/test-vehicle-id/sale",
        {
          method: "PATCH",
          headers: {
            authorization: "Bearer test-token",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            is_on_sale: true,
            sale_price: 40000000,
          }),
        }
      );

      // Mock the route context
      const context = {
        params: { id: "test-vehicle-id" },
      };

      // Call the API
      const response = await PATCH(request, context);
      const responseData = await response.json();

      // Assertions
      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.vehicle).toBeDefined();
      expect(responseData.vehicle.is_on_sale).toBe(true);
      expect(responseData.vehicle.sale_price).toBe(40000000);
    });

    it("should return 401 for missing authorization header", async () => {
      const { PATCH } = await import(
        "@/app/api/vendor/vehicles/[id]/sale/route"
      );

      const request = new NextRequest(
        "http://localhost:3000/api/vendor/vehicles/test-vehicle-id/sale",
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            is_on_sale: true,
            sale_price: 40000000,
          }),
        }
      );

      const context = {
        params: { id: "test-vehicle-id" },
      };

      const response = await PATCH(request, context);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.error).toContain("Unauthorized");
    });

    it("should return 400 for invalid sale price", async () => {
      // Mock authentication
      mockSupabaseAuth.getUser.mockResolvedValue({
        data: { user: { id: "test-user-id" } },
        error: null,
      });

      const { PATCH } = await import(
        "@/app/api/vendor/vehicles/[id]/sale/route"
      );

      const request = new NextRequest(
        "http://localhost:3000/api/vendor/vehicles/test-vehicle-id/sale",
        {
          method: "PATCH",
          headers: {
            authorization: "Bearer test-token",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            is_on_sale: true,
            sale_price: 60000000, // Higher than regular price
          }),
        }
      );

      const context = {
        params: { id: "test-vehicle-id" },
      };

      // Mock vehicle with regular price
      const mockVehicle = {
        id: "test-vehicle-id",
        vendor_id: "test-vendor-id",
        price: 50000000,
      };

      mockSingle
        .mockResolvedValueOnce({ data: mockVehicle, error: null }) // Vehicle fetch
        .mockResolvedValueOnce({ data: { id: "test-vendor-id" }, error: null }); // Vendor verification

      const response = await PATCH(request, context);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toContain(
        "Sale price must be less than the regular price"
      );
    });

    it("should return 400 for missing sale price when on sale", async () => {
      // Mock authentication
      mockSupabaseAuth.getUser.mockResolvedValue({
        data: { user: { id: "test-user-id" } },
        error: null,
      });

      const { PATCH } = await import(
        "@/app/api/vendor/vehicles/[id]/sale/route"
      );

      const request = new NextRequest(
        "http://localhost:3000/api/vendor/vehicles/test-vehicle-id/sale",
        {
          method: "PATCH",
          headers: {
            authorization: "Bearer test-token",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            is_on_sale: true,
            // Missing sale_price
          }),
        }
      );

      const context = {
        params: { id: "test-vehicle-id" },
      };

      const response = await PATCH(request, context);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toContain(
        "sale_price is required when enabling sale"
      );
    });

    it("should return 403 for unauthorized vehicle access", async () => {
      // Mock authentication
      mockSupabaseAuth.getUser.mockResolvedValue({
        data: { user: { id: "test-user-id" } },
        error: null,
      });

      // Mock vehicle that doesn't belong to the user
      const mockVehicle = {
        id: "test-vehicle-id",
        vendor_id: "other-vendor-id",
        price: 50000000,
      };

      mockSingle
        .mockResolvedValueOnce({ data: mockVehicle, error: null }) // Vehicle fetch
        .mockResolvedValueOnce({ data: null, error: { message: "Not found" } }); // Vendor verification

      const { PATCH } = await import(
        "@/app/api/vendor/vehicles/[id]/sale/route"
      );

      const request = new NextRequest(
        "http://localhost:3000/api/vendor/vehicles/test-vehicle-id/sale",
        {
          method: "PATCH",
          headers: {
            authorization: "Bearer test-token",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            is_on_sale: true,
            sale_price: 40000000,
          }),
        }
      );

      const context = {
        params: { id: "test-vehicle-id" },
      };

      const response = await PATCH(request, context);
      const responseData = await response.json();

      expect(response.status).toBe(403);
      expect(responseData.error).toContain("Vehicle does not belong to you");
    });

    it("should clear sale_price when turning off sale", async () => {
      // Mock authentication
      mockSupabaseAuth.getUser.mockResolvedValue({
        data: { user: { id: "test-user-id" } },
        error: null,
      });

      // Mock vehicle ownership verification
      const mockVehicle = {
        id: "test-vehicle-id",
        vendor_id: "test-vendor-id",
        price: 50000000,
      };

      const mockVendor = {
        id: "test-vendor-id",
      };

      mockSingle
        .mockResolvedValueOnce({ data: mockVehicle, error: null }) // Vehicle fetch
        .mockResolvedValueOnce({ data: mockVendor, error: null }); // Vendor verification

      // Mock successful update with sale_price set to null
      const updatedVehicle = {
        ...mockVehicle,
        is_on_sale: false,
        sale_price: null,
      };

      mockUpdateSingle.mockResolvedValue({ data: updatedVehicle, error: null });

      const { PATCH } = await import(
        "@/app/api/vendor/vehicles/[id]/sale/route"
      );

      const request = new NextRequest(
        "http://localhost:3000/api/vendor/vehicles/test-vehicle-id/sale",
        {
          method: "PATCH",
          headers: {
            authorization: "Bearer test-token",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            is_on_sale: false,
          }),
        }
      );

      const context = {
        params: { id: "test-vehicle-id" },
      };

      const response = await PATCH(request, context);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.vehicle.is_on_sale).toBe(false);
      expect(responseData.vehicle.sale_price).toBeNull();
    });

    it("should handle database errors gracefully", async () => {
      // Mock authentication
      mockSupabaseAuth.getUser.mockResolvedValue({
        data: { user: { id: "test-user-id" } },
        error: null,
      });

      // Mock vehicle ownership verification
      const mockVehicle = {
        id: "test-vehicle-id",
        vendor_id: "test-vendor-id",
        price: 50000000,
      };

      const mockVendor = {
        id: "test-vendor-id",
      };

      mockSingle
        .mockResolvedValueOnce({ data: mockVehicle, error: null }) // Vehicle fetch
        .mockResolvedValueOnce({ data: mockVendor, error: null }); // Vendor verification

      // Mock database error on update
      mockUpdateSingle.mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      });

      const { PATCH } = await import(
        "@/app/api/vendor/vehicles/[id]/sale/route"
      );

      const request = new NextRequest(
        "http://localhost:3000/api/vendor/vehicles/test-vehicle-id/sale",
        {
          method: "PATCH",
          headers: {
            authorization: "Bearer test-token",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            is_on_sale: true,
            sale_price: 40000000,
          }),
        }
      );

      const context = {
        params: { id: "test-vehicle-id" },
      };

      const response = await PATCH(request, context);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.error).toContain(
        "Failed to update vehicle sale status"
      );
    });
  });
});
