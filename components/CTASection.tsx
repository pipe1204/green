"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";
import LaserFlow from "@/components/LaserFlow";

interface CTASectionProps {
  targetSection?: string;
  targetUrl?: string;
}

export default function CTASection({
  targetSection = "vehiculos",
  targetUrl,
}: CTASectionProps) {
  const handleStartComparing = () => {
    if (targetUrl) {
      // Navigate to a specific URL
      window.location.href = targetUrl;
    } else {
      // Scroll to a section on the current page
      const element = document.getElementById(targetSection);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        // Fallback: navigate to the main page with the target section
        window.location.href = `/#${targetSection}`;
      }
    }
  };

  return (
    <section
      className="relative w-full py-16 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden"
      style={{ width: "100vw", marginLeft: "calc(-50vw + 50%)" }}
    >
      {/* LaserFlow Background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
      >
        <LaserFlow
          color="#00b4d8"
          wispDensity={1.2}
          fogIntensity={0.3}
          flowSpeed={0.4}
          wispSpeed={12.0}
          wispIntensity={4.0}
          flowStrength={0.3}
          verticalSizing={1.8}
          horizontalSizing={0.6}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Heading */}
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Encuentra tu Vehículo
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Eléctrico Perfecto
            </span>
          </h2>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Compara especificaciones, precios y características de diferentes
            marcas y modelos de vehículos eléctricos. Encuentra el que mejor se
            adapte a tus necesidades y presupuesto.
          </p>

          {/* CTA Button */}
          <Button
            onClick={handleStartComparing}
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-lg px-8 py-4 rounded-xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
          >
            <Search className="w-5 h-5 mr-2" />
            Comenzar a Comparar
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          {/* Additional Info */}
          <p className="text-sm text-gray-300 mt-6">
            ✨ Comparación gratuita • Sin compromiso • Resultados instantáneos
          </p>
        </div>
      </div>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20 z-5"></div>
    </section>
  );
}
