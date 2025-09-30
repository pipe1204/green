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

// Convert database format (snake_case) to frontend Vehicle (camelCase)
export function databaseToVehicle(dbVehicle: DbVehicleRow): Vehicle {
  return {
    id: dbVehicle.id,
    vendorId: dbVehicle.vendor_id ?? "",
    name: dbVehicle.name,
    brand: dbVehicle.brand,
    type: dbVehicle.type,
    price: dbVehicle.price,
    images: dbVehicle.images,
    specifications: dbVehicle.specifications,
    deliveryTime: dbVehicle.delivery_time,
    availability: dbVehicle.availability,
    passengerCapacity: dbVehicle.passenger_capacity,
    chargingTime: dbVehicle.charging_time,
    maxSpeed: dbVehicle.max_speed,
    power: dbVehicle.power,
    location: dbVehicle.location,
    description: dbVehicle.description,
    features: dbVehicle.features,
    dealer: dbVehicle.dealer,
    reviews: dbVehicle.reviews,
    createdAt: dbVehicle.created_at,
    updatedAt: dbVehicle.updated_at,
  };
}
