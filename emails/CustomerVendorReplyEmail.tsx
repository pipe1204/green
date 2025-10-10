import * as React from "react";
import { Text } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";
import { EmailButton } from "./components/EmailButton";
import { CustomerVendorReplyEmailData } from "@/types/email";

export function CustomerVendorReplyEmail(props: CustomerVendorReplyEmailData) {
  const {
    recipientName,
    vendorName,
    vehicleName,
    vehicleBrand,
    vendorMessage,
    loginUrl,
  } = props;

  return (
    <EmailLayout previewText={`${vendorName} respondió a tu consulta`}>
      <Text style={heading}>¡El Vendedor Respondió!</Text>

      <Text style={paragraph}>Hola {recipientName},</Text>

      <Text style={paragraph}>
        <strong>{vendorName}</strong> ha respondido a tu consulta sobre el{" "}
        <strong>
          {vehicleBrand} {vehicleName}
        </strong>
        .
      </Text>

      <Text style={messageBox}>{vendorMessage}</Text>

      <Text style={paragraph}>
        Para ver el mensaje completo y continuar la conversación, crea una
        cuenta gratis en Green.
      </Text>

      <EmailButton href={loginUrl} text="Crear cuenta / Iniciar sesión" />

      <Text style={footerNote}>
        Al crear una cuenta podrás gestionar todas tus consultas, guardar
        favoritos y recibir notificaciones sobre vehículos que te interesan.
      </Text>
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

const messageBox = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "16px",
  fontSize: "14px",
  lineHeight: "22px",
  color: "#374151",
  margin: "20px 0",
  fontStyle: "italic" as const,
};

const footerNote = {
  fontSize: "14px",
  lineHeight: "20px",
  color: "#6b7280",
  margin: "16px 0",
};
