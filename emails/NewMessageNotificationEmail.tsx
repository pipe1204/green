import * as React from "react";
import { Text } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";
import { EmailButton } from "./components/EmailButton";
import { NewMessageNotificationEmailData } from "@/types/email";

export function NewMessageNotificationEmail(
  props: NewMessageNotificationEmailData
) {
  const {
    recipientName,
    senderName,
    messagePreview,
    dashboardUrl,
    recipientType,
  } = props;

  return (
    <EmailLayout previewText={`Nuevo mensaje de ${senderName}`}>
      <Text style={heading}>Tienes un Nuevo Mensaje</Text>

      <Text style={paragraph}>Hola {recipientName},</Text>

      <Text style={paragraph}>
        <strong>{senderName}</strong> te ha enviado un mensaje en Green.
      </Text>

      <Text style={previewLabel}>Vista previa del mensaje:</Text>
      <Text style={messagePreviewBox}>{messagePreview}...</Text>

      <EmailButton href={dashboardUrl} text="Ver mensaje" />

      <Text style={footerNote}>
        Para leer el mensaje completo y responder, inicia sesión en tu panel de
        control.
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

const previewLabel = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#6b7280",
  margin: "20px 0 8px",
  textTransform: "uppercase" as const,
};

const messagePreviewBox = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "16px",
  fontSize: "14px",
  lineHeight: "22px",
  color: "#374151",
  margin: "8px 0 20px",
  fontStyle: "italic" as const,
};

const footerNote = {
  fontSize: "14px",
  lineHeight: "20px",
  color: "#6b7280",
  margin: "16px 0",
};
