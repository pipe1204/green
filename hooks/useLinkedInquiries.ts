"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useNotification } from "@/components/ui/notification";

export function useLinkedInquiries() {
  const { user } = useAuth();
  const { addNotification, NotificationContainer } = useNotification();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!user || hasChecked) return;

    // Check if there are linked inquiries from localStorage
    const linkedCount = localStorage.getItem("linkedInquiriesCount");

    if (linkedCount && parseInt(linkedCount) > 0) {
      const count = parseInt(linkedCount);
      const message =
        count === 1
          ? "¡Excelente! Hemos vinculado 1 mensaje que enviaste como invitado a tu cuenta."
          : `¡Excelente! Hemos vinculado ${count} mensajes que enviaste como invitado a tu cuenta.`;

      addNotification(message, "success");

      // Clear the stored count
      localStorage.removeItem("linkedInquiriesCount");
    }

    setHasChecked(true);
  }, [user, hasChecked, addNotification]);

  return { NotificationContainer };
}
