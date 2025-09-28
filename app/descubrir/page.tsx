"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Play,
  Users,
  MessageCircle,
  Award,
  TrendingUp,
  Calendar,
  CheckCircle,
} from "lucide-react";
import CTASection from "@/components/CTASection";
import SplashCursor from "@/components/SplashCursor";

export default function DescubrirPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      <SplashCursor />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* Hero Section */}
        <div className="py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Descubre el Futuro
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Explora, aprende y únete a la revolución de la movilidad eléctrica.
            Desde guías de inicio hasta historias de éxito de nuestros clientes.
          </p>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Comienza tu Viaje
          </Button>
        </div>

        {/* Learning Resources */}
        <div className="py-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12">
            Centro de Aprendizaje
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Guides */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <BookOpen className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Guías de Inicio
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Todo lo que necesitas saber para comenzar con vehículos
                eléctricos
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Leer Guías
              </Button>
            </div>

            {/* Videos */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <Play className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Videos Tutoriales
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Aprende viendo: desde carga hasta mantenimiento
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Ver Videos
              </Button>
            </div>

            {/* FAQ */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <MessageCircle className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Preguntas Frecuentes
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Respuestas a las dudas más comunes sobre movilidad eléctrica
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Ver FAQ
              </Button>
            </div>

            {/* Community */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <Users className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Comunidad
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Conecta con otros propietarios y comparte experiencias
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Unirse
              </Button>
            </div>
          </div>
        </div>

        {/* Success Stories */}
        <div className="py-16 bg-gray-50 rounded-lg">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12">
            Historias de Éxito
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">MR</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    María Rodríguez
                  </h4>
                  <p className="text-sm text-gray-600">Bogotá</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                &quot;Mi Eco Rider Pro ha transformado mi rutina diaria. Ahorro
                $300,000 COP mensuales en transporte y contribuyo al medio
                ambiente.&quot;
              </p>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>6 meses usando</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold">CG</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Carlos García</h4>
                  <p className="text-sm text-gray-600">Medellín</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                &quot;Como repartidor, mi Urban Scooter Lite es perfecto.
                Silencioso, eficiente y me permite trabajar sin contaminar la
                ciudad.&quot;
              </p>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>4 meses usando</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-bold">AL</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Ana López</h4>
                  <p className="text-sm text-gray-600">Cali</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                &quot;Mi Mountain Bike Eléctrica me permite explorar la
                naturaleza sin esfuerzo. Es perfecta para mis aventuras de fin
                de semana.&quot;
              </p>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>8 meses usando</span>
              </div>
            </div>
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="py-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12">
            Tu Impacto en el Planeta
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Con un Vehículo Eléctrico Green
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">0 kg CO2</p>
                    <p className="text-gray-600">Emisiones anuales</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">2,500,000 COP</p>
                    <p className="text-gray-600">Ahorro anual en combustible</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      90% menos ruido
                    </p>
                    <p className="text-gray-600">Contaminación acústica</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      100% renovable
                    </p>
                    <p className="text-gray-600">Energía para carga</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Calculadora de Impacto
              </h3>
              <p className="text-gray-600 mb-6">
                Descubre cuánto puedes ahorrar y cuánto puedes ayudar al medio
                ambiente con un vehículo eléctrico.
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Calcular Mi Impacto
              </Button>
            </div>
          </div>
        </div>

        {/* Events & News */}
        <div className="py-16 bg-gray-50 rounded-lg">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12">
            Eventos y Noticias
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Test Drive Gratuito
                  </h3>
                  <p className="text-sm text-gray-600">15 de Marzo, 2024</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Únete a nuestro evento de prueba gratuita en el Centro Comercial
                Santafé. Prueba todos nuestros modelos.
              </p>
              <Button size="sm" variant="outline">
                Registrarse
              </Button>
            </div>

            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Award className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Premio Sostenibilidad
                  </h3>
                  <p className="text-sm text-gray-600">28 de Febrero, 2024</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Green ha sido reconocida como la empresa más sostenible del
                sector automotriz en Colombia 2024.
              </p>
              <Button size="sm" variant="outline">
                Leer Más
              </Button>
            </div>
          </div>
        </div>

        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
