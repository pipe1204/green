import { NextRequest, NextResponse } from "next/server";
import { Order, Customer, PaymentSchedule } from "@/types";

// In a real application, you would use a database
// For now, we'll use in-memory storage
const orders: Order[] = [];
const customers: Customer[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer, productId, selectedColor, totalAmount } = body;

    // Validate required fields
    if (!customer || !productId || !selectedColor || !totalAmount) {
      return NextResponse.json(
        { error: "Datos requeridos faltantes" },
        { status: 400 }
      );
    }

    // Create customer
    const customerId = `customer_${Date.now()}`;
    const newCustomer: Customer = {
      id: customerId,
      ...customer,
    };
    customers.push(newCustomer);

    // Calculate payment schedule
    const downPayment = Math.round(totalAmount * 0.25);
    const installmentAmount = Math.round((totalAmount - downPayment) / 4);
    const now = new Date();

    const paymentSchedule: PaymentSchedule = {
      downPayment: {
        amount: downPayment,
        dueDate: now,
        status: "pending",
      },
      installments: [
        {
          amount: installmentAmount,
          dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
          status: "pending",
          installmentNumber: 1,
        },
        {
          amount: installmentAmount,
          dueDate: new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000), // 4 weeks
          status: "pending",
          installmentNumber: 2,
        },
        {
          amount: installmentAmount,
          dueDate: new Date(now.getTime() + 42 * 24 * 60 * 60 * 1000), // 6 weeks
          status: "pending",
          installmentNumber: 3,
        },
        {
          amount: installmentAmount,
          dueDate: new Date(now.getTime() + 56 * 24 * 60 * 60 * 1000), // 8 weeks
          status: "pending",
          installmentNumber: 4,
        },
      ],
    };

    // Create order
    const orderId = `order_${Date.now()}`;
    const newOrder: Order = {
      id: orderId,
      customerId,
      productId,
      selectedColor,
      totalAmount,
      downPayment,
      installmentAmount,
      status: "pending",
      paymentSchedule,
      deliveryAddress: {
        street: customer.street,
        city: customer.city,
        state: customer.state,
        zipCode: customer.zipCode,
        country: customer.country,
      },
      createdAt: now,
      updatedAt: now,
    };

    orders.push(newOrder);

    // In a real application, you would:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Create payment links
    // 4. Integrate with payment processor

    return NextResponse.json({
      success: true,
      order: newOrder,
      message: "Pedido creado exitosamente",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");

    if (customerId) {
      const customerOrders = orders.filter(
        (order) => order.customerId === customerId
      );
      return NextResponse.json(customerOrders);
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
