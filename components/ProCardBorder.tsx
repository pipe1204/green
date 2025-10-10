import React from "react";

interface ProCardBorderProps {
  isPro: boolean;
  children: React.ReactNode;
  className?: string;
}

export function ProCardBorder({
  isPro,
  children,
  className = "",
}: ProCardBorderProps) {
  if (!isPro) {
    // Not a Pro vendor - render children normally
    return <>{children}</>;
  }

  // Pro vendor - wrap with gradient border
  return (
    <div className={`pro-card-wrapper ${className}`}>
      <style jsx>{`
        .pro-card-wrapper {
          position: relative;
          border-radius: 0.75rem; /* rounded-xl */
          padding: 2px; /* border width */
          background: linear-gradient(
            135deg,
            #6ee7b7 0%,
            #34d399 50%,
            #10b981 100%
          );
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
          box-shadow: 0 4px 16px rgba(52, 211, 153, 0.15);
        }

        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .pro-card-wrapper > :global(*) {
          border-radius: calc(0.75rem - 2px); /* inner radius */
        }
      `}</style>
      {children}
    </div>
  );
}
