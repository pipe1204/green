"use client";

import TextType from "@/components/TextType";
import CircularText from "./CircularText";
import FuzzyText from "./FuzzyText";
import Lightning from "./Lightning";

export default function HeroSection() {
  return (
    <section className="relative w-full py-16 bg-white overflow-hidden">
      {/* Desktop/Tablet background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex justify-center">
        <Lightning
          hue={179}
          xOffset={0.1}
          speed={0.8}
          intensity={0.4}
          size={1.2}
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="text-center relative">
          <div className="hidden md:block">
            <h1 className="text-8xl font-bold text-gray-900 mb-6 drop-shadow-lg">
              Descubre tu Próximo
            </h1>
            <FuzzyText
              fontSize="clamp(3rem, 12vw, 6rem)"
              baseIntensity={0.2}
              hoverIntensity={0.8}
              enableHover={true}
              color="#000"
            >
              Vehículo Eléctrico
            </FuzzyText>
          </div>
          <div className="block md:hidden">
            <h1 className="text-4xl md:text-8xl font-bold text-gray-900 mb-6 drop-shadow-lg">
              Descubre tu Próximo Vehículo Eléctrico
            </h1>
          </div>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed drop-shadow-md">
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
      <div className="my-10">
        <CircularText
          text="AHORRA*Y*AYUDA*AL*AMBIENTE*"
          onHover="speedUp"
          spinDuration={20}
          textColor="text-black"
          className="custom-class"
        />
      </div>
    </section>
  );
}
