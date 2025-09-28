"use client";
import { Car, Zap, Leaf, Settings } from "lucide-react";

export default function ComparisonSection() {
  return (
    <section id="vehiculos" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Comparison Features */}
        <div className="text-center">
          <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            ¿Por qué Comparar con Nosotros?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Información Neutral</h4>
              <p className="text-gray-600 text-sm">
                Datos objetivos sin sesgo de marca
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="font-semibold mb-2">Actualización Constante</h4>
              <p className="text-gray-600 text-sm">
                Especificaciones siempre actualizadas
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-yellow-600" />
              </div>
              <h4 className="font-semibold mb-2">Filtros Avanzados</h4>
              <p className="text-gray-600 text-sm">
                Encuentra exactamente lo que necesitas
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Múltiples Marcas</h4>
              <p className="text-gray-600 text-sm">
                Compara todas las opciones disponibles
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
