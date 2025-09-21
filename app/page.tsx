"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductCatalog from "@/components/ProductCatalog";
import OrderModal from "@/components/OrderModal";
import Footer from "@/components/Footer";
import { Product, ColorOption } from "@/types";

export default function Home() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);

  useEffect(() => {
    const handleOpenOrderModal = (event: CustomEvent) => {
      const { product, color } = event.detail;
      handleOrderProduct(product, color);
    };

    window.addEventListener(
      "openOrderModal",
      handleOpenOrderModal as EventListener
    );

    return () => {
      window.removeEventListener(
        "openOrderModal",
        handleOpenOrderModal as EventListener
      );
    };
  }, []);

  const handleOrderProduct = (product: Product, color: ColorOption) => {
    setSelectedProduct(product);
    setSelectedColor(color);
    setIsOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false);
    setSelectedProduct(null);
    setSelectedColor(null);
  };

  return (
    <div className="min-h-screen bg-white pb-16">
      <Header />

      <main>
        <HeroSection />
        <ProductCatalog onOrderProduct={handleOrderProduct} />
      </main>

      <Footer />

      {/* Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={handleCloseOrderModal}
        product={selectedProduct}
        selectedColor={selectedColor}
      />
    </div>
  );
}
