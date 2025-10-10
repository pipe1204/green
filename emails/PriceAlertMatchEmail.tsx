import * as React from "react";
import { Text, Section, Img } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";
import { EmailButton } from "./components/EmailButton";
import { PriceAlertMatchEmailData } from "@/types/email";

export function PriceAlertMatchEmail(props: PriceAlertMatchEmailData) {
  const {
    recipientName,
    vehicleName,
    vehicleBrand,
    oldPrice,
    newPrice,
    targetPrice,
    savings,
    vehicleUrl,
    vehicleImageUrl,
  } = props;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <EmailLayout
      previewText={`¡Alerta de precio! ${vehicleBrand} ${vehicleName} ahora a tu precio deseado`}
    >
      <Text style={heading}>¡Alerta de Precio Activada! 🎉</Text>

      <Text style={paragraph}>Hola {recipientName},</Text>

      <Text style={paragraph}>
        ¡Buenas noticias! El{" "}
        <strong>
          {vehicleBrand} {vehicleName}
        </strong>{" "}
        ahora está a tu precio deseado.
      </Text>

      {vehicleImageUrl && (
        <Section style={imageContainer}>
          <Img
            src={vehicleImageUrl}
            alt={`${vehicleBrand} ${vehicleName}`}
            style={vehicleImage}
          />
        </Section>
      )}

      <Section style={priceBox}>
        <div style={priceRow}>
          <Text style={priceLabel}>Precio anterior:</Text>
          <Text style={oldPriceValue}>{formatPrice(oldPrice)}</Text>
        </div>
        <div style={priceRow}>
          <Text style={priceLabel}>Precio actual:</Text>
          <Text style={newPriceValue}>{formatPrice(newPrice)}</Text>
        </div>
        <div style={priceRow}>
          <Text style={priceLabel}>Tu precio objetivo:</Text>
          <Text style={targetPriceValue}>{formatPrice(targetPrice)}</Text>
        </div>
      </Section>

      <Section style={savingsBox}>
        <Text style={savingsText}>¡Ahorras {formatPrice(savings)}! 💰</Text>
      </Section>

      <EmailButton href={vehicleUrl} text="Ver vehículo" />

      <Text style={urgencyNote}>
        Este precio especial podría no durar mucho. ¡No pierdas esta
        oportunidad!
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

const imageContainer = {
  textAlign: "center" as const,
  margin: "20px 0",
};

const vehicleImage = {
  width: "100%",
  maxWidth: "400px",
  height: "auto",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
};

const priceBox = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "20px",
  margin: "20px 0",
};

const priceRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  margin: "12px 0",
};

const priceLabel = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "0",
};

const oldPriceValue = {
  fontSize: "16px",
  color: "#9ca3af",
  margin: "0",
  textDecoration: "line-through",
};

const newPriceValue = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#10b981",
  margin: "0",
};

const targetPriceValue = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#374151",
  margin: "0",
};

const savingsBox = {
  backgroundColor: "#f0fdf4",
  border: "2px solid #10b981",
  borderRadius: "8px",
  padding: "16px",
  textAlign: "center" as const,
  margin: "20px 0",
};

const savingsText = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#10b981",
  margin: "0",
};

const urgencyNote = {
  fontSize: "14px",
  lineHeight: "20px",
  color: "#dc2626",
  fontWeight: "600",
  textAlign: "center" as const,
  margin: "16px 0",
};
