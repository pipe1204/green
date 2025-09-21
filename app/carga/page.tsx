"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Zap,
  MapPin,
  Clock,
  Battery,
  Plug,
  Home,
  Building,
  Car,
  Smartphone,
  Wifi,
  Shield,
  CheckCircle,
  Navigation,
} from "lucide-react";

export default function CargaPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* Hero Section */}
        <div className="py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Carga Inteligente y Rápida
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Encuentra estaciones de carga cerca de ti, programa cargas
            inteligentes y disfruta de la conveniencia de la movilidad
            eléctrica.
          </p>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Encuentra Estaciones Cercanas
          </Button>
        </div>

        {/* Charging Options */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Opciones de Carga
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Home Charging */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
              <Home className="w-16 h-16 text-blue-600 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Carga en Casa
              </h3>
              <p className="text-gray-600 mb-6">
                Instala un cargador en tu hogar para cargar durante la noche y
                despertar con la batería llena.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>6-8 horas (carga completa)</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>3.7 kW de potencia</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Instalación incluida</span>
                </div>
              </div>
            </div>

            {/* Public Charging */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
              <Building className="w-16 h-16 text-green-600 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Carga Pública
              </h3>
              <p className="text-gray-600 mb-6">
                Red de estaciones públicas en centros comerciales, supermercados
                y estacionamientos.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>2-4 horas (carga completa)</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>7.4 kW de potencia</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>50+ ubicaciones</span>
                </div>
              </div>
            </div>

            {/* Fast Charging */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
              <Zap className="w-16 h-16 text-orange-600 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Carga Rápida
              </h3>
              <p className="text-gray-600 mb-6">
                Estaciones de carga ultrarrápida para viajes largos y recargas
                express.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>30-60 minutos (80%)</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>50 kW de potencia</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Navigation className="w-4 h-4" />
                  <span>En autopistas principales</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charging Process */}
        <div className="py-16 bg-gray-50 rounded-lg">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Cómo Cargar tu Vehículo
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Encuentra
                </h3>
                <p className="text-gray-600">
                  Localiza la estación más cercana usando nuestra app
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Conecta
                </h3>
                <p className="text-gray-600">
                  Conecta tu vehículo al cargador con el cable incluido
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Activa
                </h3>
                <p className="text-gray-600">
                  Inicia la carga con tu app o tarjeta de pago
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">4</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Monitorea
                </h3>
                <p className="text-gray-600">
                  Acompaña el progreso desde tu smartphone
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charging Network Map */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Red de Estaciones
          </h2>
          <div className="bg-gray-100 rounded-lg p-8 text-center mb-8">
            <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Mapa Interactivo
            </h3>
            <p className="text-gray-600 mb-6">
              Explora nuestra red de estaciones de carga en tiempo real
            </p>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Ver Mapa
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white border border-gray-200 rounded-lg">
              <Building className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">
                Centros Comerciales
              </h4>
              <p className="text-gray-600 text-sm">25+ ubicaciones</p>
            </div>
            <div className="text-center p-6 bg-white border border-gray-200 rounded-lg">
              <Car className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">
                Estacionamientos
              </h4>
              <p className="text-gray-600 text-sm">15+ ubicaciones</p>
            </div>
            <div className="text-center p-6 bg-white border border-gray-200 rounded-lg">
              <Navigation className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Autopistas</h4>
              <p className="text-gray-600 text-sm">10+ ubicaciones</p>
            </div>
          </div>
        </div>

        {/* Smart Features */}
        <div className="py-16 bg-gray-50 rounded-lg">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Características Inteligentes
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg">
                <div className="flex items-start space-x-4">
                  <Smartphone className="w-8 h-8 text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      App Móvil
                    </h3>
                    <p className="text-gray-600">
                      Localiza estaciones, programa cargas y monitorea el
                      progreso desde tu smartphone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-lg">
                <div className="flex items-start space-x-4">
                  <Wifi className="w-8 h-8 text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Conectividad
                    </h3>
                    <p className="text-gray-600">
                      Estaciones conectadas para monitoreo en tiempo real y
                      actualizaciones automáticas.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-lg">
                <div className="flex items-start space-x-4">
                  <Shield className="w-8 h-8 text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Seguridad
                    </h3>
                    <p className="text-gray-600">
                      Sistemas de seguridad avanzados para proteger tu vehículo
                      durante la carga.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-lg">
                <div className="flex items-start space-x-4">
                  <Battery className="w-8 h-8 text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Carga Inteligente
                    </h3>
                    <p className="text-gray-600">
                      Optimización automática de la carga para maximizar la vida
                      útil de la batería.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Tarifas de Carga
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Carga Lenta
              </h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">$800</div>
              <p className="text-gray-600 mb-6">COP por kWh</p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Ideal para carga nocturna</li>
                <li>• Mejor para la batería</li>
                <li>• Disponible 24/7</li>
              </ul>
            </div>
            <div className="bg-white border-2 border-blue-600 rounded-lg p-8 text-center relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                Más Popular
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Carga Rápida
              </h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                $1,200
              </div>
              <p className="text-gray-600 mb-6">COP por kWh</p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Carga en 2-4 horas</li>
                <li>• Perfecto para el día</li>
                <li>• Ubicaciones estratégicas</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Carga Ultrarrápida
              </h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                $1,800
              </div>
              <p className="text-gray-600 mb-6">COP por kWh</p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Carga en 30-60 min</li>
                <li>• Para viajes largos</li>
                <li>• En autopistas</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-blue-600 rounded-lg text-center text-white">
          <h2 className="text-3xl font-bold mb-6">¿Listo para Cargar?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Descarga nuestra app y comienza a disfrutar de la carga inteligente
            hoy mismo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Descargar App
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
              onClick={() => window.open("/vehiculos", "_self")}
            >
              Ver Vehículos
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
