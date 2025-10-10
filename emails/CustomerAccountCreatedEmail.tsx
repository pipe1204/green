import * as React from "react";
import { Text } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";
import { EmailButton } from "./components/EmailButton";
import { CustomerAccountCreatedEmailData } from "@/types/email";

export function CustomerAccountCreatedEmail(
  props: CustomerAccountCreatedEmailData
) {
  const { recipientName, customerName, inquiryCount, dashboardUrl } = props;

  return (
    <EmailLayout previewText={`${customerName} ha creado una cuenta en Green`}>
      <Text style={heading}>¡Cliente Registrado! 🎉</Text>

      <Text style={paragraph}>Hola {recipientName},</Text>

      <Text style={paragraph}>
        <strong>{customerName}</strong> ha creado una cuenta en Green y ahora
        puede comunicarse contigo directamente a través de la plataforma.
      </Text>

      <Text style={paragraph}>
        Podrás ver sus datos de contacto completos en tu panel de control.
      </Text>

      <Text style={paragraph}>
        {inquiryCount > 1
          ? `Se han creado ${inquiryCount} conversaciones automáticamente basadas en sus consultas anteriores.`
          : "Se ha creado una conversación automáticamente basada en su consulta anterior."}
      </Text>

      <Text style={paragraph}>
        Ahora puedes comunicarte con {customerName} directamente en tu panel de
        control sin necesidad de emails.
      </Text>

      <EmailButton href={dashboardUrl} text="Ver Conversaciones" />

      <Text style={footerNote}>
        Las conversaciones están disponibles en la sección &quot;Mensajes&quot;
        de tu panel de control.
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

const footerNote = {
  fontSize: "14px",
  lineHeight: "20px",
  color: "#6b7280",
  margin: "16px 0",
};
