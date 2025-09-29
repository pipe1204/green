"use client";

import dynamic from "next/dynamic";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";

const Lightning = dynamic(() => import("@/components/Lightning"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-white" />,
});

const CTASection = dynamic(() => import("@/components/CTASection"), {
  ssr: false,
  loading: () => <div className="w-full py-16 bg-white" />,
});

const HowItWorksSection = dynamic(
  () => import("@/components/HowItWorksSection"),
  {
    ssr: false,
    loading: () => <div className="w-full py-16 bg-white" />,
  }
);

const ComparisonSection = dynamic(
  () => import("@/components/ComparsionSection"),
  {
    ssr: false,
    loading: () => <div className="w-full py-16 bg-white" />,
  }
);

export default function Home() {
  return (
    <div className="min-h-screen bg-white pb-16">
      <Header />
      <main>
        <div className="relative w-full min-h-screen">
          {/* Lightning Background */}
          <div className="absolute inset-0 z-0 overflow-hidden lightning-container">
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
      <CTASection />

      <Footer />
    </div>
  );
}
