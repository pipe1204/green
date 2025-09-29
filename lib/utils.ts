import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const getAvailabilityColor = (availability: string) => {
  switch (availability) {
    case "in-stock":
      return "bg-green-100 text-green-800 border-green-200";
    case "pre-order":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "coming-soon":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getAvailabilityText = (availability: string) => {
  switch (availability) {
    case "in-stock":
      return "Disponible";
    case "pre-order":
      return "Pre-orden";
    case "coming-soon":
      return "Próximamente";
    default:
      return "Consultar";
  }
};

export const getVehicleTypeText = (type: string) => {
  switch (type) {
    case "motocicleta":
      return "Motocicleta";
    case "scooter":
      return "Scooter";
    case "bicicleta":
      return "Bicicleta";
    case "carro":
      return "Carro";
    case "camion":
      return "Camión";
    default:
      return type;
  }
};

export const truncateText = (text: string, maxLength: number = 25): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trim() + "...";
};
