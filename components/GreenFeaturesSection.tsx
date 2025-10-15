"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Bell,
  MessageSquare,
  Calendar,
  Zap,
  Search,
  Check,
  Crown,
  BarChart3,
  Tag,
  Clock,
  Send,
  Store,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { timeSlots } from "@/data";

// Customer Feature Demos
const FavoritesDemo = () => {
  const [isFavorited, setIsFavorited] = useState(false);
  return (
    <div>
      <div className="mb-3">
        <h4 className="text-lg text-center font-semibold text-gray-900 mb-2">
          <Heart className="w-5 h-5 inline mr-2 text-red-500" />
          Guarda tus Favoritos
        </h4>
        <p className="text-sm text-center text-gray-600">
          Marca los vehículos que más te gusten y accede a ellos fácilmente
          desde tu perfil. Recibe notificaciones cuando cambien de precio.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h5 className="font-semibold text-gray-900">Tesla Model 3</h5>
          <Button
            size="sm"
            variant={isFavorited ? "default" : "outline"}
            onClick={() => setIsFavorited(!isFavorited)}
            className={isFavorited ? "bg-red-600 hover:bg-red-700" : ""}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>
    </div>
  );
};

const PriceAlertDemo = () => {
  const [targetPrice, setTargetPrice] = useState("5000000");
  return (
    <div>
      <div className="mb-3">
        <h4 className="text-lg text-center font-semibold text-gray-900 mb-2">
          <Bell className="w-5 h-5 inline mr-2 text-purple-600" />
          Alertas de Precio
        </h4>
        <p className="text-sm text-center text-gray-600">
          Recibe notificaciones cuando el precio de un vehículo baje a tu rango
          deseado. No pierdas las mejores ofertas.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="space-y-3">
          <Input
            type="number"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            placeholder="Precio objetivo"
            className="text-sm"
          />
          <Button
            size="sm"
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Bell className="w-4 h-4 mr-2" />
            Crear Alerta
          </Button>
        </div>
      </div>
    </div>
  );
};

const ContactVendorDemo = () => {
  return (
    <div>
      <div className="mb-3">
        <h4 className="text-lg text-center font-semibold text-gray-900 mb-2">
          <MessageSquare className="w-5 h-5 inline mr-2 text-green-600" />
          Contacta Vendedores
        </h4>
        <p className="text-sm text-center text-gray-600">
          Conecta directamente con vendedores verificados. Obtén respuestas
          rápidas y toda la información que necesitas.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="space-y-3">
          <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
            &ldquo;Hola, me interesa el Tesla Model 3. ¿Está disponible?&rdquo;
          </div>
          <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
            <Send className="w-4 h-4 mr-2" />
            Enviar Mensaje
          </Button>
        </div>
      </div>
    </div>
  );
};

const TestDriveDemo = () => {
  const [selectedTime, setSelectedTime] = useState("");

  return (
    <div>
      <div className="mb-3">
        <h4 className="text-lg text-center font-semibold text-gray-900 mb-2">
          <Calendar className="w-5 h-5 inline mr-2 text-blue-600" />
          Pruebas de Manejo
        </h4>
        <p className="text-sm text-center text-gray-600">
          Agenda una prueba de manejo para experimentar el vehículo antes de
          comprar. Sin compromiso de compra.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="space-y-3">
          <Input type="date" className="text-sm" defaultValue="2025-11-20" />
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">Seleccionar hora</option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
            <Calendar className="w-4 h-4 mr-2" />
            Agendar Prueba
          </Button>
        </div>
      </div>
    </div>
  );
};

// Vendor Feature Demos
const SaleTagsDemo = () => {
  return (
    <div>
      <div className="mb-3">
        <h4 className="text-lg text-center font-semibold text-gray-900 mb-2">
          <Tag className="w-5 h-5 inline mr-2 text-orange-600" />
          Etiquetas de Oferta
        </h4>
        <p className="text-sm text-center text-gray-600">
          Destaca tus vehículos con ofertas especiales. Atrae más compradores
          con precios promocionales y etiquetas llamativas.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" defaultChecked />
            <span className="text-sm text-gray-700">Activar Oferta</span>
          </div>
          <Input
            type="number"
            placeholder="Precio de oferta"
            className="text-sm"
            defaultValue="25000000"
          />
          <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold animate-pulse">
            🔥 ¡EN OFERTA!
          </div>
        </div>
      </div>
    </div>
  );
};

const ProBadgesDemo = () => {
  return (
    <div>
      <div className="mb-3">
        <h4 className="text-lg text-center font-semibold text-gray-900 mb-2">
          <Crown className="w-5 h-5 inline mr-2 text-purple-600" />
          Badges Pro
        </h4>
        <p className="text-sm text-center text-gray-600">
          Gana la confianza de los compradores con badges de verificación.
          Destaca tu profesionalismo y velocidad de respuesta.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="space-y-2">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Check className="w-3 h-3 mr-1" />
            Verificado
          </Badge>
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <Clock className="w-3 h-3 mr-1" />
            Respuesta Rápida
          </Badge>
        </div>
      </div>
    </div>
  );
};

const AnalyticsDemo = () => {
  return (
    <div>
      <div className="mb-3">
        <h4 className="text-lg text-center font-semibold text-gray-900 mb-2">
          <BarChart3 className="w-5 h-5 inline mr-2 text-purple-600" />
          Analytics en Tiempo Real
        </h4>
        <p className="text-sm text-center text-gray-600">
          Monitorea el rendimiento de tus vehículos en tiempo real. Ve cuántas
          personas los ven, guardan y contactan contigo.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-blue-50 p-2 rounded">
              <div className="text-lg font-bold text-blue-600">1,234</div>
              <div className="text-xs text-gray-600">Vistas</div>
            </div>
            <div className="bg-green-50 p-2 rounded">
              <div className="text-lg font-bold text-green-600">89</div>
              <div className="text-xs text-gray-600">Favoritos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlatformChatDemo = () => {
  return (
    <div>
      <div className="mb-3">
        <h4 className="text-lg text-center font-semibold text-gray-900 mb-2">
          <MessageSquare className="w-5 h-5 inline mr-2 text-green-600" />
          Chat en Plataforma
        </h4>
        <p className="text-sm text-center text-gray-600">
          Comunícate directamente con compradores interesados. Responde
          preguntas, agenda pruebas y cierra ventas desde la plataforma.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded-lg text-sm">
            <div className="font-medium text-blue-900">Cliente</div>
            <div className="text-blue-800">¿Está disponible para prueba?</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-sm ml-4">
            <div className="font-medium text-gray-900">Tú</div>
            <div className="text-gray-800">¡Sí! ¿Cuándo te conviene?</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function GreenFeaturesSection() {
  const router = useRouter();
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Características que sabemos que te van a encantar
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Green está diseñado para hacer que encontrar y comprar tu vehículo
            eléctrico ideal sea una experiencia sencilla, segura y emocionante.
          </p>
        </div>

        {/* Customer Features */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Para Compradores
            </h3>
            <p className="text-gray-600">
              Herramientas que te ayudan a encontrar y comprar tu vehículo ideal
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ContactVendorDemo />
            <FavoritesDemo />
            <PriceAlertDemo />
            <TestDriveDemo />
          </div>
        </div>

        {/* Vendor Features */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Para Vendedores
            </h3>
            <p className="text-gray-600">
              Funciones profesionales para maximizar tus ventas
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SaleTagsDemo />
            <ProBadgesDemo />
            <AnalyticsDemo />
            <PlatformChatDemo />
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-green-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-900">
              ¿Listo para encontrar tu vehículo ideal?
            </h3>
          </div>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Únete a miles de personas que ya encontraron su vehículo eléctrico
            perfecto en Green. Comienza tu búsqueda hoy mismo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              onClick={() => {
                const resultadosSection = document.querySelector(
                  '[data-section="resultados"]'
                );
                if (resultadosSection) {
                  resultadosSection.scrollIntoView({ behavior: "smooth" });
                } else {
                  router.push("/resultados");
                }
              }}
            >
              <Search className="w-5 h-5 mr-2" />
              Explorar Vehículos
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3"
              onClick={() => router.push("/tiendas")}
            >
              <Store className="w-5 h-5 mr-2" />
              Ser Vendedor
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
