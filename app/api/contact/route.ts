import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    // Validate required fields
    if (!type || !data) {
      return NextResponse.json(
        { error: "Tipo de contacto y datos son requeridos" },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Save to database
    // 2. Send email notifications
    // 3. Create tickets in support system
    // 4. Integrate with CRM

    let responseMessage = "";

    switch (type) {
      case "test-ride":
        responseMessage = "Solicitud de prueba programada exitosamente";
        console.log("Test ride request:", data);
        break;
      case "question":
        responseMessage = "Pregunta enviada exitosamente";
        console.log("Question submitted:", data);
        break;
      case "general":
        responseMessage = "Mensaje enviado exitosamente";
        console.log("General contact:", data);
        break;
      default:
        return NextResponse.json(
          { error: "Tipo de contacto no válido" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: responseMessage,
    });
  } catch (error) {
    console.error("Error processing contact request:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
