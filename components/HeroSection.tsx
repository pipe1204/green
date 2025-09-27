"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import SplitText from "@/components/SplitText";
import TextType from "@/components/TextType";
import CircularText from "./CircularText";
import FuzzyText from "./FuzzyText";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-white mt-10"
      style={{ paddingTop: "4rem" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col items-center justify-center text-center min-h-[80vh]">
          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            <SplitText
              text="Descubre tu Próximo Vehículo"
              tag="h1"
              className="text-6xl md:text-8xl font-bold text-gray-900 mb-6 leading-tight"
              splitType="words, chars"
              delay={50}
              duration={0.8}
              from={{ opacity: 0, y: 60 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.2}
            />
            <FuzzyText
              baseIntensity={0.2}
              hoverIntensity={0.8}
              enableHover={true}
              color="#000"
            >
              Eléctrico
            </FuzzyText>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
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
                className="text-blue-600 font-semibold"
                typingSpeed={80}
                deletingSpeed={40}
                pauseTime={2500}
              />{" "}
              de diferentes marcas y modelos de vehiculos electricos en un solo
              lugar.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 flex items-center space-x-2"
                onClick={() => router.push("/vehiculos")}
              >
                <span>Explorar Vehículos</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 text-lg px-8 py-4"
                onClick={() => router.push("/test-ride")}
              >
                Agendar una Prueba
              </Button>
            </div>
            <div className="my-10">
              <CircularText
                text="AHORRA*AYUDA*AMBIENTE*"
                onHover="speedUp"
                spinDuration={20}
                textColor="text-black"
                className="custom-class"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
