import { Vehicle } from ".";

export interface PaginatedVehiclesResult {
  vehicles: Vehicle[];
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface VehicleQueryError {
  message: string;
  code?: string;
  details?: string;
}

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
