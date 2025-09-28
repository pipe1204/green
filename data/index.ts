import { FilterSection, SortOption } from "@/types";
import { batteryRanges, cities, vehicles, vehicleTypes } from "./vehicles";

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
    title: "Calificación",
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
];
