"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MessageCircle,
  Leaf,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export default function Footer() {
  const router = useRouter();

  const handleTestRideClick = () => {
    router.push("/test-ride");
  };

  const handleQuestionClick = () => {
    // You can implement a simple contact modal or redirect to a contact page
    window.open("mailto:info@green.co?subject=Consulta sobre vehículos eléctricos", "_blank");
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Test Ride Section */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <div className="flex items-center mb-6">
              <Calendar className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Programa una Prueba</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Experimenta la emoción de conducir un vehículo eléctrico. Programa
              una prueba gratuita y descubre por qué Green es la mejor opción.
            </p>
            <Button
              onClick={handleTestRideClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Programar Prueba Gratuita
            </Button>
          </div>

          {/* Questions Section */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <div className="flex items-center mb-6">
              <MessageCircle className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Haz una Pregunta</h3>
            </div>
            <p className="text-gray-600 mb-6">
              ¿Tienes dudas sobre nuestros vehículos? Nuestro equipo de expertos
              está aquí para ayudarte.
            </p>
            <Button
              onClick={handleQuestionClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Enviar Pregunta
            </Button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4 flex items-center text-gray-900">
                <Leaf className="w-5 h-5 mr-2 text-blue-600" />
                Green
              </h4>
              <p className="text-gray-600 text-sm">
                Vehículos eléctricos sostenibles para un futuro más limpio en
                Colombia.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Vehículos</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Eco Rider Pro</li>
                <li>Urban Scooter Lite</li>
                <li>Mountain Bike Eléctrica</li>
                <li>Próximamente</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Soporte</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Centro de Ayuda</li>
                <li>Garantía</li>
                <li>Mantenimiento</li>
                <li>Financiación</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Contacto</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  +57 1 234 5678
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  info@green.co
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Bogotá, Colombia
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600 mb-4 md:mb-0">
              © 2024 Green. Todos los derechos reservados.
            </div>
            <div className="flex space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900 transition-colors">
                Privacidad
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Términos
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Contacto
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Noticias
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Ubicaciones
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 md:hidden">
        <div className="flex space-x-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleQuestionClick}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Pregunta
          </Button>
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={handleTestRideClick}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Prueba
          </Button>
        </div>
      </div>
    </footer>
  );
}
