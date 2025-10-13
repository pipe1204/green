"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "./AuthProvider";
import { Loader2, Zap, Eye, EyeOff } from "lucide-react";
import { colombianDepartments, departmentLabels } from "@/data";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  defaultUserType?: "customer" | "vendor";
  lockUserType?: boolean;
}

export function SignUpModal({
  isOpen,
  onClose,
  onSwitchToLogin,
  defaultUserType = "customer",
  lockUserType = false,
}: SignUpModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [userType, setUserType] = useState<"customer" | "vendor">(
    defaultUserType
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Vendor-specific fields
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [nit, setNit] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");

  // Multiple locations support
  const [locations, setLocations] = useState([
    {
      address: "",
      department: "",
      city: "",
      isMain: true,
    },
  ]);

  const { signUp, signInWithGoogle } = useAuth();

  const getCitiesForDepartment = (dept: string) => {
    return (
      colombianDepartments[dept as keyof typeof colombianDepartments] || []
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (userType === "vendor" && nit) {
      const nitRegex = /^\d{9}-\d$/;
      if (!nitRegex.test(nit.trim())) {
        setError(
          "El NIT debe tener el formato: 9 dígitos + 1 dígito de verificación (ej: 900123456-7)"
        );
        setLoading(false);
        return;
      }
    }

    // Validate phone number for vendors (must have country code)
    if (userType === "vendor" && phone) {
      // Must start with + and have country code
      const phoneRegex = /^\+[1-9]\d{7,14}$/; // International format: +country code + 7-14 digits
      const cleanPhone = phone.replace(/[\s\-\(\)]/g, ""); // Remove spaces, dashes, parentheses
      if (!phoneRegex.test(cleanPhone)) {
        setError(
          "El teléfono debe incluir código de país internacional (ej: +61 4xx xxx xxx, +57 300 xxx xxxx, +1 555 xxx xxxx)"
        );
        setLoading(false);
        return;
      }
    }

    const { error } = await signUp(email, password, fullName, userType);

    if (error) {
      setError(error.message);
    } else {
      // If vendor signup is successful, store vendor data in localStorage for callback
      if (userType === "vendor" && businessName) {
        const vendorData = {
          businessName,
          businessType,
          nit,
          phone,
          website,
          locations,
        };
        localStorage.setItem("pendingVendorData", JSON.stringify(vendorData));
      }
      setSuccess(true);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-center text-gray-900">
              ¡Registro Exitoso!
            </DialogTitle>
          </DialogHeader>

          <div className="text-center space-y-4">
            {userType === "vendor" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="text-4xl mb-2">🎉</div>
                <p className="font-bold text-green-800 mb-1">
                  ¡Tienes 30 días gratis del Plan Pro!
                </p>
                <p className="text-sm text-green-700">
                  Accede a todas las funcionalidades premium sin costo
                </p>
              </div>
            )}
            <p className="text-gray-600">
              Te hemos enviado un enlace de confirmación a tu email.
            </p>
            <p className="text-sm text-gray-500">
              Revisa tu bandeja de entrada o el spam y haz clic en el enlace
              para activar tu cuenta.
            </p>

            <Button
              onClick={onClose}
              className="w-full bg-green-600 text-white"
            >
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Crear Cuenta
          </DialogTitle>
        </DialogHeader>

        {/* User Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            ¿Qué tipo de usuario eres?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setUserType("customer")}
              disabled={lockUserType}
              className={`p-3 rounded-lg border-2 text-center transition-colors ${
                userType === "customer"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : lockUserType
                    ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-sm font-medium">Comprador</div>
              <div className="text-xs text-gray-500">Buscar vehículos</div>
            </button>
            <button
              type="button"
              onClick={() => setUserType("vendor")}
              disabled={lockUserType}
              className={`p-3 rounded-lg border-2 text-center transition-colors ${
                userType === "vendor"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : lockUserType
                    ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-sm font-medium">Vendedor</div>
              <div className="text-xs text-gray-500">Mostrar vehículos</div>
            </button>
          </div>
          {lockUserType && userType === "vendor" && (
            <p className="text-xs text-gray-600 mt-2 text-center">
              Registrándote como vendedor desde el plan de precios
            </p>
          )}
        </div>

        {/* 30-Day Pro Trial Banner for Vendors */}
        {userType === "vendor" && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-white text-lg">🎉</span>
              </div>
              <h3 className="font-bold text-green-800 text-lg">
                ¡30 Días Gratis del Plan Pro!
              </h3>
            </div>
            <p className="text-sm text-green-700 mb-2">
              Como vendedor nuevo, tendrás acceso completo a todas las
              funcionalidades premium por 30 días:
            </p>
            <ul className="text-sm text-green-700 space-y-1 ml-4">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Ubicación prioritaria en búsquedas</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Analíticas avanzadas</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Insignia de vendedor verificado</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Promociones ilimitadas</span>
              </li>
            </ul>
            <p className="text-xs text-green-600 mt-3 font-semibold">
              Después de la prueba, elige el plan que mejor se adapte a tu
              negocio.
            </p>
          </div>
        )}

        {/* WhatsApp Contact Emphasis for Vendors */}
        {userType === "vendor" && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">📱</span>
              </div>
              <h3 className="font-semibold text-green-800">
                Contacto WhatsApp
              </h3>
            </div>
            <p className="text-sm text-green-700">
              Los clientes podrán contactarte directamente por WhatsApp usando
              tu número móvil. Asegúrate de incluir el código de país (ej: +57
              300 123 4567).
            </p>
          </div>
        )}

        {/* Google OAuth for Customers */}
        {userType === "customer" && (
          <div className="mb-4">
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                setLoading(true);
                const { error } = await signInWithGoogle();
                if (error) {
                  setError(error.message);
                }
                setLoading(false);
              }}
              disabled={loading}
              className="w-full"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar con Google
            </Button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">O</span>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre Completo
            </label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Tu nombre completo"
              className="bg-gray-50"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              className="bg-gray-50"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                className="pr-10 bg-gray-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirmar Contraseña
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                className="pr-10 bg-gray-50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Vendor-specific fields */}
          {userType === "vendor" && (
            <>
              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Información del Negocio
                </h4>
              </div>

              <div>
                <label
                  htmlFor="businessName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nombre del Negocio *
                </label>
                <Input
                  id="businessName"
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required={userType === "vendor"}
                  placeholder="Nombre de tu empresa o negocio"
                  className="bg-gray-50"
                />
              </div>

              <div>
                <label
                  htmlFor="businessType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tipo de Negocio
                </label>
                <Select
                  value={businessType}
                  onValueChange={setBusinessType}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de negocio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tienda">Tienda</SelectItem>
                    <SelectItem value="distribuidor">Distribuidor</SelectItem>
                    <SelectItem value="concesionario">Concesionario</SelectItem>
                    <SelectItem value="fabricante">Fabricante</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  htmlFor="nit"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  NIT *
                </label>
                <Input
                  id="nit"
                  type="text"
                  value={nit}
                  onChange={(e) => setNit(e.target.value)}
                  required={userType === "vendor"}
                  placeholder="900123456-7"
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Número de Identificación Tributaria (9 dígitos + 1 dígito de
                  verificación)
                </p>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Teléfono Móvil <span className="text-red-500">*</span>
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+61 4xx xxx xxx"
                  className="bg-gray-50"
                  required
                />
                <div className="mt-1 text-xs text-gray-600">
                  <p className="flex items-center gap-1">
                    <span className="text-green-600">📱</span>
                    <span>Número móvil con código de país internacional</span>
                  </p>
                  <p className="text-gray-500 text-xs">
                    Ejemplos: +61 4xx xxx xxx (Australia), +57 300 xxx xxxx
                    (Colombia), +1 555 xxx xxxx (USA)
                  </p>
                  <p className="text-green-600 font-medium">
                    Los clientes podrán contactarte por WhatsApp
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Sitio Web
                </label>
                <Input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://www.tu-empresa.com"
                  className="bg-gray-50"
                />
              </div>

              {/* Business Locations Section */}
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700">
                    Ubicaciones del Negocio
                  </h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setLocations([
                        ...locations,
                        {
                          address: "",
                          department: "",
                          city: "",
                          isMain: false,
                        },
                      ])
                    }
                    className="text-xs"
                  >
                    + Agregar Ubicación
                  </Button>
                </div>

                {locations.map((location, index) => (
                  <div
                    key={index}
                    className="mb-4 p-3 border rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        {location.isMain
                          ? "Ubicación Principal"
                          : `Ubicación ${index + 1}`}
                      </span>
                      {!location.isMain && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setLocations(
                              locations.filter((_, i) => i !== index)
                            )
                          }
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Eliminar
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Dirección
                        </label>
                        <Input
                          value={location.address}
                          onChange={(e) => {
                            const newLocations = [...locations];
                            newLocations[index].address = e.target.value;
                            setLocations(newLocations);
                          }}
                          placeholder="Dirección completa"
                          className="text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Departamento
                        </label>
                        <Select
                          value={location.department}
                          onValueChange={(value) => {
                            const newLocations = [...locations];
                            newLocations[index].department = value;
                            newLocations[index].city = ""; // Reset city
                            setLocations(newLocations);
                          }}
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(departmentLabels)
                              .sort(([, a], [, b]) => a.localeCompare(b))
                              .map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Ciudad
                        </label>
                        <Select
                          value={location.city}
                          onValueChange={(value) => {
                            const newLocations = [...locations];
                            newLocations[index].city = value;
                            setLocations(newLocations);
                          }}
                          disabled={!location.department}
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue
                              placeholder={
                                location.department
                                  ? "Seleccionar ciudad"
                                  : "Primero selecciona el departamento"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {getCitiesForDepartment(location.department).map(
                              (cityName) => (
                                <SelectItem key={cityName} value={cityName}>
                                  {cityName}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <Button
            type="submit"
            className="w-full bg-green-600 text-white"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Crear Cuenta
              </>
            )}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            ¿Ya tienes cuenta? Inicia sesión aquí
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
