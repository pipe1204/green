"use client";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import Footer from "@/components/Footer";
import ComparisonSection from "@/components/ComparisonSection";
import CTASection from "@/components/CTASection";
import { ComparisonProvider } from "@/components/context/ComparisonContext";

export default function Home() {
  return (
    <ComparisonProvider>
      <div className="min-h-screen bg-white pb-16">
        <Header />
        <main>
          <HeroSection />
          <HowItWorksSection />
          <ComparisonSection />
        </main>
        <CTASection targetSection="vehiculos" />

        <Footer />
      </div>
    </ComparisonProvider>
  );
}
