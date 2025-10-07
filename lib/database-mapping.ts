import {
  Vehicle,
  PriceAlert,
  TestDriveBooking,
  CustomerInquiry,
} from "@/types";

export function vehicleToDatabase(vehicle: Vehicle) {
  return {
    id: vehicle.id,
    vendor_id: vehicle.vendorId,
    name: vehicle.name,
    brand: vehicle.brand,
    type: vehicle.type,
    price: vehicle.price,
    images: vehicle.images,
    specifications: vehicle.specifications,
    delivery_time: vehicle.deliveryTime,
    availability: vehicle.availability,
    passenger_capacity: vehicle.passengerCapacity,
    charging_time: vehicle.chargingTime,
    max_speed: vehicle.maxSpeed,
    power: vehicle.power,
    location: vehicle.location,
    description: vehicle.description,
    features: vehicle.features,
    reviews: vehicle.reviews,
    is_on_sale: vehicle.is_on_sale,
    sale_price: vehicle.sale_price,
    created_at: vehicle.createdAt,
    updated_at: vehicle.updatedAt,
  };
}

// Coerce enum-like objects to strings
// Supabase sometimes returns PostgreSQL ENUMs as {type: 'enum', value: 'string'}
const coerceEnum = (val: unknown): string => {
  if (typeof val === "string") return val;
  if (
    val !== null &&
    typeof val === "object" &&
    "value" in (val as Record<string, unknown>)
  ) {
    return String((val as { value: unknown }).value);
  }
  return String(val ?? "");
};

// Convert database format (snake_case) to frontend Vehicle (camelCase)
export function databaseToVehicle(dbVehicle: unknown): Vehicle {
  // Cast to access properties safely
  const raw = dbVehicle as Record<string, unknown>;

  // Coerce enum fields that might come as objects
  const vehicleType = coerceEnum(raw.type) as Vehicle["type"];
  const availability = coerceEnum(raw.availability) as Vehicle["availability"];

  // Handle specifications object with warranty that might be an object {type: 'years', value: 2}
  const rawSpecs = (raw.specifications as Record<string, unknown>) || {};
  const warranty = rawSpecs.warranty;

  let warrantyStr = "";
  if (
    typeof warranty === "object" &&
    warranty !== null &&
    "value" in warranty
  ) {
    const warrantyObj = warranty as { value: unknown; type?: unknown };
    const value = warrantyObj.value;
    const type = warrantyObj.type;

    // Handle different warranty types: 'years' or 'kms'
    if (type === "years") {
      warrantyStr = `${value} año${Number(value) !== 1 ? "s" : ""}`;
    } else if (type === "kms" || type === "km") {
      warrantyStr = `${value} km`;
    } else {
      warrantyStr = `${value} ${type || ""}`.trim();
    }
  } else {
    warrantyStr = String(warranty ?? "");
  }

  const specifications: Vehicle["specifications"] = {
    range: String(rawSpecs.range ?? ""),
    chargeTime: String(rawSpecs.chargeTime ?? ""),
    warranty: warrantyStr,
    battery: String(rawSpecs.battery ?? ""),
    performance:
      (rawSpecs.performance as Vehicle["specifications"]["performance"]) ?? {
        maxSpeed: "",
        power: "",
      },
  };

  return {
    id: String(raw.id ?? ""),
    vendorId: String(raw.vendor_id ?? ""),
    name: String(raw.name ?? ""),
    brand: String(raw.brand ?? ""),
    type: vehicleType,
    price: Number(raw.price ?? 0),
    images: (raw.images as { url: string; alt: string }[]) ?? [],
    specifications: specifications,
    deliveryTime: String(raw.delivery_time ?? ""),
    availability: availability,
    passengerCapacity: Number(raw.passenger_capacity ?? 0),
    chargingTime: String(raw.charging_time ?? ""),
    maxSpeed: String(raw.max_speed ?? ""),
    power: String(raw.power ?? ""),
    location: String(raw.location ?? ""),
    description: String(raw.description ?? ""),
    features: (raw.features as string[]) ?? [],
    reviews: (raw.reviews as Vehicle["reviews"]) ?? {
      average: 0,
      count: 0,
    },
    is_on_sale: Boolean(raw.is_on_sale ?? false),
    sale_price: raw.sale_price ? Number(raw.sale_price) : undefined,
    vendor: {
      businessName: String(
        (raw.vendors as { business_name?: string })?.business_name ?? ""
      ),
      phone: String((raw.vendors as { phone?: string })?.phone ?? ""),
      email: String((raw.vendors as { email?: string })?.email ?? ""),
      rating: Number((raw.vendors as { rating?: number })?.rating ?? 0),
    },
    createdAt: String(raw.created_at ?? new Date().toISOString()),
    updatedAt: String(raw.updated_at ?? new Date().toISOString()),
  };
}

// Database response type for price alerts with vehicle data
export interface DatabasePriceAlertWithVehicle {
  id: string;
  customer_id: string;
  vehicle_id: string;
  target_price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  vehicles: {
    id: string;
    name: string;
    brand: string;
    type: string;
    price: number;
    images: string[];
    location: string;
  } | null;
}

// Convert database price alert with vehicle to frontend format
export function databaseToPriceAlertWithVehicle(
  dbAlert: DatabasePriceAlertWithVehicle
): PriceAlert & { vehicle?: Vehicle } {
  return {
    id: dbAlert.id,
    customer_id: dbAlert.customer_id,
    vehicle_id: dbAlert.vehicle_id,
    target_price: dbAlert.target_price,
    is_active: dbAlert.is_active,
    created_at: dbAlert.created_at,
    updated_at: dbAlert.updated_at,
    vehicle: dbAlert.vehicles
      ? {
          id: dbAlert.vehicles.id,
          name: dbAlert.vehicles.name,
          brand: dbAlert.vehicles.brand,
          type: dbAlert.vehicles.type as Vehicle["type"],
          price: dbAlert.vehicles.price,
          images: (dbAlert.vehicles.images || []).map((url: string) => ({
            url,
            alt: dbAlert.vehicles?.name || "Vehicle",
          })),
          location: dbAlert.vehicles.location,
          // Add required Vehicle fields with defaults
          vendorId: "",
          specifications: {
            range: "",
            chargeTime: "",
            warranty: "",
            battery: "",
            performance: {
              maxSpeed: "",
              power: "",
            },
          },
          deliveryTime: "",
          availability: "in-stock" as Vehicle["availability"],
          passengerCapacity: 1,
          chargingTime: "",
          maxSpeed: "",
          power: "",
          description: "",
          features: [],
          reviews: {
            average: 0,
            count: 0,
          },
          is_on_sale: false,
          sale_price: undefined,
          vendor: {
            businessName: "",
            phone: "",
            email: "",
            rating: 0,
          },
          createdAt: "",
          updatedAt: "",
        }
      : undefined,
  };
}

// Database response type for test drive bookings with vehicle data
export interface DatabaseTestDriveWithVehicle {
  id: string;
  vehicle_id: string;
  customer_id: string;
  vendor_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  preferred_date?: string;
  preferred_time?: string;
  message?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
  vehicles: {
    id: string;
    name: string;
    brand: string;
    type: string;
    price: number;
    images: string[];
    location: string;
  } | null;
}

// Convert database test drive with vehicle to frontend format
export function databaseToTestDriveWithVehicle(
  dbBooking: DatabaseTestDriveWithVehicle
): TestDriveBooking & { vehicle?: Vehicle } {
  return {
    id: dbBooking.id,
    vehicle_id: dbBooking.vehicle_id,
    customer_id: dbBooking.customer_id,
    vendor_id: dbBooking.vendor_id,
    customer_name: dbBooking.customer_name,
    customer_email: dbBooking.customer_email,
    customer_phone: dbBooking.customer_phone,
    preferred_date: dbBooking.preferred_date,
    preferred_time: dbBooking.preferred_time,
    message: dbBooking.message,
    status: dbBooking.status,
    created_at: dbBooking.created_at,
    updated_at: dbBooking.updated_at,
    vehicle: dbBooking.vehicles
      ? {
          id: dbBooking.vehicles.id,
          name: dbBooking.vehicles.name,
          brand: dbBooking.vehicles.brand,
          type: dbBooking.vehicles.type as Vehicle["type"],
          price: dbBooking.vehicles.price,
          images: (dbBooking.vehicles.images || []).map((url: string) => ({
            url,
            alt: dbBooking.vehicles?.name || "Vehicle",
          })),
          location: dbBooking.vehicles.location,
          // Add required Vehicle fields with defaults
          vendorId: "",
          specifications: {
            range: "",
            chargeTime: "",
            warranty: "",
            battery: "",
            performance: {
              maxSpeed: "",
              power: "",
            },
          },
          deliveryTime: "",
          availability: "in-stock" as Vehicle["availability"],
          passengerCapacity: 1,
          chargingTime: "",
          maxSpeed: "",
          power: "",
          description: "",
          features: [],
          reviews: {
            average: 0,
            count: 0,
          },
          is_on_sale: false,
          sale_price: undefined,
          vendor: {
            businessName: "",
            phone: "",
            email: "",
            rating: 0,
          },
          createdAt: "",
          updatedAt: "",
        }
      : undefined,
  };
}

// Database interface for customer inquiries with vehicle data
export interface DatabaseInquiryWithVehicle {
  id: string;
  customer_id: string;
  vehicle_id: string;
  vendor_id: string;
  message: string;
  status: "pending" | "replied" | "closed" | "converted";
  is_guest: boolean;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  created_at: string;
  updated_at: string;
  vehicles: {
    id: string;
    name: string;
    brand: string;
    type: string;
    price: number;
    images: string[];
    location: string;
  } | null;
}

// Transform database inquiry with vehicle to frontend format
export function databaseToInquiryWithVehicle(
  dbInquiry: DatabaseInquiryWithVehicle
): CustomerInquiry & { vehicle?: Vehicle } {
  return {
    id: dbInquiry.id,
    customer_id: dbInquiry.customer_id,
    vehicle_id: dbInquiry.vehicle_id,
    vendor_id: dbInquiry.vendor_id,
    message: dbInquiry.message,
    status: dbInquiry.status,
    is_guest: dbInquiry.is_guest,
    guest_name: dbInquiry.guest_name,
    guest_email: dbInquiry.guest_email,
    guest_phone: dbInquiry.guest_phone,
    created_at: dbInquiry.created_at,
    updated_at: dbInquiry.updated_at,
    vehicle: dbInquiry.vehicles
      ? {
          id: dbInquiry.vehicles.id,
          name: dbInquiry.vehicles.name,
          brand: dbInquiry.vehicles.brand,
          type: dbInquiry.vehicles.type as Vehicle["type"],
          price: dbInquiry.vehicles.price,
          images: (dbInquiry.vehicles.images || []).map((url: string) => ({
            url,
            alt: dbInquiry.vehicles?.name || "Vehicle",
          })),
          location: dbInquiry.vehicles.location,
          // Add required Vehicle fields with defaults
          vendorId: "",
          specifications: {
            range: "",
            chargeTime: "",
            warranty: "",
            battery: "",
            performance: {
              maxSpeed: "",
              power: "",
            },
          },
          deliveryTime: "",
          availability: "in-stock" as Vehicle["availability"],
          passengerCapacity: 1,
          chargingTime: "",
          maxSpeed: "",
          power: "",
          description: "",
          features: [],
          reviews: {
            average: 0,
            count: 0,
          },
          is_on_sale: false,
          sale_price: undefined,
          vendor: {
            businessName: "",
            phone: "",
            email: "",
            rating: 0,
          },
          createdAt: "",
          updatedAt: "",
        }
      : undefined,
  };
}
