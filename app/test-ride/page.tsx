"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Calendar, Clock, User, CheckCircle } from "lucide-react";
import { products } from "@/data/products";

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

const steps = [
  { id: 1, title: "Elige tu modelo", icon: User },
  { id: 2, title: "Fecha y hora", icon: Calendar },
  { id: 3, title: "Tus datos", icon: User },
  { id: 4, title: "Confirmación", icon: CheckCircle },
];

export default function TestRidePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
  });
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

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

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit the form
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    // Here you would submit to your API
    console.log("Test ride request:", {
      product: selectedProduct,
      date: selectedDate,
      time: selectedTime,
      ...formData,
      department: selectedDepartment,
      city: selectedCity,
    });

    alert("¡Solicitud de prueba enviada! Nos pondremos en contacto pronto.");
    router.push("/");
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return selectedProduct !== "";
      case 2:
        return selectedDate !== "" && selectedTime !== "";
      case 3:
        return (
          formData.name &&
          formData.email &&
          formData.phone &&
          selectedDepartment &&
          selectedCity
        );
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={handleBack} className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-black">GREEN</h1>
                <p className="text-gray-600">Programa tu prueba</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isActive
                        ? "border-blue-600 bg-blue-600 text-white"
                        : isCompleted
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-300 bg-white text-gray-400"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p
                      className={`text-sm font-medium ${
                        isActive ? "text-blue-600" : "text-gray-600"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-0.5 mx-4 ${
                        isCompleted ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Elige tu modelo
              </h2>
              <p className="text-gray-600">
                Selecciona el vehículo que te gustaría probar
              </p>
            </div>

            <div className="grid gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedProduct === product.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedProduct(product.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🏍️</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {product.description}
                      </p>
                      <p className="text-blue-600 font-semibold mt-2">
                        ${product.price.toLocaleString("es-CO")} COP
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Fecha y hora
              </h2>
              <p className="text-gray-600">
                Elige cuándo te gustaría hacer la prueba
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha preferida
                </label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora preferida
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="">Selecciona una hora</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Tus datos
              </h2>
              <p className="text-gray-600">
                Necesitamos algunos datos para contactarte
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+57 300 123 4567"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departamento *
                  </label>
                  <Select
                    onValueChange={handleDepartmentChange}
                    value={selectedDepartment}
                  >
                    <SelectTrigger>
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
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <Select
                    onValueChange={handleCityChange}
                    value={selectedCity}
                    disabled={!selectedDepartment}
                  >
                    <SelectTrigger>
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
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Confirmación
              </h2>
              <p className="text-gray-600">
                Revisa los detalles de tu solicitud
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Modelo seleccionado:
                </h3>
                <p className="text-gray-600">
                  {products.find((p) => p.id === selectedProduct)?.name}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">Fecha y hora:</h3>
                <p className="text-gray-600">
                  {new Date(selectedDate).toLocaleDateString("es-CO")} a las{" "}
                  {selectedTime}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Datos de contacto:
                </h3>
                <p className="text-gray-600">{formData.name}</p>
                <p className="text-gray-600">{formData.email}</p>
                <p className="text-gray-600">{formData.phone}</p>
                <p className="text-gray-600">
                  {selectedCity}, {selectedDepartment}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12">
          <Button variant="outline" onClick={handleBack}>
            {currentStep === 1 ? "Volver" : "Anterior"}
          </Button>

          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {currentStep === 4 ? "Confirmar" : "Siguiente"}
          </Button>
        </div>
      </div>
    </div>
  );
}
