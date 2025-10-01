export interface SearchFilters {
  vehicleType: string[];
  batteryRange: string[];
  warranty: string[];
  priceMin: number;
  priceMax: number;
  location: string[];
  reviews: string[];
  dealerRating: string[];
  availability: string[];
  passengerCapacity: string[];
  chargingTime: string[];
  maxSpeed: string[];
  power: string[];
  brands: string[];
}

export interface SortOption {
  value: string;
  label: string;
}

export interface FilterSection {
  title: string;
  filters: {
    key: string;
    label: string;
    type: "checkbox" | "range" | "select";
    options?: { value: string; label: string; count?: number }[];
    min?: number;
    max?: number;
  }[];
}

// Database types matching the Supabase schema
export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: "customer" | "vendor" | "admin";
  phone?: string;
  company_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Vendor {
  id: string;
  user_id: string;
  business_name: string;
  business_type?: string;
  nit?: string;
  address?: string;
  city?: string;
  department?: string;
  state?: string;
  country: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  locations?: VendorLocation[];
  is_verified: boolean;
  rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

export interface VendorLocation {
  address: string;
  department: string;
  city: string;
  isMain: boolean;
}

export interface Vehicle {
  id: string;
  vendorId: string;
  name: string;
  brand: string;
  type: "motocicleta" | "patineta" | "bicicleta" | "carro" | "camion";
  price: number;
  images: { url: string; alt: string }[];
  specifications: {
    range: string;
    chargeTime: string;
    warranty: string;
    battery: string;
    performance: {
      maxSpeed: string;
      power: string;
    };
  };
  deliveryTime: string;
  availability: "in-stock" | "pre-order" | "coming-soon";
  passengerCapacity: number;
  chargingTime: string;
  maxSpeed: string;
  power: string;
  location: string;
  description: string;
  features: string[];
  dealer: {
    name: string;
    location: string;
    rating: number;
  };
  reviews: {
    average: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TestDriveBooking {
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
}

export interface ContactInquiry {
  id: string;
  vehicle_id: string;
  customer_id: string;
  vendor_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  message?: string;
  status: "new" | "contacted" | "closed";
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  vehicle_id: string;
  customer_id: string;
  vendor_id: string;
  rating: number;
  title?: string;
  comment?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerFavorite {
  id: string;
  customer_id: string;
  vehicle_id: string;
  created_at: string;
}

export interface CustomerInquiry {
  id: string;
  customer_id: string;
  vehicle_id: string;
  vendor_id: string;
  message: string;
  status: "pending" | "replied" | "closed";
  created_at: string;
  updated_at: string;
}

export interface PriceAlert {
  id: string;
  customer_id: string;
  vehicle_id: string;
  target_price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type CustomerDashboardSection =
  | "favorites"
  | "testDrives"
  | "priceAlerts"
  | "inquiries";
