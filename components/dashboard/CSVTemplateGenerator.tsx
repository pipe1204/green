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
    // CSV headers with descriptions
    const headers = [
      "name", // Nombre del vehículo (requerido)
      "brand", // Marca (requerido)
      "type", // Tipo: motocicleta, patineta, bicicleta, carro, camion (requerido)
      "price", // Precio en COP (requerido)
      "location", // Ubicación (requerido)
      "availability", // Estado: in-stock, pre-order, coming-soon (requerido)
      "range", // Autonomía en km (requerido)
      "chargeTime", // Tiempo de carga en horas (requerido)
      "battery", // Batería (requerido)
      "warrantyUnit", // Unidad de garantía: years, km (requerido)
      "warrantyValue", // Valor de garantía (requerido)
      "maxSpeed", // Velocidad máxima en km/h (requerido)
      "power", // Potencia en kW (requerido)
      "description", // Descripción (opcional)
      "features", // Características separadas por comas (opcional)
    ];

    // Sample data row
    const sampleRow = [
      "Tesla Model 3",
      "Tesla",
      "carro",
      "50000000",
      "Bogotá",
      "in-stock",
      "400",
      "8",
      "75 kWh",
      "years",
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
