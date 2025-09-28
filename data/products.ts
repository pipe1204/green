import { Product } from "@/types";
import {
  vehicles,
  vehicleTypes,
  batteryRanges,
  warrantyOptions,
  priceRanges,
  cities,
  brands,
} from "./vehicles";

// Convert vehicles to Product format for compatibility
export const products: Product[] = vehicles.map((vehicle) => ({
  id: vehicle.id,
  name: vehicle.name,
  model: vehicle.brand,
  type: vehicle.type,
  price: vehicle.price,
  description: vehicle.description,
  features: vehicle.features,
  colors: [
    {
      id: "default",
      name: "Color Estándar",
      hex: "#000000",
      image: vehicle.images[0]?.url || "/images/placeholder.jpg",
      description: "Color estándar del vehículo",
    },
  ],
  images: vehicle.images.map((img, index) => ({
    id: `img-${index}`,
    url: img.url,
    alt: img.alt,
    isHero: index === 0,
  })),
  specifications: {
    battery: vehicle.specifications.battery,
    range: vehicle.specifications.range,
    chargeTime: vehicle.specifications.chargeTime,
    warranty: vehicle.specifications.warranty,
    delivery: vehicle.deliveryTime,
    environmental: "Cero emisiones de CO2",
    performance: {
      maxSpeed: vehicle.specifications.performance.maxSpeed,
      power: vehicle.specifications.performance.power,
      torque: "N/A",
    },
    dimensions: {
      weight: "N/A",
      length: "N/A",
      width: "N/A",
      height: "N/A",
    },
    features: {
      display: "Pantalla digital",
      connectivity: ["Bluetooth", "App móvil"],
      safety: ["Frenos", "Luces LED"],
    },
  },
  environmentalBenefits: [
    "Cero emisiones de CO2",
    "Reduce la contaminación acústica",
    "Ahorro en combustible",
    "Contribuye a un aire más limpio",
  ],
  availability: vehicle.availability,
  deliveryTime: vehicle.deliveryTime,
}));

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};

// Re-export filter data from vehicles.ts
export {
  vehicleTypes,
  batteryRanges,
  warrantyOptions,
  priceRanges,
  cities,
  brands,
};
