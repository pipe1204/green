"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-white"
      style={{ paddingTop: "4rem" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Compara Vehículos Eléctricos
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Encuentra el vehículo eléctrico perfecto para ti. Compara
              características, precios y especificaciones de diferentes marcas y
              modelos en un solo lugar.
            </p>

            {/* Key Benefits */}
            <div className="mb-8 space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <span className="text-lg text-gray-700">
                  Compara hasta 3 modelos lado a lado
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <span className="text-lg text-gray-700">
                  Filtros por batería, autonomía y garantía
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <span className="text-lg text-gray-700">
                  Información actualizada de múltiples marcas
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 flex items-center space-x-2"
                onClick={() => router.push("/vehiculos")}
              >
                <span>Explorar Vehículos</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 text-lg px-8 py-4"
                onClick={() => router.push("/test-ride")}
              >
                Agendar una Prueba
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">50+</p>
                <p className="text-sm text-gray-600">Modelos disponibles</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">15+</p>
                <p className="text-sm text-gray-600">Marcas comparadas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">100%</p>
                <p className="text-sm text-gray-600">Información verificada</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div
              className="w-full h-96 lg:h-[500px] bg-cover bg-center bg-no-repeat rounded-lg shadow-2xl"
              style={{
                backgroundImage: `url("/hero-image-1.png")`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
