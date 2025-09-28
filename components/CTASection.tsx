"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";
import Lightning from "@/components/Lightning";

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
      className="relative w-full py-16 bg-white overflow-hidden"
      style={{ width: "100vw", marginLeft: "calc(-50vw + 50%)" }}
    >
      {/* Lightning Background */}
      <div className="absolute inset-0 z-0">
        <Lightning
          hue={220}
          xOffset={0}
          speed={0.8}
          intensity={0.6}
          size={1.2}
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Subtle gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/30 pointer-events-none"></div>

        <div className="text-center relative">
          {/* Main Heading */}
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 drop-shadow-lg">
            Encuentra tu Vehículo
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 drop-shadow-lg">
              Eléctrico Perfecto
            </span>
          </h2>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
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
          <p className="text-sm text-gray-500 mt-6 drop-shadow-md">
            ✨ Comparación gratuita • Sin compromiso • Resultados instantáneos
          </p>
        </div>
      </div>
    </section>
  );
}
