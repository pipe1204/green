"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { Product, ColorOption } from "@/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  Calendar,
  Leaf,
  Zap,
  Shield,
  Clock,
  MapPin,
  CheckCircle,
} from "lucide-react";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const productId = params.id as string;
    const foundProduct = products.find((p) => p.id === productId);

    if (foundProduct) {
      setProduct(foundProduct);
      if (foundProduct.colors && foundProduct.colors.length > 0) {
        setSelectedColor(foundProduct.colors[0]);
      }
    }
  }, [params.id]);

  const handleOrderProduct = () => {};

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Producto no encontrado
          </h1>
          <Button onClick={() => router.push("/")} variant="outline">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  const currentImage =
    selectedColor && selectedColor.image
      ? {
          url: selectedColor.image,
          alt: `${product.name} ${selectedColor.name}`,
        }
      : product.images[selectedImageIndex];

  return (
    <div className="min-h-screen bg-white pb-16">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* Back Button */}
        <div className="py-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </Button>
        </div>

        {/* Product Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            {product.description}
          </p>
          <div className="mt-6 flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">
                {product.specifications.battery} de batería
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">
                {product.specifications.range} km de autonomía
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">
                {product.specifications.chargeTime} horas de carga
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
              <img
                src={currentImage?.url || "/images/placeholder.jpg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index
                      ? "border-blue-600"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            {/* Price */}
            <div>
              <h2 className="text-3xl font-bold text-blue-600 mb-2">
                ${product.price.toLocaleString("es-CO")} COP
              </h2>
              <p className="text-gray-600">
                Pago en 4 cuotas de $
                {(product.price / 4).toLocaleString("es-CO")} COP cada 2 semanas
              </p>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Elige tu color
              </h3>
              <div className="flex space-x-4">
                {product.colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => {
                      setSelectedColor(color);
                      setSelectedImageIndex(0);
                    }}
                    className={`w-12 h-12 rounded-full border-2 transition-all ${
                      selectedColor?.id === color.id
                        ? "border-blue-600 scale-110"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
              {selectedColor && (
                <p className="mt-2 text-sm text-gray-600">
                  Color seleccionado: {selectedColor.name}
                </p>
              )}
            </div>

            {/* Order Button */}
            <Button
              onClick={handleOrderProduct}
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
            >
              Ordena este modelo
            </Button>

            {/* Environmental Benefits */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Leaf className="w-5 h-5 text-blue-600 mr-2" />
                Beneficios Ambientales
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Cero emisiones contaminantes durante el uso
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Reduce tu huella de carbono significativamente
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Contribuye a un futuro más sostenible
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Especificaciones Técnicas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Zap className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Batería</h3>
              </div>
              <p className="text-gray-600">{product.specifications.battery}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <MapPin className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Autonomía
                </h3>
              </div>
              <p className="text-gray-600">{product.specifications.range} km</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Tiempo de Carga
                </h3>
              </div>
              <p className="text-gray-600">
                {product.specifications.chargeTime} horas
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Garantía
                </h3>
              </div>
              <p className="text-gray-600">{product.specifications.warranty}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Entrega</h3>
              </div>
              <p className="text-gray-600">{product.specifications.delivery}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Leaf className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Sostenibilidad
                </h3>
              </div>
              <p className="text-gray-600">
                {product.specifications.environmental}
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Características Principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {product.features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-700 text-lg">{feature}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gray-50 rounded-lg p-8 text-center mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Listo para hacer el cambio?
          </h2>
          <p className="text-gray-600 mb-6">
            Únete a la revolución eléctrica con {product.name}. Programa una
            prueba gratuita y experimenta el futuro del transporte.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleOrderProduct}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Ordenar Ahora
            </Button>
            <Button
              onClick={() => router.push("/test-ride")}
              variant="outline"
              size="lg"
            >
              Programar Prueba
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
