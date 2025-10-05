import { FilterSection, SortOption } from "@/types";
import {
  batteryRanges,
  cities,
  vehicles,
  vehicleTypes,
  staticVehicleToVehicle,
} from "./vehicles";

export const sortOptions: SortOption[] = [
  { value: "relevance", label: "Más relevantes" },
  { value: "price-low", label: "Precio: menor a mayor" },
  { value: "price-high", label: "Precio: mayor a menor" },
  { value: "rating", label: "Mejor calificados" },
  { value: "newest", label: "Más nuevos" },
  { value: "range", label: "Mayor autonomía" },
];

export const filterSections: FilterSection[] = [
  {
    title: "Tipo de Vehículo",
    filters: [
      {
        key: "vehicleType",
        label: "Tipo",
        type: "checkbox",
        options: vehicleTypes.map((type) => ({
          value: type.value,
          label: type.label,
          count: vehicles.filter((v) => v.type === type.value).length,
        })),
      },
    ],
  },
  {
    title: "Precio",
    filters: [
      {
        key: "priceRange",
        label: "Rango de precio",
        type: "range",
        min: 0,
        max: 50000000,
      },
    ],
  },
  {
    title: "Autonomía de Batería",
    filters: [
      {
        key: "batteryRange",
        label: "Rango de autonomía",
        type: "checkbox",
        options: batteryRanges.map((range) => ({
          value: range.value,
          label: range.label,
          count: vehicles.filter((v) => {
            const vehicleRange = parseInt(v.specifications.range);
            const [min, max] = range.value.split("-").map(Number);
            return max
              ? vehicleRange >= min && vehicleRange <= max
              : vehicleRange >= min;
          }).length,
        })),
      },
    ],
  },
  {
    title: "Ubicación",
    filters: [
      {
        key: "location",
        label: "Ciudad",
        type: "checkbox",
        options: cities.map((city) => ({
          value: city,
          label: city,
          count: vehicles.filter((v) => v.location === city).length,
        })),
      },
    ],
  },
  {
    title: "Disponibilidad",
    filters: [
      {
        key: "availability",
        label: "Estado",
        type: "checkbox",
        options: [
          {
            value: "in-stock",
            label: "Disponible",
            count: vehicles.filter((v) => v.availability === "in-stock").length,
          },
          {
            value: "pre-order",
            label: "Pre-orden",
            count: vehicles.filter((v) => v.availability === "pre-order")
              .length,
          },
          {
            value: "coming-soon",
            label: "Próximamente",
            count: vehicles.filter((v) => v.availability === "coming-soon")
              .length,
          },
        ],
      },
    ],
  },
  {
    title: "Calificación del Vehículo",
    filters: [
      {
        key: "reviews",
        label: "Calificación mínima",
        type: "checkbox",
        options: [
          {
            value: "4.5+",
            label: "4.5+ estrellas",
            count: vehicles.filter((v) => v.reviews.average >= 4.5).length,
          },
          {
            value: "4.0+",
            label: "4.0+ estrellas",
            count: vehicles.filter((v) => v.reviews.average >= 4.0).length,
          },
          {
            value: "3.5+",
            label: "3.5+ estrellas",
            count: vehicles.filter((v) => v.reviews.average >= 3.5).length,
          },
        ],
      },
    ],
  },
  {
    title: "Calificación del Vendedor",
    filters: [
      {
        key: "dealerRating",
        label: "Calificación mínima del vendedor",
        type: "checkbox",
        options: [
          {
            value: "4.5+",
            label: "4.5+ estrellas",
            count: vehicles
              .map(staticVehicleToVehicle)
              .filter((v) => v.vendor.rating >= 4.5).length,
          },
          {
            value: "4.0+",
            label: "4.0+ estrellas",
            count: vehicles
              .map(staticVehicleToVehicle)
              .filter((v) => v.vendor.rating >= 4.0).length,
          },
          {
            value: "3.5+",
            label: "3.5+ estrellas",
            count: vehicles
              .map(staticVehicleToVehicle)
              .filter((v) => v.vendor.rating >= 3.5).length,
          },
        ],
      },
    ],
  },
  {
    title: "Tiempo de Carga",
    filters: [
      {
        key: "chargingTime",
        label: "Tiempo de carga",
        type: "checkbox",
        options: [
          {
            value: "0-2",
            label: "Menos de 2 horas",
            count: 0,
          },
          {
            value: "2-4",
            label: "2-4 horas",
            count: 0,
          },
          {
            value: "4-8",
            label: "4-8 horas",
            count: 0,
          },
          {
            value: "8+",
            label: "Más de 8 horas",
            count: 0,
          },
        ],
      },
    ],
  },
  {
    title: "Velocidad Máxima",
    filters: [
      {
        key: "maxSpeed",
        label: "Velocidad máxima",
        type: "checkbox",
        options: [
          {
            value: "0-50",
            label: "0-50 km/h",
            count: 0,
          },
          {
            value: "50-100",
            label: "50-100 km/h",
            count: 0,
          },
          {
            value: "100-150",
            label: "100-150 km/h",
            count: 0,
          },
          {
            value: "150+",
            label: "150+ km/h",
            count: 0,
          },
        ],
      },
    ],
  },
  {
    title: "Garantía",
    filters: [
      {
        key: "warranty",
        label: "Garantía",
        type: "checkbox",
        options: [
          {
            value: "years:1+",
            label: "1+ año",
            count: 0,
          },
          {
            value: "years:2+",
            label: "2+ años",
            count: 0,
          },
          {
            value: "years:3+",
            label: "3+ años",
            count: 0,
          },
          {
            value: "years:5+",
            label: "5+ años",
            count: 0,
          },
          {
            value: "km:50000+",
            label: "50,000+ km",
            count: 0,
          },
          {
            value: "km:100000+",
            label: "100,000+ km",
            count: 0,
          },
          {
            value: "km:150000+",
            label: "150,000+ km",
            count: 0,
          },
        ],
      },
    ],
  },
];

export const timeSlots = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
];

export const departmentLabels = {
  antioquia: "Antioquia",
  bogota: "Bogotá D.C.",
  "valle-del-cauca": "Valle del Cauca",
  atlantico: "Atlántico",
  santander: "Santander",
  bolivar: "Bolívar",
  cundinamarca: "Cundinamarca",
  "norte-de-santander": "Norte de Santander",
  cordoba: "Córdoba",
  huila: "Huila",
  tolima: "Tolima",
  caqueta: "Caquetá",
  meta: "Meta",
  cauca: "Cauca",
  narino: "Nariño",
  cesar: "Cesar",
  magdalena: "Magdalena",
  "la-guaajira": "La Guajira",
  quindio: "Quindío",
  risaralda: "Risaralda",
  caldas: "Caldas",
  boyaca: "Boyacá",
  casanare: "Casanare",
  arauca: "Arauca",
  putumayo: "Putumayo",
  amazonas: "Amazonas",
  vaupes: "Vaupés",
  guainia: "Guainía",
  vichada: "Vichada",
  guaviare: "Guaviare",
};

export const colombianDepartments = {
  antioquia: [
    "Medellín",
    "Bello",
    "Itagüí",
    "Envigado",
    "Apartadó",
    "Turbo",
    "Rionegro",
    "Sabaneta",
  ],
  bogota: ["Bogotá D.C."],
  "valle-del-cauca": [
    "Cali",
    "Palmira",
    "Buenaventura",
    "Tuluá",
    "Cartago",
    "Buga",
    "Yumbo",
  ],
  atlantico: [
    "Barranquilla",
    "Soledad",
    "Malambo",
    "Puerto Colombia",
    "Galapa",
  ],
  santander: [
    "Bucaramanga",
    "Floridablanca",
    "Girón",
    "Piedecuesta",
    "Barrancabermeja",
  ],
  bolivar: [
    "Cartagena",
    "Magangué",
    "Turbaco",
    "Arjona",
    "El Carmen de Bolívar",
  ],
  cundinamarca: [
    "Soacha",
    "Girardot",
    "Zipaquirá",
    "Facatativá",
    "Chía",
    "Madrid",
    "Mosquera",
  ],
  "norte-de-santander": [
    "Cúcuta",
    "Villa del Rosario",
    "Los Patios",
    "El Zulia",
    "Ocaña",
  ],
  cordoba: ["Montería", "Cereté", "Sahagún", "Lorica", "Montelíbano"],
  huila: ["Neiva", "Pitalito", "Garzón", "La Plata", "Campoalegre"],
  tolima: ["Ibagué", "Girardot", "Espinal", "Melgar", "Guamo"],
  caqueta: [
    "Florencia",
    "San Vicente del Caguán",
    "Puerto Rico",
    "La Montañita",
  ],
  meta: ["Villavicencio", "Acacías", "Granada", "Restrepo", "Cumaral"],
  cauca: ["Popayán", "Santander de Quilichao", "Patía", "Puerto Tejada"],
  narino: ["Pasto", "Tumaco", "Ipiales", "Túquerres", "La Unión"],
  cesar: ["Valledupar", "Aguachica", "Codazzi", "La Paz", "San Diego"],
  magdalena: ["Santa Marta", "Ciénaga", "Fundación", "Aracataca", "El Banco"],
  "la-guaajira": [
    "Riohacha",
    "Maicao",
    "Uribia",
    "Manaure",
    "San Juan del Cesar",
  ],
  quindio: ["Armenia", "Calarcá", "La Tebaida", "Montenegro", "Quimbaya"],
  risaralda: [
    "Pereira",
    "Dosquebradas",
    "Santa Rosa de Cabal",
    "La Virginia",
    "Cartago",
  ],
  caldas: ["Manizales", "La Dorada", "Riosucio", "Anserma", "Chinchiná"],
  boyaca: ["Tunja", "Duitama", "Sogamoso", "Chiquinquirá", "Villa de Leyva"],
  casanare: ["Yopal", "Aguazul", "Tauramena", "Villanueva", "Sabanalarga"],
  arauca: ["Arauca", "Saravena", "Fortul", "Tame", "Arauquita"],
  putumayo: [
    "Mocoa",
    "Villagarzón",
    "Puerto Asís",
    "Orito",
    "Valle del Guamuez",
  ],
  amazonas: [
    "Leticia",
    "El Encanto",
    "La Chorrera",
    "La Pedrera",
    "Miriti - Paraná",
  ],
  vaupes: ["Mitú", "Caruru", "Pacoa", "Taraira", "Papunaua"],
  guainia: [
    "Inírida",
    "Barranco Minas",
    "Mapiripana",
    "San Felipe",
    "Puerto Colombia",
  ],
  vichada: [
    "Puerto Carreño",
    "La Primavera",
    "Santa Rosalía",
    "Cumaribo",
    "Paz de Ariporo",
  ],
  guaviare: ["San José del Guaviare", "Calamar", "El Retorno", "Miraflores"],
};
