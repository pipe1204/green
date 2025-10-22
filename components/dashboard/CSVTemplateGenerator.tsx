import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface CSVTemplateGeneratorProps {
  className?: string;
}

export function CSVTemplateGenerator({
  className = "",
}: CSVTemplateGeneratorProps) {
  const generateCSVTemplate = () => {
    // CSV headers in Spanish
    const headers = [
      "nombre", // Nombre del vehículo (requerido)
      "marca", // Marca (requerido)
      "tipo", // Tipo: motocicleta, patineta, bicicleta, carro, camion (requerido)
      "precio", // Precio en COP (requerido)
      "ubicacion", // Ubicación (requerido)
      "disponibilidad", // Estado: disponible, pre-orden, proximamente (requerido)
      "autonomia", // Autonomía en km (requerido)
      "tiempo_carga", // Tiempo de carga en horas (requerido)
      "bateria", // Batería (requerido)
      "unidad_garantia", // Unidad de garantía: años, año, km (requerido)
      "valor_garantia", // Valor de garantía (requerido)
      "velocidad_maxima", // Velocidad máxima en km/h (requerido)
      "potencia", // Potencia en kW (requerido)
      "descripcion", // Descripción (opcional)
      "caracteristicas", // Características separadas por comas (opcional)
    ];

    // Sample data row
    const sampleRow = [
      "Tesla Model 3",
      "Tesla",
      "carro",
      "50000000",
      "Bogotá",
      "disponible",
      "400",
      "8",
      "75 kWh",
      "años",
      "8",
      "200",
      "300",
      "Vehículo eléctrico de alta gama con autopilot",
      "GPS,Bluetooth,Autopilot,Pantalla táctil",
    ];

    // Create CSV content
    const csvContent = [
      // Header row
      headers.join(","),
      // Sample data row
      sampleRow.map((field) => `"${field}"`).join(","),
      // Empty row for user to fill
      headers.map(() => "").join(","),
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "plantilla_vehiculos.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      onClick={generateCSVTemplate}
      variant="outline"
      className={`flex items-center space-x-2 ${className}`}
    >
      <Download className="w-4 h-4" />
      <span>Descargar Plantilla CSV</span>
    </Button>
  );
}
