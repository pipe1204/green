import * as React from "react";
import { Button } from "@react-email/components";

interface EmailButtonProps {
  href: string;
  text: string;
}

export function EmailButton({ href, text }: EmailButtonProps) {
  return (
    <Button href={href} style={button}>
      {text}
    </Button>
  );
}

const button = {
  backgroundColor: "#10b981",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
  margin: "24px 0",
};
