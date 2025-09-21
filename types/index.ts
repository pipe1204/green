export interface Product {
  id: string;
  name: string;
  model: string;
  type: "motorbike" | "scooter" | "bicycle" | "other";
  price: number;
  description: string;
  features: string[];
  colors: ColorOption[];
  images: ProductImage[];
  specifications: ProductSpecifications;
  environmentalBenefits: string[];
  availability: "in-stock" | "pre-order" | "coming-soon";
  deliveryTime: string;
}

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  image: string;
  description: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  colorId?: string;
  isHero?: boolean;
}

export interface ProductSpecifications {
  battery: {
    capacity: string;
    range: string;
    chargingTime: string;
  };
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

export interface Customer {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: Address;
  preferences: {
    newsletter: boolean;
    smsUpdates: boolean;
  };
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  customerId: string;
  productId: string;
  selectedColor: ColorOption;
  totalAmount: number;
  downPayment: number;
  installmentAmount: number;
  status: OrderStatus;
  paymentSchedule: PaymentSchedule;
  deliveryAddress: Address;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus =
  | "pending"
  | "down-payment-received"
  | "payment-1-completed"
  | "payment-2-completed"
  | "payment-3-completed"
  | "payment-4-completed"
  | "ready-for-delivery"
  | "delivered"
  | "cancelled";

export interface PaymentSchedule {
  downPayment: {
    amount: number;
    dueDate: Date;
    status: "pending" | "completed";
  };
  installments: {
    amount: number;
    dueDate: Date;
    status: "pending" | "completed";
    installmentNumber: number;
  }[];
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  type: "question" | "test-ride" | "general";
}

export interface TestRideRequest {
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  location: string;
  productInterest: string;
  message?: string;
}
