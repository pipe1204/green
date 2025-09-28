export interface Product {
  id: string;
  name: string;
  model: string;
  type: "motorbike" | "scooter" | "bicycle" | "car" | "truck" | "other";
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
