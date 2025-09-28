"use client";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import Footer from "@/components/Footer";
import ComparisonSection from "@/components/ComparisonSection";
import CTASection from "@/components/CTASection";
import { ComparisonProvider } from "@/components/context/ComparisonContext";
import Lightning from "@/components/Lightning";

export default function Home() {
  return (
    <ComparisonProvider>
      <div className="min-h-screen bg-white pb-16">
        <Header />
        <main>
          <div className="relative w-full min-h-screen">
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
            {/* Hero Section Overlay */}
            <div className="relative z-10">
              {/* Subtle gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/30 pointer-events-none"></div>
              <HeroSection />
            </div>
          </div>
          <HowItWorksSection />
          <ComparisonSection />
        </main>
        <CTASection targetSection="vehiculos" />

        <Footer />
      </div>
    </ComparisonProvider>
  );
}
