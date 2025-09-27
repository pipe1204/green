"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  ArrowRight,
  Users,
  Shield,
  Zap,
  Target,
  BarChart3,
  Star,
  GitCompare,
} from "lucide-react";

export default function HowItWorksSection() {
  const router = useRouter();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Cómo Funciona Nuestra Plataforma
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Encuentra el vehículo eléctrico perfecto en 3 simples pasos. Nuestra
            plataforma te ayuda a comparar y decidir con confianza.
          </p>
        </div>

        {/* Steps */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Explora y Filtra
                </h3>
                <p className="text-gray-600 mb-6">
                  Navega por nuestra base de datos de vehículos eléctricos y usa
                  filtros avanzados para encontrar opciones que se ajusten a tus
                  necesidades específicas.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Compara Modelos
                </h3>
                <p className="text-gray-600 mb-6">
                  Selecciona hasta 3 vehículos para comparar lado a lado. Ve
                  especificaciones, precios, garantías y características en una
                  tabla clara y fácil de entender.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Toma tu Decisión
                </h3>
                <p className="text-gray-600 mb-6">
                  Con toda la información en tus manos, toma la decisión más
                  informada. Conectamos contigo con concesionarios verificados
                  para completar tu compra.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="py-16 bg-gray-50 rounded-lg">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            ¿Por qué Elegir Nuestra Plataforma?
          </h3>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg">
                <div className="flex items-start space-x-4">
                  <Shield className="w-8 h-8 text-blue-600 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Información Verificada
                    </h4>
                    <p className="text-gray-600">
                      Todos los datos son verificados directamente con los
                      fabricantes y concesionarios para garantizar precisión.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-lg">
                <div className="flex items-start space-x-4">
                  <Zap className="w-8 h-8 text-blue-600 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Actualización Constante
                    </h4>
                    <p className="text-gray-600">
                      Mantenemos la información actualizada con los últimos
                      modelos, precios y especificaciones del mercado.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-lg">
                <div className="flex items-start space-x-4">
                  <Users className="w-8 h-8 text-blue-600 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Neutralidad Total
                    </h4>
                    <p className="text-gray-600">
                      No favorecemos ninguna marca. Nuestro objetivo es ayudarte
                      a encontrar el vehículo que mejor se adapte a ti.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-lg">
                <div className="flex items-start space-x-4">
                  <Star className="w-8 h-8 text-blue-600 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Experiencia Personalizada
                    </h4>
                    <p className="text-gray-600">
                      Filtros inteligentes y recomendaciones basadas en tus
                      necesidades específicas y presupuesto.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
