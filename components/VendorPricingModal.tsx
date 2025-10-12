"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Check,
  X,
  Star,
  TrendingUp,
  BarChart3,
  Shield,
  MessageSquare,
  Tag,
  Zap,
  HeadphonesIcon,
  CreditCard,
  Bell,
  Search,
} from "lucide-react";

interface VendorPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerSignup?: () => void;
}

export function VendorPricingModal({
  isOpen,
  onClose,
  onTriggerSignup,
}: VendorPricingModalProps) {
  const { user, session } = useAuth();
  const router = useRouter();
  const [error, setError] = React.useState("");

  const handleStartFreeTrial = async () => {
    setError("");

    // Check if user is logged in
    if (!user || !session) {
      // Not logged in - open signup modal
      if (onTriggerSignup) {
        onTriggerSignup();
      }
      return;
    }

    // User is logged in - check their role
    try {
      const { data: profile } = await fetch("/api/user/profile").then((res) =>
        res.json()
      );

      if (profile?.role === "customer") {
        // Show error - customer trying to sign up as vendor
        setError(
          "Ya tienes una cuenta como comprador. Usa un email diferente para crear una cuenta de vendedor."
        );
        return;
      }

      if (profile?.role === "vendor") {
        // Already a vendor - redirect to dashboard
        onClose();
        router.push("/dashboard?notification=already-vendor");
        return;
      }
    } catch (err) {
      console.error("Error checking user profile:", err);
      setError("Ocurrió un error. Por favor intenta de nuevo.");
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center mb-2">
            Planes y Precios para Vendedores
          </DialogTitle>
          <p className="text-center text-gray-600 mb-4">
            Elige el plan perfecto para tu negocio
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-green-800 font-semibold flex items-center justify-center">
              <Zap className="w-5 h-5 mr-2" />
              🎉 Todos los nuevos vendedores reciben 30 días gratis del Plan Pro
            </p>
            <p className="text-green-700 text-sm mt-2">
              Después de la prueba, elige el plan que mejor se adapte a tu
              negocio
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <p className="text-red-800 text-sm text-center">{error}</p>
            </div>
          )}
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Starter Plan */}
          <div className="border-2 border-gray-200 rounded-xl p-8 hover:border-green-300 transition-all bg-white">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                🌱 Plan Starter
              </h3>
              <div className="flex items-baseline justify-center mb-4">
                <span className="text-4xl font-bold text-gray-900">
                  $69,900
                </span>
                <span className="text-gray-600 ml-2">COP / mes</span>
              </div>
              <p className="text-sm text-gray-600">
                Perfecto para vendedores pequeños o individuales
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">
                    Perfil público de vendedor
                  </p>
                  <p className="text-sm text-gray-600">
                    Con información de contacto y catálogo
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">
                    Publicaciones ilimitadas
                  </p>
                  <p className="text-sm text-gray-600">
                    Agrega todos los vehículos que quieras
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">
                    Ubicación estándar en búsquedas
                  </p>
                  <p className="text-sm text-gray-600">
                    Aparece en resultados de búsqueda
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <BarChart3 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">
                    Analíticas básicas
                  </p>
                  <p className="text-sm text-gray-600">
                    Vistas, clics y guardados
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MessageSquare className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">
                    Mensajería en plataforma
                  </p>
                  <p className="text-sm text-gray-600">
                    Contacto opcional por WhatsApp
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Tag className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">
                    Etiquetas promocionales
                  </p>
                  <p className="text-sm text-gray-600">
                    Marca vehículos en oferta (2 etiquetas al mes)
                  </p>
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-gray-600 hover:bg-gray-700 text-white"
              size="lg"
              onClick={handleStartFreeTrial}
            >
              Comenzar Prueba Gratis
            </Button>
            <p className="text-center text-xs text-gray-500 mt-3">
              💡 Ideal para pequeños distribuidores
            </p>
          </div>

          {/* Pro Plan */}
          <div className="border-2 border-green-500 rounded-xl p-8 bg-gradient-to-br from-green-50 to-blue-50 relative">
            <div className="absolute top-0 right-8 transform -translate-y-1/2">
              <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                ⭐ MÁS POPULAR
              </span>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                ⚡ Plan Pro
              </h3>
              <div className="flex items-baseline justify-center mb-4">
                <span className="text-4xl font-bold text-green-600">
                  $159,900
                </span>
                <span className="text-gray-600 ml-2">COP / mes</span>
              </div>
              <p className="text-sm text-gray-600">
                Para negocios que quieren destacar y vender más
              </p>
            </div>

            <div className="bg-white/80 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-green-700 text-center">
                Todo lo del Plan Starter, más:
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <Star className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">
                    Ubicación prioritaria en búsquedas
                  </p>
                  <p className="text-sm text-gray-600">
                    Destaca en resultados y categorías
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <BarChart3 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">
                    Dashboard de analíticas avanzadas
                  </p>
                  <p className="text-sm text-gray-600">
                    CTR, leads por modelo, tendencias de conversión
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">
                    Insignia &quot;Vendedor Verificado&quot;
                  </p>
                  <p className="text-sm text-gray-600">
                    Después de verificación manual
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MessageSquare className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">
                    WhatsApp + mensajería directa
                  </p>
                  <p className="text-sm text-gray-600">
                    Contacto directo con compradores
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Tag className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">
                    Etiquetas promocionales ilimitadas
                  </p>
                  <p className="text-sm text-gray-600">
                    Descuentos y ofertas sin límites
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Search className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">
                    Destacado en homepage y campañas
                  </p>
                  <p className="text-sm text-gray-600">
                    Máxima visibilidad en la plataforma
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Bell className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">
                    Notificaciones de alertas de precio
                  </p>
                  <p className="text-sm text-gray-600">
                    Entérate cuándo tus vehículos activan alertas
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <HeadphonesIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">
                    Soporte prioritario y onboarding
                  </p>
                  <p className="text-sm text-gray-600">
                    Asistencia dedicada para tu negocio
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">
                    Acceso anticipado a financiamiento
                  </p>
                  <p className="text-sm text-gray-600">
                    Integración con Addi, RappiPay y bancos
                  </p>
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
              onClick={handleStartFreeTrial}
            >
              Comenzar Prueba Gratis
            </Button>
            <p className="text-center text-xs text-gray-600 mt-3">
              💡 Ideal para concesionarios y vendedores en crecimiento
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Comparación Detallada
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Funcionalidad
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">
                    Starter
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-green-600">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 px-4">Publicaciones de vehículos</td>
                  <td className="text-center py-3 px-4">
                    <span className="text-green-600 font-semibold">
                      Ilimitadas
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className="text-green-600 font-semibold">
                      Ilimitadas
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Perfil público</td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Analíticas básicas</td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Ubicación prioritaria</td>
                  <td className="text-center py-3 px-4">
                    <X className="w-5 h-5 text-gray-300 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Analíticas avanzadas</td>
                  <td className="text-center py-3 px-4">
                    <X className="w-5 h-5 text-gray-300 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Insignia Verificado</td>
                  <td className="text-center py-3 px-4">
                    <X className="w-5 h-5 text-gray-300 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4">WhatsApp directo</td>
                  <td className="text-center py-3 px-4 text-gray-600">
                    Opcional
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Destacado en homepage</td>
                  <td className="text-center py-3 px-4">
                    <X className="w-5 h-5 text-gray-300 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Soporte prioritario</td>
                  <td className="text-center py-3 px-4">
                    <X className="w-5 h-5 text-gray-300 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Integración financiamiento</td>
                  <td className="text-center py-3 px-4">
                    <X className="w-5 h-5 text-gray-300 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            ¿Tienes preguntas? Contáctanos en{" "}
            <a
              href="mailto:vendedores@green.com"
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              vendedores@green.com
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
