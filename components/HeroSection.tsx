"use client";

import TextType from "@/components/TextType";
import CircularText from "./CircularText";
import FuzzyText from "./FuzzyText";
import ProductCatalog from "./ProductCatalog";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col items-center justify-center text-center min-h-[50vh] md:min-h-[80vh]">
          {/* Main Content */}
          <h1 className="text-4xl md:text-8xl font-bold text-gray-900 mb-6 leading-tight">
            Descubre tu Próximo
          </h1>
          <div className="max-w-4xl mx-auto">
            <FuzzyText
              baseIntensity={0.2}
              hoverIntensity={0.8}
              enableHover={true}
              color="#000"
            >
              Vehículo Eléctrico
            </FuzzyText>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              Busca y compara{" "}
              <TextType
                words={[
                  "características",
                  "precios",
                  "vida de la batería",
                  "garantía",
                  "autonomía",
                  "especificaciones",
                  "rendimiento",
                  "red de concesionarios",
                ]}
                className="text-orange-600 font-semibold"
                typingSpeed={80}
                deletingSpeed={40}
                pauseTime={2500}
              />{" "}
              de diferentes marcas y modelos de vehiculos electricos en un solo
              lugar.
            </p>
          </div>
        </div>
      </div>
      <ProductCatalog />
      <div className="my-10">
        <CircularText
          text="AHORRA*AYUDA*AMBIENTE*"
          onHover="speedUp"
          spinDuration={20}
          textColor="text-black"
          className="custom-class"
        />
      </div>
    </section>
  );
}
