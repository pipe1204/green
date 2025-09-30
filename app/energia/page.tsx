"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Battery,
  Recycle,
  Sun,
  Wind,
  Droplets,
  TreePine,
  TrendingUp,
  Shield,
} from "lucide-react";
import GlitchText from "@/components/GlitchText";
import CTASection from "@/components/CTASection";
import SplashCursor from "@/components/SplashCursor";

export default function EnergiaPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      <SplashCursor />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="pt-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Energía Limpia para el{" "}
            <GlitchText
              speed={1}
              enableShadows={true}
              enableOnHover={false}
              color="text-black"
              className="text-4xl md:text-6xl font-bold"
            >
              Futuro
            </GlitchText>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Descubre cómo los vehículos eléctricos están transformando el
            transporte con energía 100% renovable y cero emisiones.
          </p>
        </div>

        <div className="py-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12">
            Fuentes de Energía Renovables
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <Sun className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Energía Solar
              </h3>
              <p className="text-gray-600">
                Algunos centros de carga utilizan paneles solares para generar
                electricidad limpia directamente del sol.
              </p>
            </div>

            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <Wind className="w-16 h-16 text-blue-500 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Energía Eólica
              </h3>
              <p className="text-gray-600">
                Parques eólicos proporcionan energía renovable para cargar
                vehículos eléctricos de forma sostenible.
              </p>
            </div>

            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <Droplets className="w-16 h-16 text-cyan-500 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Energía Hidroeléctrica
              </h3>
              <p className="text-gray-600">
                Centrales hidroeléctricas generan energía limpia aprovechando la
                fuerza del agua en movimiento.
              </p>
            </div>
          </div>
        </div>

        <div className="py-16 bg-gray-50 rounded-lg">
          <div className="max-w-4xl mx-auto text-center">
            <Battery className="w-20 h-20 text-blue-600 mx-auto mb-8" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Tecnología de Baterías de Litio
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Las baterías de última generación ofrecen mayor autonomía, carga
              más rápida y vida útil extendida.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Mayor Autonomía
                </h3>
                <p className="text-gray-600">
                  Hasta 120 km de recorrido con una sola carga
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Carga Rápida
                </h3>
                <p className="text-gray-600">
                  Recarga completa en solo 2-4 horas
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Vida Útil Extendida
                </h3>
                <p className="text-gray-600">
                  Más de 1000 ciclos de carga completos
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="py-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12">
            Impacto Ambiental Positivo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TreePine className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Cero Emisiones
              </h3>
              <p className="text-gray-600">
                No emite gases contaminantes durante su uso
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ahorro de Combustible
              </h3>
              <p className="text-gray-600">
                Ahorra hasta $2,500,000 COP anuales en combustible
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ruido Reducido
              </h3>
              <p className="text-gray-600">90% menos contaminación acústica</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Recycle className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Reciclaje
              </h3>
              <p className="text-gray-600">
                Baterías 95% reciclables al final de su vida útil
              </p>
            </div>
          </div>
        </div>

        {/* Charging Infrastructure */}
        {/* <div className="py-16 bg-gray-50 rounded-lg">
          <div className="max-w-4xl mx-auto text-center">
            <Zap className="w-20 h-20 text-blue-600 mx-auto mb-8" />
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Red de Carga Inteligente
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Estamos construyendo la red de carga más amplia de Colombia con
              estaciones alimentadas por energía renovable.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  50+ Estaciones
                </h3>
                <p className="text-gray-600">
                  Red en expansión por todo el país
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Carga Rápida
                </h3>
                <p className="text-gray-600">
                  Estaciones de carga ultrarrápida disponibles
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  24/7 Disponible
                </h3>
                <p className="text-gray-600">
                  Acceso las 24 horas del día, todos los días
                </p>
              </div>
            </div>
          </div>
        </div> */}

        <div className="py-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12">
            Números que Importan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">0</div>
              <p className="text-gray-600">Emisiones de CO2 por vehículo</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
              <p className="text-gray-600">Energía renovable en estaciones</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">90%</div>
              <p className="text-gray-600">Reducción de ruido</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">2.5M</div>
              <p className="text-gray-600">COP ahorrados anualmente</p>
            </div>
          </div>
        </div>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
