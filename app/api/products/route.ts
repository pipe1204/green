import { NextResponse } from "next/server";
import { products, getProductById } from "@/data/products";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");
    const type = searchParams.get("type");

    if (productId) {
      const product = getProductById(productId);
      if (!product) {
        return NextResponse.json(
          { error: "Producto no encontrado" },
          { status: 404 }
        );
      }
      return NextResponse.json(product);
    }

    if (type) {
      const filteredProducts = products.filter(
        (product) => product.type === type
      );
      return NextResponse.json(filteredProducts);
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
