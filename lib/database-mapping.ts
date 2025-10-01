import { Vehicle } from "@/types";

// Row shape returned from Supabase (snake_case) matching public.vehicles
// This keeps DB types separate from app types (camelCase)
export interface DbVehicleRow {
  id: string;
  vendor_id: string | null;
  name: string;
  brand: string;
  type: Vehicle["type"]; // enum values align
  price: number;
  images: { url: string; alt: string }[];
  specifications: Vehicle["specifications"];
  delivery_time: string;
  availability: Vehicle["availability"]; // 'in-stock' | 'pre-order' | 'coming-soon'
  passenger_capacity: number;
  charging_time: string;
  max_speed: string;
  power: string;
  location: string;
  description: string;
  features: string[];
  dealer: Vehicle["dealer"];
  reviews: Vehicle["reviews"];
  created_at: string;
  updated_at: string;
}

// Convert frontend Vehicle (camelCase) to database format (snake_case)
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
    dealer: vehicle.dealer,
    reviews: vehicle.reviews,
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
    dealer: (raw.dealer as Vehicle["dealer"]) ?? {
      name: "",
      location: "",
      rating: 0,
    },
    reviews: (raw.reviews as Vehicle["reviews"]) ?? {
      average: 0,
      count: 0,
    },
    createdAt: String(raw.created_at ?? new Date().toISOString()),
    updatedAt: String(raw.updated_at ?? new Date().toISOString()),
  };
}
