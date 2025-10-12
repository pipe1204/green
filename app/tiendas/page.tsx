"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Store,
  TrendingUp,
  Users,
  BarChart3,
  Shield,
  Zap,
  MessageSquare,
  Award,
  Tag,
  Star,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import SplashCursor from "@/components/SplashCursor";
import { VendorPricingModal } from "@/components/VendorPricingModal";
import CountUp from "@/components/CountUp";

export default function TiendasPage() {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white pb-20">
      <SplashCursor />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* Hero Section */}
        <div className="py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Vende Vehículos Eléctricos en{" "}
            <span className="text-green-600">Green</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Únete a la plataforma líder de movilidad eléctrica en Colombia.
            Conecta con compradores cualificados, aumenta tus ventas y haz
            crecer tu negocio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setIsPricingModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white text-lg px-8"
            >
              Ver Planes y Precios
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8"
              onClick={() => {
                const section = document.getElementById("beneficios");
                section?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Conocer Más
            </Button>
          </div>
          <p className="text-sm text-green-600 mt-4 font-semibold">
            🎉 Prueba el Plan Pro gratis por 30 días al registrarte
          </p>
        </div>

        {/* Stats Section */}
        <div className="py-16 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8">
            <div className="text-center">
              <div>
                <CountUp
                  from={0}
                  to={100}
                  separator=","
                  direction="up"
                  duration={1}
                  className="count-up-text text-4xl md:text-6xl font-bold text-green-600"
                />
                <span className="text-4xl md:text-6xl font-bold text-green-600">
                  +
                </span>
              </div>
              <p className="text-gray-600">Vendedores Activos</p>
            </div>
            <div className="text-center">
              <div>
                <CountUp
                  from={0}
                  to={10}
                  separator=","
                  direction="up"
                  duration={1}
                  className="count-up-text text-4xl md:text-6xl font-bold text-green-600"
                />
                <span className="text-4xl md:text-6xl font-bold text-green-600">
                  Mil
                </span>
              </div>
              <p className="text-gray-600">Compradores Mensuales</p>
            </div>
            <div className="text-center">
              <div>
                <CountUp
                  from={0}
                  to={85}
                  separator=","
                  direction="up"
                  duration={1}
                  className="count-up-text text-4xl md:text-6xl font-bold text-green-600"
                />
                <span className="text-4xl md:text-6xl font-bold text-green-600">
                  %
                </span>
              </div>
              <p className="text-gray-600">Tasa de Conversión</p>
            </div>
            <div className="text-center">
              <div>
                <span className="text-4xl md:text-6xl font-bold text-green-600">
                  $
                </span>
                <CountUp
                  from={0}
                  to={120}
                  separator=","
                  direction="up"
                  duration={1}
                  className="count-up-text text-4xl md:text-6xl font-bold text-green-600"
                />
                <span className="text-4xl md:text-6xl font-bold text-green-600">
                  +
                </span>
              </div>
              <p className="text-gray-600">En Ventas (COP)</p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div id="beneficios" className="py-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-4">
            ¿Por Qué Vender en Green?
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Te damos todas las herramientas para que crezcas tu negocio de
            vehículos eléctricos
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Audiencia Cualificada
              </h3>
              <p className="text-gray-600">
                Conecta con compradores interesados en vehículos eléctricos.
                Tráfico de calidad que busca activamente comprar.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Analíticas Avanzadas
              </h3>
              <p className="text-gray-600">
                Dashboard completo con vistas, favoritos, alertas de precio y
                métricas de conversión en tiempo real.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Visibilidad Premium
              </h3>
              <p className="text-gray-600">
                Destacate en resultados de búsqueda y homepage. Aumenta tu
                alcance con ubicación prioritaria.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Insignia Verificado
              </h3>
              <p className="text-gray-600">
                Genera confianza con la insignia de vendedor verificado. Destaca
                tu profesionalismo y credibilidad.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Mensajería Directa
              </h3>
              <p className="text-gray-600">
                Recibe consultas directamente en la plataforma y por WhatsApp.
                Responde rápido y cierra ventas más fácil.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Tag className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Promociones Ilimitadas
              </h3>
              <p className="text-gray-600">
                Crea ofertas especiales, descuentos y etiquetas promocionales
                para atraer más compradores.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="py-16 bg-gray-50 rounded-2xl">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12">
            Cómo Funciona
          </h2>
          <div className="max-w-4xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Regístrate
                </h3>
                <p className="text-gray-600 text-sm">
                  Crea tu cuenta y elige el plan que mejor se adapte a tu
                  negocio
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Publica
                </h3>
                <p className="text-gray-600 text-sm">
                  Agrega tus vehículos con fotos, especificaciones y precios
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Conecta
                </h3>
                <p className="text-gray-600 text-sm">
                  Recibe consultas de compradores interesados en tiempo real
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  4
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Vende
                </h3>
                <p className="text-gray-600 text-sm">
                  Cierra ventas y haz crecer tu negocio con nuestra plataforma
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="py-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-4">
            Funcionalidades Incluidas
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Todas las herramientas que necesitas para vender más
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="flex items-start space-x-4 bg-white p-6 rounded-lg border border-gray-200">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Perfil de Vendedor Público
                </h3>
                <p className="text-sm text-gray-600">
                  Tu propia página de vendedor con información de contacto y
                  catálogo
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white p-6 rounded-lg border border-gray-200">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Publicaciones Ilimitadas
                </h3>
                <p className="text-sm text-gray-600">
                  Publica todos los vehículos que quieras sin límites
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white p-6 rounded-lg border border-gray-200">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Dashboard de Analíticas
                </h3>
                <p className="text-sm text-gray-600">
                  Vistas, guardados, alertas de precio y métricas de rendimiento
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white p-6 rounded-lg border border-gray-200">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Mensajería con Compradores
                </h3>
                <p className="text-sm text-gray-600">
                  Recibe y responde consultas directamente en la plataforma
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white p-6 rounded-lg border border-gray-200">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Gestión de Inventario
                </h3>
                <p className="text-sm text-gray-600">
                  Administra tu catálogo fácilmente con carga masiva de
                  vehículos
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white p-6 rounded-lg border border-gray-200">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Etiquetas Promocionales
                </h3>
                <p className="text-sm text-gray-600">
                  Marca vehículos en oferta con descuentos y promociones
                  especiales
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Stories */}
        <div className="py-16 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-4">
            Historias de Éxito
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Vendedores que han crecido con Green
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold text-lg">EM</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    E-Mobility Colombia
                  </h4>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">
                      4.9 (120 reseñas)
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                &quot;Desde que nos unimos a Green, nuestras ventas aumentaron
                un 200%. La calidad de los leads es excepcional.&quot;
              </p>
              <div className="flex items-center text-sm text-green-600 font-semibold">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+200% en ventas</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold text-lg">EV</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    EV Motors Bogotá
                  </h4>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">
                      4.8 (85 reseñas)
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                &quot;Las analíticas nos ayudaron a optimizar nuestros precios.
                El Plan Pro vale cada peso invertido.&quot;
              </p>
              <div className="flex items-center text-sm text-blue-600 font-semibold">
                <Award className="w-4 h-4 mr-1" />
                <span>Vendedor Verificado</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-bold text-lg">GE</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Green Scooters
                  </h4>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">
                      5.0 (45 reseñas)
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                &quot;Comenzamos con el Plan Starter y en 3 meses migramos a
                Pro. Los resultados hablan por sí solos.&quot;
              </p>
              <div className="flex items-center text-sm text-purple-600 font-semibold">
                <Users className="w-4 h-4 mr-1" />
                <span>500+ consultas/mes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="py-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            ¿Listo para Empezar?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Únete a cientos de vendedores que ya están vendiendo vehículos
            eléctricos en Green
          </p>
          <Button
            size="lg"
            onClick={() => setIsPricingModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white text-lg px-12 py-6"
          >
            <Zap className="w-5 h-5 mr-2" />
            Ver Planes y Precios
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            30 días gratis de Pro • Cancela cuando quieras
          </p>
        </div>

        {/* Vendor CTA Section */}
        <section className="relative w-full py-16 bg-white overflow-hidden rounded-2xl">
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 opacity-50" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center relative">
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 drop-shadow-lg">
                Comienza a Vender Hoy
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500 drop-shadow-lg">
                  en Green
                </span>
              </h2>

              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                Únete a la comunidad de vendedores de vehículos eléctricos más
                grande de Colombia. Prueba todas las funcionalidades Pro gratis
                por 30 días.
              </p>

              <Button
                onClick={() => setIsPricingModalOpen(true)}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white text-lg px-8 py-4 rounded-xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Store className="w-5 h-5 mr-2" />
                Ver Planes y Comenzar
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <p className="text-sm text-gray-500 mt-6 drop-shadow-md">
                Cancela cuando quieras • Soporte 24/7
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Pricing Modal */}
      <VendorPricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
      />
    </div>
  );
}
