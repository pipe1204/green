import { Product } from "@/types";

export const products: Product[] = [
  {
    id: "eco-rider-pro",
    name: "Eco Rider Pro",
    model: "ERP-2024",
    type: "motorbike",
    price: 3500000, // COP
    description:
      "La motocicleta eléctrica premium de Green, diseñada para el conductor moderno que busca rendimiento, eficiencia y responsabilidad ambiental.",
    features: [
      "Batería de litio de alta capacidad",
      "Sistema de frenado regenerativo",
      "Pantalla digital inteligente",
      "Modo deportivo y económico",
      "Carga rápida en 2 horas",
      "Aplicación móvil conectada",
      "Sistema de navegación integrado",
      "Luces LED de alta eficiencia",
    ],
    colors: [
      {
        id: "forest-green",
        name: "Verde Bosque",
        hex: "#2d5016",
        image: "/images/eco-rider-pro/eco-rider-2.png",
        description:
          "Un verde profundo que representa nuestra conexión con la naturaleza",
      },
      {
        id: "snow-white",
        name: "Blanco Nieve",
        hex: "#ffffff",
        image: "/images/eco-rider-pro/eco-rider-2.png",
        description: "Pureza y elegancia en cada viaje",
      },
      {
        id: "midnight-black",
        name: "Negro Medianoche",
        hex: "#1a1a1a",
        image: "/images/eco-rider-pro/eco-rider-2.png",
        description: "Sofisticación y poder en movimiento",
      },
      {
        id: "ocean-blue",
        name: "Azul Océano",
        hex: "#1e3a8a",
        image: "/images/eco-rider-pro/eco-rider-2.png",
        description: "Profundidad y calma como el mar",
      },
    ],
    images: [
      {
        id: "eco-rider-2",
        url: "/images/eco-rider-pro/eco-rider-2.png",
        alt: "Eco Rider Pro",
        isHero: true,
      },
    ],
    specifications: {
      battery: "72V 50Ah",
      range: "120",
      chargeTime: "2",
      warranty: "2 años de garantía completa",
      delivery: "5-7 días hábiles",
      environmental: "Cero emisiones de CO2",
      performance: {
        maxSpeed: "80 km/h",
        power: "5000W",
        torque: "120 Nm",
      },
      dimensions: {
        weight: "95 kg",
        length: "2.1 m",
        width: "0.8 m",
        height: "1.2 m",
      },
      features: {
        display: "Pantalla LCD 7 pulgadas",
        connectivity: ["Bluetooth", "WiFi", "GPS", "App móvil"],
        safety: ["ABS", "Frenos regenerativos", "Luces LED", "Alarma"],
      },
    },
    environmentalBenefits: [
      "Cero emisiones de CO2",
      "Reduce la contaminación acústica en 90%",
      "Ahorro de $2,500,000 COP anuales en combustible",
      "Contribuye a un aire más limpio en tu ciudad",
    ],
    availability: "in-stock",
    deliveryTime: "5-7 días hábiles",
  },
  {
    id: "urban-scooter-lite",
    name: "Urban Scooter Lite",
    model: "USL-2024",
    type: "scooter",
    price: 2500000, // COP
    description:
      "El scooter eléctrico perfecto para la ciudad. Ligero, ágil y perfecto para desplazamientos urbanos cortos.",
    features: [
      "Diseño plegable compacto",
      "Batería extraíble",
      "Sistema de carga rápida",
      "Ruedas neumáticas anti-pinchazos",
      "Luces LED frontales y traseras",
      "Freno de disco trasero",
      "Soporte para teléfono",
      "Aplicación de seguimiento",
    ],
    colors: [
      {
        id: "lime-green",
        name: "Verde Lima",
        hex: "#84cc16",
        image: "/images/urban-scooter-lite/lime-green.jpg",
        description: "Energía vibrante para la ciudad",
      },
      {
        id: "sunset-orange",
        name: "Naranja Atardecer",
        hex: "#ea580c",
        image: "/images/urban-scooter-lite/sunset-orange.jpg",
        description: "Calidez y vitalidad en cada viaje",
      },
      {
        id: "storm-gray",
        name: "Gris Tormenta",
        hex: "#64748b",
        image: "/images/urban-scooter-lite/storm-gray.jpg",
        description: "Elegancia urbana moderna",
      },
    ],
    images: [
      {
        id: "hero-2",
        url: "/images/urban-scooter-lite/hero-2.jpg",
        alt: "Urban Scooter Lite en ciudad",
        isHero: true,
      },
      {
        id: "folded",
        url: "/images/urban-scooter-lite/folded.jpg",
        alt: "Scooter plegado",
      },
    ],
    specifications: {
      battery: "36V 10Ah",
      range: "25",
      chargeTime: "3",
      warranty: "1 año de garantía",
      delivery: "3-5 días hábiles",
      environmental: "Cero emisiones directas",
      performance: {
        maxSpeed: "25 km/h",
        power: "350W",
        torque: "35 Nm",
      },
      dimensions: {
        weight: "18 kg",
        length: "1.1 m",
        width: "0.5 m",
        height: "1.0 m",
      },
      features: {
        display: "Pantalla LED básica",
        connectivity: ["Bluetooth", "App móvil"],
        safety: ["Freno de disco", "Luces LED", "Timbre"],
      },
    },
    environmentalBenefits: [
      "Cero emisiones directas",
      "Reduce el tráfico urbano",
      "Perfecto para viajes de hasta 25km",
      "Contribuye a ciudades más limpias",
    ],
    availability: "in-stock",
    deliveryTime: "3-5 días hábiles",
  },
  {
    id: "mountain-bike-electric",
    name: "Mountain Bike Eléctrica",
    model: "MBE-2024",
    type: "bicycle",
    price: 3000000, // COP
    description:
      "Para los aventureros que buscan explorar la naturaleza con el poder de la tecnología eléctrica sostenible.",
    features: [
      "Suspensión delantera de 120mm",
      "Frenos hidráulicos de disco",
      "Motor central de alta eficiencia",
      "Batería integrada en el cuadro",
      "Transmisión de 21 velocidades",
      "Ruedas de 27.5 pulgadas",
      "Modo de asistencia personalizable",
      "Resistente al agua IP65",
    ],
    colors: [
      {
        id: "earth-brown",
        name: "Marrón Tierra",
        hex: "#92400e",
        image: "/images/mountain-bike-electric/earth-brown.jpg",
        description: "Conecta con la naturaleza",
      },
      {
        id: "sky-blue",
        name: "Azul Cielo",
        hex: "#0ea5e9",
        image: "/images/mountain-bike-electric/sky-blue.jpg",
        description: "Libertad como el cielo abierto",
      },
      {
        id: "forest-dark",
        name: "Verde Bosque Oscuro",
        hex: "#14532d",
        image: "/images/mountain-bike-electric/forest-dark.jpg",
        description: "Profundidad del bosque",
      },
    ],
    images: [
      {
        id: "hero-3",
        url: "/images/mountain-bike-electric/hero-3.jpg",
        alt: "Mountain Bike Eléctrica en montaña",
        isHero: true,
      },
      {
        id: "trail",
        url: "/images/mountain-bike-electric/trail.jpg",
        alt: "En sendero de montaña",
      },
    ],
    specifications: {
      battery: "48V 15Ah",
      range: "60",
      chargeTime: "4",
      warranty: "2 años de garantía",
      delivery: "7-10 días hábiles",
      environmental: "Explora la naturaleza sin contaminar",
      performance: {
        maxSpeed: "45 km/h",
        power: "250W",
        torque: "80 Nm",
      },
      dimensions: {
        weight: "28 kg",
        length: "1.9 m",
        width: "0.6 m",
        height: "1.1 m",
      },
      features: {
        display: "Pantalla LCD 3 pulgadas",
        connectivity: ["Bluetooth", "App móvil"],
        safety: ["Frenos hidráulicos", "Luces LED", "Reflectores"],
      },
    },
    environmentalBenefits: [
      "Explora la naturaleza sin contaminar",
      "Reduce la huella de carbono",
      "Perfecto para senderos y montañas",
      "Promueve el ecoturismo sostenible",
    ],
    availability: "pre-order",
    deliveryTime: "10-14 días hábiles",
  },
];

export const featuredProducts = products.filter(
  (product) =>
    product.id === "eco-rider-pro" ||
    product.id === "urban-scooter-lite" ||
    product.id === "mountain-bike-electric"
);

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};

export const getProductsByType = (type: string): Product[] => {
  return products.filter((product) => product.type === type);
};
