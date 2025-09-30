"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle, Leaf, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const handleQuestionClick = () => {
    // You can implement a simple contact modal or redirect to a contact page
    window.open(
      "mailto:info@green.co?subject=Consulta sobre vehículos eléctricos",
      "_blank"
    );
  };

  return (
    <>
      {/* Main Footer Content */}
      <footer className="bg-white border-t border-gray-200 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          {/* Contact Info */}
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
                <li>Motocicletas</li>
                <li>Scooters</li>
                <li>Bicicletas</li>
                <li>Carros</li>
                <li>Camiones</li>
              </ul>
            </div>

            {/* <div>
              <h4 className="font-semibold mb-4 text-gray-900">Soporte</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Centro de Ayuda</li>
                <li>Garantía</li>
                <li>Mantenimiento</li>
                <li>Financiación</li>
              </ul>
            </div> */}

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

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-gray-200">
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
      </footer>

      {/* Sticky Bottom Actions - Always visible */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-50">
        <div className="max-w-md mx-auto flex space-x-3">
          <Button
            onClick={handleQuestionClick}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 h-12 md:h-10 text-sm font-normal"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Preguntanos algo
          </Button>
        </div>
      </div>
    </>
  );
}
