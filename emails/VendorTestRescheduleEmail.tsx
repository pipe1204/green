import * as React from "react";
import { Text, Section } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";
import { EmailButton } from "./components/EmailButton";
import { VendorTestRescheduleEmailData } from "@/types/email";

export function VendorTestRescheduleEmail(
  props: VendorTestRescheduleEmailData
) {
  const {
    recipientName,
    customerName,
    vehicleName,
    vehicleBrand,
    oldDate,
    oldTime,
    newDate,
    newTime,
    reason,
    dashboardUrl,
  } = props;

  return (
    <EmailLayout
      previewText={`Prueba de manejo reprogramada - ${vehicleBrand} ${vehicleName}`}
    >
      <Text style={heading}>Prueba de Manejo Reprogramada</Text>

      <Text style={paragraph}>Hola {recipientName},</Text>

      <Text style={paragraph}>
        {customerName} ha solicitado reprogramar la prueba de manejo del{" "}
        <strong>
          {vehicleBrand} {vehicleName}
        </strong>
        .
      </Text>

      <Section style={comparisonBox}>
        <div style={dateBlock}>
          <Text style={dateLabel}>Fecha Original:</Text>
          <Text style={dateValue}>
            {oldDate} a las {oldTime}
          </Text>
        </div>
        <Text style={arrow}>→</Text>
        <div style={dateBlock}>
          <Text style={dateLabel}>Nueva Fecha Propuesta:</Text>
          <Text style={dateValueNew}>
            {newDate} a las {newTime}
          </Text>
        </div>
      </Section>

      <Text style={reasonTitle}>Motivo del cambio:</Text>
      <Text style={reasonBox}>{reason}</Text>

      <EmailButton href={dashboardUrl} text="Ve a tu panel" />

      <Text style={paragraph}>
        Por favor revisa la nueva fecha y confirma o propone una alternativa.
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

const comparisonBox = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "20px",
  margin: "20px 0",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const dateBlock = {
  flex: "1",
};

const dateLabel = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#6b7280",
  margin: "0 0 4px",
  textTransform: "uppercase" as const,
};

const dateValue = {
  fontSize: "14px",
  color: "#9ca3af",
  margin: "0",
  textDecoration: "line-through",
};

const dateValueNew = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#10b981",
  margin: "0",
};

const arrow = {
  fontSize: "24px",
  color: "#10b981",
  margin: "0 16px",
  fontWeight: "bold",
};

const reasonTitle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#6b7280",
  margin: "20px 0 8px",
  textTransform: "uppercase" as const,
};

const reasonBox = {
  backgroundColor: "#fef3c7",
  border: "1px solid #f59e0b",
  borderRadius: "8px",
  padding: "16px",
  fontSize: "14px",
  lineHeight: "22px",
  color: "#374151",
  margin: "8px 0 20px",
  whiteSpace: "pre-wrap" as const,
};
