"use client";

import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <>
      {/* Main Footer Content */}
      <footer className="bg-white border-t border-gray-200">
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
                <li>Patinetas</li>
                <li>Bicicletas</li>
                <li>Carros</li>
                <li>Camiones</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Soporte</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Publica tu vehículo</li>
                <li>Energía</li>
                <li>Carga</li>
                <li>Descubrir</li>
                <li>Financiación</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Soporte</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Privacidad</li>
                <li>Términos</li>
                <li>Contacto</li>
                <li>Noticias</li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-600 mb-4 md:mb-0">
                © 2024 Green. Todos los derechos reservados.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
