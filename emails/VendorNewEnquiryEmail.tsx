import * as React from "react";
import { Text, Section } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";
import { EmailButton } from "./components/EmailButton";
import { VendorNewEnquiryEmailData } from "@/types/email";

export function VendorNewEnquiryEmail(props: VendorNewEnquiryEmailData) {
  const {
    recipientName,
    customerName,
    vehicleName,
    vehicleBrand,
    message,
    dashboardUrl,
    isGuest,
  } = props;

  return (
    <EmailLayout
      previewText={`Nueva consulta sobre ${vehicleBrand} ${vehicleName}`}
    >
      <Text style={heading}>¡Nueva Consulta de Cliente!</Text>

      <Text style={paragraph}>Hola {recipientName},</Text>

      <Text style={paragraph}>
        {isGuest ? "Un cliente" : "Un cliente registrado"} está interesado en tu{" "}
        <strong>
          {vehicleBrand} {vehicleName}
        </strong>{" "}
        y ha enviado una consulta.
      </Text>

      <Section style={infoBox}>
        <Text style={infoTitle}>Detalles de la Consulta:</Text>
        <Text style={infoItem}>
          <strong>Cliente:</strong> {customerName}
        </Text>
        <Text style={infoItem}>
          <strong>Mensaje:</strong>
        </Text>
        <Text style={messageBox}>{message}</Text>
        <Text style={noteText}>
          💡 Ve a tu panel para ver los detalles de contacto completos y
          responder al cliente.
        </Text>
      </Section>

      <EmailButton href={dashboardUrl} text="Ve a tu panel" />

      <Text style={paragraph}>
        Responde rápido para aumentar tus posibilidades de venta.
      </Text>
    </EmailLayout>
  );
}

// Styles
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

const infoBox = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "16px",
  margin: "20px 0",
};

const infoTitle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#6b7280",
  margin: "0 0 12px",
  textTransform: "uppercase" as const,
};

const infoItem = {
  fontSize: "14px",
  lineHeight: "20px",
  color: "#374151",
  margin: "8px 0",
};

const messageBox = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "4px",
  padding: "12px",
  fontSize: "14px",
  lineHeight: "20px",
  color: "#374151",
  margin: "8px 0",
  whiteSpace: "pre-wrap" as const,
};

const noteText = {
  fontSize: "13px",
  lineHeight: "18px",
  color: "#6b7280",
  margin: "12px 0 0",
  fontStyle: "italic" as const,
};
