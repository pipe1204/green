"use client";

import dynamic from "next/dynamic";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import ProductCatalog from "@/components/ProductCatalog";

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
        <HeroSection />
        <ProductCatalog />
        <HowItWorksSection />
        <ComparisonSection />
      </main>
      <CTASection />

      <Footer />
    </div>
  );
}
