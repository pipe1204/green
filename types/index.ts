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
  status:
    | "pending"
    | "confirmed"
    | "completed"
    | "cancelled"
    | "reschedule_requested"
    | "reschedule_approved"
    | "reschedule_rejected";
  vendor_response?: "pending" | "accepted" | "declined";
  vendor_message?: string;
  vendor_response_date?: string;
  vendor_responded_by?: string;
  // Reschedule fields
  reschedule_count?: number;
  reschedule_reason?: string;
  suggested_date?: string;
  suggested_time?: string;
  reschedule_requested_by?: string;
  reschedule_requested_at?: string;
  reschedule_status?: "none" | "requested" | "approved" | "rejected";
  original_preferred_date?: string;
  original_preferred_time?: string;
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
  status: "pending" | "replied" | "closed" | "converted";
  is_guest: boolean;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerInquiryWithDetails {
  id: string;
  message: string;
  status: "pending" | "replied" | "closed" | "converted";
  isGuest: boolean;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  createdAt: string;
  updatedAt: string;
  vehicle: {
    id: string;
    name: string;
    brand: string;
    images: Array<{ url: string; alt: string }>;
  };
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface VendorInquiriesResponse {
  inquiries: CustomerInquiryWithDetails[];
  count: number;
  error?: string;
}

export interface UpdateInquiryStatusRequest {
  status: "pending" | "replied" | "closed";
}

export interface UpdateInquiryStatusResponse {
  success: boolean;
  inquiry: CustomerInquiry;
}

export interface CreateConversationRequest {
  initialMessage: string;
}

export interface CreateConversationResponse {
  success: boolean;
  conversation: {
    id: string;
    customer_id: string;
    vendor_id: string;
    vehicle_id: string;
    subject: string;
    last_message_at: string;
  };
  message: {
    id: string;
    content: string;
    sender_id: string;
    created_at: string;
  };
  error?: string;
}

// Test Drive Response Types
export interface TestDriveResponseRequest {
  response: "accepted" | "declined";
  message: string;
}

export interface TestDriveResponseResponse {
  success: boolean;
  booking: {
    id: string;
    vendorResponse: "accepted" | "declined";
    vendorMessage: string;
    vendorResponseDate: string;
  };
  error?: string;
}

export interface VendorTestDriveBooking {
  id: string;
  vehicleId: string;
  customerId: string;
  vendorId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  status:
    | "pending"
    | "confirmed"
    | "completed"
    | "cancelled"
    | "reschedule_requested"
    | "reschedule_approved"
    | "reschedule_rejected";
  vendorResponse: "pending" | "accepted" | "declined";
  vendorMessage?: string;
  vendorResponseDate?: string;
  vendorRespondedBy?: string;
  // Reschedule fields
  rescheduleCount?: number;
  rescheduleReason?: string;
  suggestedDate?: string;
  suggestedTime?: string;
  rescheduleRequestedBy?: string;
  rescheduleRequestedAt?: string;
  rescheduleStatus?: "none" | "requested" | "approved" | "rejected";
  originalPreferredDate?: string;
  originalPreferredTime?: string;
  createdAt: string;
  updatedAt: string;
  vehicle?: {
    id: string;
    name: string;
    brand: string;
    type: string;
    price: number;
    images: Array<{ url: string; alt: string }>;
    location: string;
  };
  customer?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface VendorTestDrivesResponse {
  bookings: VendorTestDriveBooking[];
  count: number;
  error?: string;
}

export interface CustomerTestDriveBooking {
  id: string;
  vehicleId: string;
  customerId: string;
  vendorId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  status:
    | "pending"
    | "confirmed"
    | "completed"
    | "cancelled"
    | "reschedule_requested"
    | "reschedule_approved"
    | "reschedule_rejected";
  vendorResponse: "pending" | "accepted" | "declined";
  vendorMessage?: string;
  vendorResponseDate?: string;
  // Reschedule fields
  rescheduleCount?: number;
  rescheduleReason?: string;
  suggestedDate?: string;
  suggestedTime?: string;
  rescheduleRequestedBy?: string;
  rescheduleRequestedAt?: string;
  rescheduleStatus?: "none" | "requested" | "approved" | "rejected";
  originalPreferredDate?: string;
  originalPreferredTime?: string;
  createdAt: string;
  updatedAt: string;
  vehicle?: {
    id: string;
    name: string;
    brand: string;
    type: string;
    price: number;
    images: Array<{ url: string; alt: string }>;
    location: string;
  };
  vendor?: {
    id: string;
    businessName: string;
    contact?: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export interface CustomerTestDrivesResponse {
  bookings: CustomerTestDriveBooking[];
  count: number;
  error?: string;
}

// Reschedule request interfaces
export interface RescheduleRequest {
  newDate: string;
  newTime: string;
  reason: string;
}

export interface RescheduleResponse {
  success: boolean;
  booking: {
    id: string;
    rescheduleStatus: "requested";
    rescheduleCount: number;
    rescheduleReason: string;
    rescheduleRequestedAt: string;
  };
  error?: string;
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
