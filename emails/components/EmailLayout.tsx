import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
} from "@react-email/components";

interface EmailLayoutProps {
  children: React.ReactNode;
  previewText: string;
}

export function EmailLayout({ children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <Text style={logo}>⚡ Green</Text>
            <Text style={tagline}>Plataforma de Vehículos Eléctricos</Text>
          </Section>

          <Hr style={divider} />

          {/* Main Content */}
          <Section style={content}>{children}</Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Este es un correo automático de Green, tu plataforma de vehículos
              eléctricos en Colombia.
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} Green. Todos los derechos
              reservados.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0",
  marginBottom: "64px",
  maxWidth: "600px",
};

const header = {
  padding: "20px 40px",
  textAlign: "center" as const,
};

const logo = {
  color: "#10b981",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "0",
};

const tagline = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "4px 0 0",
};

const content = {
  padding: "20px 40px",
};

const divider = {
  borderColor: "#e5e7eb",
  margin: "20px 0",
};

const footer = {
  padding: "20px 40px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "20px",
  margin: "4px 0",
};
