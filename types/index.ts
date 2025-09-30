export interface Product {
  id: string;
  name: string;
  model: string;
  type: "motocicleta" | "patineta" | "bicicleta" | "carro" | "camion" | "other";
  price: number;
  description: string;
  features: string[];

  images: ProductImage[];
  specifications: ProductSpecifications;
  environmentalBenefits: string[];
  availability: "in-stock" | "pre-order" | "coming-soon";
  deliveryTime: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  colorId?: string;
  isHero?: boolean;
}

export interface ProductSpecifications {
  battery: string;
  range: string;
  chargeTime: string;
  warranty: string;
  delivery: string;
  environmental: string;
  performance: {
    maxSpeed: string;
    power: string;
    torque: string;
  };
  dimensions: {
    weight: string;
    length: string;
    width: string;
    height: string;
  };
  features: {
    display: string;
    connectivity: string[];
    safety: string[];
  };
}

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
  created_at: string;
  updated_at: string;
}

export interface Vendor {
  id: string;
  user_id: string;
  business_name: string;
  business_type?: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  is_verified: boolean;
  rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  vendor_id: string;
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
  delivery_time: string;
  availability: "in-stock" | "pre-order" | "coming-soon";
  passenger_capacity: number;
  charging_time: string;
  max_speed: string;
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
  created_at: string;
  updated_at: string;
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
