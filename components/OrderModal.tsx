"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product, ColorOption } from "@/types";
import { CreditCard, CheckCircle } from "lucide-react";

// Colombian departments and cities data
const colombianData = {
  departments: [
    "Antioquia",
    "Atlántico",
    "Bogotá D.C.",
    "Bolívar",
    "Boyacá",
    "Caldas",
    "Caquetá",
    "Cauca",
    "Cesar",
    "Córdoba",
    "Cundinamarca",
    "Huila",
    "La Guajira",
    "Magdalena",
    "Meta",
    "Nariño",
    "Norte de Santander",
    "Quindío",
    "Risaralda",
    "Santander",
    "Sucre",
    "Tolima",
    "Valle del Cauca",
  ],
  citiesByDepartment: {
    Antioquia: [
      "Medellín",
      "Bello",
      "Itagüí",
      "Envigado",
      "Apartadó",
      "Turbo",
      "Rionegro",
      "Copacabana",
      "La Estrella",
      "Sabaneta",
    ],
    Atlántico: [
      "Barranquilla",
      "Soledad",
      "Malambo",
      "Sabanagrande",
      "Puerto Colombia",
      "Galapa",
      "Usiacurí",
    ],
    "Bogotá D.C.": ["Bogotá"],
    Bolívar: [
      "Cartagena",
      "Magangué",
      "Turbaco",
      "Arjona",
      "Mahates",
      "María la Baja",
      "San Pablo",
      "Simití",
      "Santa Rosa",
      "San Juan Nepomuceno",
    ],
    Boyacá: [
      "Tunja",
      "Duitama",
      "Sogamoso",
      "Chiquinquirá",
      "Villa de Leyva",
      "Paipa",
      "Barbosa",
      "Moniquirá",
    ],
    Caldas: [
      "Manizales",
      "La Dorada",
      "Riosucio",
      "Anserma",
      "Viterbo",
      "Supía",
      "Pensilvania",
      "Aguadas",
    ],
    Caquetá: [
      "Florencia",
      "San Vicente del Caguán",
      "Puerto Rico",
      "La Montañita",
      "El Paujíl",
      "Cartagena del Chairá",
    ],
    Cauca: [
      "Popayán",
      "Santander de Quilichao",
      "Patía",
      "Puerto Tejada",
      "Corinto",
      "Miranda",
      "Padilla",
    ],
    Cesar: [
      "Valledupar",
      "Aguachica",
      "Codazzi",
      "La Paz",
      "San Diego",
      "Manaure",
      "Chimichagua",
    ],
    Córdoba: [
      "Montería",
      "Sahagún",
      "Ciénaga de Oro",
      "Cereté",
      "Montelíbano",
      "Lorica",
      "Tierralta",
      "Ayapel",
    ],
    Cundinamarca: [
      "Soacha",
      "Girardot",
      "Zipaquirá",
      "Facatativá",
      "Chía",
      "Madrid",
      "Mosquera",
      "Fusagasugá",
    ],
    Huila: [
      "Neiva",
      "Pitalito",
      "Garzón",
      "La Plata",
      "Campoalegre",
      "San Agustín",
      "Timaná",
    ],
    "La Guajira": [
      "Riohacha",
      "Maicao",
      "Uribia",
      "Manaure",
      "San Juan del Cesar",
      "Villanueva",
      "El Molino",
    ],
    Magdalena: [
      "Santa Marta",
      "Ciénaga",
      "Fundación",
      "Aracataca",
      "Zona Bananera",
      "Pivijay",
      "Plato",
    ],
    Meta: [
      "Villavicencio",
      "Acacías",
      "Granada",
      "San Martín",
      "El Castillo",
      "Cubarral",
      "Restrepo",
    ],
    Nariño: [
      "Pasto",
      "Tumaco",
      "Ipiales",
      "Túquerres",
      "La Unión",
      "Potosí",
      "Aldana",
      "Cumbal",
    ],
    "Norte de Santander": [
      "Cúcuta",
      "Ocaña",
      "Pamplona",
      "Villa del Rosario",
      "Los Patios",
      "El Zulia",
      "Villa Caro",
    ],
    Quindío: [
      "Armenia",
      "Calarcá",
      "La Tebaida",
      "Montenegro",
      "Quimbaya",
      "Circasia",
      "Filandia",
      "Salento",
    ],
    Risaralda: [
      "Pereira",
      "Dosquebradas",
      "Santa Rosa de Cabal",
      "Cartago",
      "La Virginia",
      "Chinchiná",
      "Marsella",
    ],
    Santander: [
      "Bucaramanga",
      "Floridablanca",
      "Girón",
      "Piedecuesta",
      "Barrancabermeja",
      "San Gil",
      "Socorro",
    ],
    Sucre: [
      "Sincelejo",
      "Corozal",
      "Morroa",
      "Los Palmitos",
      "Galeras",
      "San Onofre",
      "Tolú",
    ],
    Tolima: [
      "Ibagué",
      "Girardot",
      "Espinal",
      "Melgar",
      "Guamo",
      "Saldaña",
      "Purificación",
      "Natagaima",
    ],
    "Valle del Cauca": [
      "Cali",
      "Palmira",
      "Buenaventura",
      "Tuluá",
      "Cartago",
      "Buga",
      "Yumbo",
      "Ginebra",
    ],
  },
};

const customerSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "El teléfono debe tener al menos 10 dígitos"),
  street: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
  city: z.string().min(2, "La ciudad es requerida"),
  state: z.string().min(2, "El departamento es requerido"),
  zipCode: z
    .string()
    .min(5, "El código postal debe tener al menos 5 caracteres"),
  country: z.string().default("Colombia"),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  selectedColor: ColorOption | null;
}

export default function OrderModal({
  isOpen,
  onClose,
  product,
  selectedColor,
}: OrderModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });

  const downPayment = product ? Math.round(product.price * 0.25) : 0;
  const installmentAmount = product
    ? Math.round((product.price - downPayment) / 4)
    : 0;

  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(department);
    setSelectedCity(""); // Reset city when department changes
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  const availableCities = selectedDepartment
    ? colombianData.citiesByDepartment[
        selectedDepartment as keyof typeof colombianData.citiesByDepartment
      ] || []
    : [];

  const paymentSchedule = [
    { number: 1, amount: downPayment, label: "Pago inicial", dueDate: "Hoy" },
    {
      number: 2,
      amount: installmentAmount,
      label: "Cuota 1",
      dueDate: "En 2 semanas",
    },
    {
      number: 3,
      amount: installmentAmount,
      label: "Cuota 2",
      dueDate: "En 4 semanas",
    },
    {
      number: 4,
      amount: installmentAmount,
      label: "Cuota 3",
      dueDate: "En 6 semanas",
    },
    {
      number: 5,
      amount: installmentAmount,
      label: "Cuota 4",
      dueDate: "En 8 semanas",
    },
  ];

  const onSubmit = async (data: CustomerFormData) => {
    // Validate department and city selection
    if (!selectedDepartment || !selectedCity) {
      alert("Por favor selecciona un departamento y una ciudad");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            ...data,
            city: selectedCity,
            state: selectedDepartment,
          },
          productId: product!.id,
          selectedColor: selectedColor!,
          totalAmount: product!.price,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear el pedido");
      }

      const result = await response.json();
      console.log("Order created:", result);

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error creating order:", error);
      setIsSubmitting(false);
      alert("Error al procesar el pedido. Por favor, inténtelo de nuevo.");
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    reset();
    onClose();
  };

  if (!product || !selectedColor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Ordenar {product.name}
          </DialogTitle>
          <DialogDescription>
            Complete sus datos para procesar su pedido
          </DialogDescription>
        </DialogHeader>

        {!isSubmitted ? (
          <div className="space-y-8">
            {/* Product Summary */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center space-x-4">
                <div
                  className="w-16 h-16 rounded-lg"
                  style={{ backgroundColor: selectedColor.hex }}
                />
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-gray-600">Color: {selectedColor.name}</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${product.price.toLocaleString("es-CO")} COP
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Plan */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Plan de Pagos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {paymentSchedule.map((payment) => (
                  <div
                    key={payment.number}
                    className={`p-4 rounded-lg border ${
                      payment.number === 1
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">
                        {payment.label}
                      </p>
                      <p className="text-lg font-bold text-blue-600">
                        ${payment.amount.toLocaleString("es-CO")}
                      </p>
                      <p className="text-xs text-gray-500">{payment.dueDate}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                <strong>Importante:</strong> El producto se entregará después
                del pago completo de todas las cuotas.
              </p>
            </div>

            {/* Customer Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <Input
                    {...register("firstName")}
                    placeholder="Su nombre"
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido *
                  </label>
                  <Input
                    {...register("lastName")}
                    placeholder="Su apellido"
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    {...register("email")}
                    placeholder="su@email.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <Input
                    type="tel"
                    {...register("phone")}
                    placeholder="+57 300 123 4567"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección *
                </label>
                <Input
                  {...register("street")}
                  placeholder="Calle 123 #45-67"
                  className={errors.street ? "border-red-500" : ""}
                />
                {errors.street && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.street.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <Select
                    onValueChange={handleCityChange}
                    value={selectedCity}
                    disabled={!selectedDepartment}
                  >
                    <SelectTrigger
                      className={errors.city ? "border-red-500" : ""}
                    >
                      <SelectValue
                        placeholder={
                          selectedDepartment
                            ? "Selecciona ciudad"
                            : "Primero selecciona departamento"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departamento *
                  </label>
                  <Select
                    onValueChange={handleDepartmentChange}
                    value={selectedDepartment}
                  >
                    <SelectTrigger
                      className={errors.state ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Selecciona departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {colombianData.departments.map((department) => (
                        <SelectItem key={department} value={department}>
                          {department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.state.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código Postal *
                  </label>
                  <Input
                    {...register("zipCode")}
                    placeholder="110111"
                    className={errors.zipCode ? "border-red-500" : ""}
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.zipCode.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Procesando..." : "Confirmar Pedido"}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Pedido Confirmado!
            </h3>
            <p className="text-gray-600 mb-6">
              Su pedido ha sido registrado exitosamente. Nos pondremos en
              contacto con usted en las próximas 24 horas para coordinar el pago
              inicial.
            </p>
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-green-800">
                <strong>Próximos pasos:</strong>
                <br />
                1. Recibirá un email de confirmación
                <br />
                2. Nuestro equipo se pondrá en contacto para el pago inicial
                <br />
                3. Coordinaremos la entrega después del pago completo
              </p>
            </div>
            <Button onClick={handleClose}>Cerrar</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
