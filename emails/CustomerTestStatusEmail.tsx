import * as React from "react";
import { Text, Section } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";
import { EmailButton } from "./components/EmailButton";
import { CustomerTestStatusEmailData } from "@/types/email";

export function CustomerTestStatusEmail(props: CustomerTestStatusEmailData) {
  const {
    recipientName,
    vendorName,
    vehicleName,
    vehicleBrand,
    status,
    vendorMessage,
    preferredDate,
    preferredTime,
    dashboardUrl,
  } = props;

  const isAccepted = status === "accepted";

  return (
    <EmailLayout
      previewText={`Actualización de tu prueba de manejo - ${
        isAccepted ? "Confirmada" : "Declinada"
      }`}
    >
      <Text style={heading}>
        {isAccepted
          ? "¡Tu Prueba de Manejo fue Confirmada! ✓"
          : "Actualización de tu Prueba de Manejo"}
      </Text>

      <Text style={paragraph}>Hola {recipientName},</Text>

      <Text style={paragraph}>
        {vendorName} ha respondido a tu solicitud de prueba de manejo para el{" "}
        <strong>
          {vehicleBrand} {vehicleName}
        </strong>
        .
      </Text>

      <Section style={isAccepted ? successBox : warningBox}>
        <Text style={statusText}>
          <strong>Estado:</strong> {isAccepted ? "✓ Confirmada" : "✗ Declinada"}
        </Text>
        {isAccepted && (
          <>
            <Text style={statusItem}>
              <strong>Fecha:</strong> {preferredDate}
            </Text>
            <Text style={statusItem}>
              <strong>Hora:</strong> {preferredTime}
            </Text>
          </>
        )}
      </Section>

      {vendorMessage ? (
        <>
          <Text style={messageTitle}>Mensaje del vendedor:</Text>
          <Text style={messageBox}>{vendorMessage}</Text>
        </>
      ) : (
        <Text style={paragraph}>
          El vendedor ha respondido a tu solicitud. Ve a tu panel para ver más
          detalles.
        </Text>
      )}

      <EmailButton href={dashboardUrl} text="Ver detalles" />

      {isAccepted ? (
        <Text style={paragraph}>
          Te esperamos en la fecha y hora acordadas. ¡Disfruta tu prueba de
          manejo!
        </Text>
      ) : (
        <Text style={paragraph}>
          No te preocupes, puedes programar una nueva prueba de manejo en otro
          momento o explorar otros vehículos.
        </Text>
      )}
    </EmailLayout>
  );
}

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#111827",
  margin: "0 0 20px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#374151",
  margin: "16px 0",
};

const successBox = {
  backgroundColor: "#f0fdf4",
  border: "2px solid #10b981",
  borderRadius: "8px",
  padding: "16px",
  margin: "20px 0",
};

const warningBox = {
  backgroundColor: "#fef3c7",
  border: "2px solid #f59e0b",
  borderRadius: "8px",
  padding: "16px",
  margin: "20px 0",
};

const statusText = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#111827",
  margin: "0 0 12px",
};

const statusItem = {
  fontSize: "14px",
  lineHeight: "20px",
  color: "#374151",
  margin: "8px 0",
};

const messageTitle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#6b7280",
  margin: "20px 0 8px",
  textTransform: "uppercase" as const,
};

const messageBox = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "16px",
  fontSize: "14px",
  lineHeight: "22px",
  color: "#374151",
  margin: "8px 0 20px",
  whiteSpace: "pre-wrap" as const,
};
