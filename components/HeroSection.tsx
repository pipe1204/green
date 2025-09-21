"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { featuredProducts } from "@/data/products";

export default function HeroSection() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentProduct = featuredProducts[currentSlide];

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url('/images/hero-bg-${currentSlide + 1}.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          {currentProduct.name}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-100">
          {currentProduct.description}
        </p>

        {/* Key Benefits */}
        <div className="mb-8 space-y-2">
          <p className="text-lg font-semibold">
            Ahorra $2,500,000 COP anuales en combustible
          </p>
          <p className="text-base text-gray-200">
            Cero emisiones • Entrega en 5-7 días hábiles
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-4"
            onClick={() => {
              // Trigger the order modal with the current product
              const event = new CustomEvent("openOrderModal", {
                detail: {
                  product: currentProduct,
                  color: currentProduct.colors[0],
                },
              });
              window.dispatchEvent(event);
            }}
          >
            Ordena este modelo
          </Button>
          <Button
            variant="default"
            size="lg"
            className="border-white text-white text-lg px-8 py-4"
            onClick={() => router.push(`/product/${currentProduct.id}`)}
          >
            Aprende más
          </Button>
        </div>

        {/* Price */}
        <div className="mt-8">
          <p className="text-2xl font-bold">
            Desde ${currentProduct.price.toLocaleString("es-CO")} COP
          </p>
          <p className="text-sm text-gray-300">
            Pago en 4 cuotas cada 2 semanas
          </p>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 text-white hover:bg-white/20"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 text-white hover:bg-white/20"
        onClick={nextSlide}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2">
          {featuredProducts.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 z-20">
        <div className="flex flex-col items-center text-white">
          <span className="text-xs mb-2">Desliza para ver más</span>
          <div className="w-px h-8 bg-white animate-pulse" />
        </div>
      </div>
    </section>
  );
}
