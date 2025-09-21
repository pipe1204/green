"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  MessageCircle,
  Leaf,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export default function Footer() {
  const [testRideForm, setTestRideForm] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    productInterest: "",
    message: "",
  });

  const [questionForm, setQuestionForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleTestRideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "test-ride",
          data: testRideForm,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar la solicitud");
      }

      alert("¡Solicitud de prueba enviada! Nos pondremos en contacto pronto.");
      setTestRideForm({
        name: "",
        email: "",
        phone: "",
        preferredDate: "",
        preferredTime: "",
        productInterest: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting test ride request:", error);
      alert("Error al enviar la solicitud. Por favor, inténtelo de nuevo.");
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "question",
          data: questionForm,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar la pregunta");
      }

      alert("¡Pregunta enviada! Responderemos pronto.");
      setQuestionForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting question:", error);
      alert("Error al enviar la pregunta. Por favor, inténtelo de nuevo.");
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Test Ride Section */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <div className="flex items-center mb-6">
              <Calendar className="w-8 h-8 text-primary mr-3" />
              <h3 className="text-2xl font-bold">Programa una Prueba</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Experimenta la emoción de conducir un vehículo eléctrico. Programa
              una prueba gratuita y descubre por qué Green es la mejor opción.
            </p>

            <form onSubmit={handleTestRideSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Nombre completo"
                  value={testRideForm.name}
                  onChange={(e) =>
                    setTestRideForm({ ...testRideForm, name: e.target.value })
                  }
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={testRideForm.email}
                  onChange={(e) =>
                    setTestRideForm({ ...testRideForm, email: e.target.value })
                  }
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="tel"
                  placeholder="Teléfono"
                  value={testRideForm.phone}
                  onChange={(e) =>
                    setTestRideForm({ ...testRideForm, phone: e.target.value })
                  }
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
                <select
                  value={testRideForm.productInterest}
                  onChange={(e) =>
                    setTestRideForm({
                      ...testRideForm,
                      productInterest: e.target.value,
                    })
                  }
                  required
                  className="flex h-10 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <option value="">Producto de interés</option>
                  <option value="eco-rider-pro">Eco Rider Pro</option>
                  <option value="urban-scooter-lite">Urban Scooter Lite</option>
                  <option value="mountain-bike-electric">
                    Mountain Bike Eléctrica
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="date"
                  value={testRideForm.preferredDate}
                  onChange={(e) =>
                    setTestRideForm({
                      ...testRideForm,
                      preferredDate: e.target.value,
                    })
                  }
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
                <select
                  value={testRideForm.preferredTime}
                  onChange={(e) =>
                    setTestRideForm({
                      ...testRideForm,
                      preferredTime: e.target.value,
                    })
                  }
                  required
                  className="flex h-10 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <option value="">Hora preferida</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                </select>
              </div>

              <Textarea
                placeholder="Mensaje adicional (opcional)"
                value={testRideForm.message}
                onChange={(e) =>
                  setTestRideForm({ ...testRideForm, message: e.target.value })
                }
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                rows={3}
              />

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
              >
                Programar Prueba Gratuita
              </Button>
            </form>
          </div>

          {/* Questions Section */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <div className="flex items-center mb-6">
              <MessageCircle className="w-8 h-8 text-primary mr-3" />
              <h3 className="text-2xl font-bold">Haz una Pregunta</h3>
            </div>
            <p className="text-gray-300 mb-6">
              ¿Tienes dudas sobre nuestros vehículos? Nuestro equipo de expertos
              está aquí para ayudarte.
            </p>

            <form onSubmit={handleQuestionSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Nombre completo"
                  value={questionForm.name}
                  onChange={(e) =>
                    setQuestionForm({ ...questionForm, name: e.target.value })
                  }
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={questionForm.email}
                  onChange={(e) =>
                    setQuestionForm({ ...questionForm, email: e.target.value })
                  }
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              <Input
                type="tel"
                placeholder="Teléfono"
                value={questionForm.phone}
                onChange={(e) =>
                  setQuestionForm({ ...questionForm, phone: e.target.value })
                }
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />

              <Textarea
                placeholder="Tu pregunta o comentario"
                value={questionForm.message}
                onChange={(e) =>
                  setQuestionForm({ ...questionForm, message: e.target.value })
                }
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                rows={4}
              />

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
              >
                Enviar Pregunta
              </Button>
            </form>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4 flex items-center">
                <Leaf className="w-5 h-5 mr-2 text-primary" />
                Green
              </h4>
              <p className="text-gray-400 text-sm">
                Vehículos eléctricos sostenibles para un futuro más limpio en
                Colombia.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Vehículos</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Eco Rider Pro</li>
                <li>Urban Scooter Lite</li>
                <li>Mountain Bike Eléctrica</li>
                <li>Próximamente</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Centro de Ayuda</li>
                <li>Garantía</li>
                <li>Mantenimiento</li>
                <li>Financiación</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <div className="space-y-2 text-sm text-gray-400">
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
      <div className="bg-gray-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2024 Green. Todos los derechos reservados.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacidad
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Términos
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contacto
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Noticias
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Ubicaciones
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 md:hidden">
        <div className="flex space-x-4">
          <Button variant="outline" className="flex-1">
            <MessageCircle className="w-4 h-4 mr-2" />
            Pregunta
          </Button>
          <Button className="flex-1">
            <Calendar className="w-4 h-4 mr-2" />
            Prueba
          </Button>
        </div>
      </div>
    </footer>
  );
}
