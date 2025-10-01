"use client";

import { useLinkedInquiries } from "@/hooks/useLinkedInquiries";

export function NotificationWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { NotificationContainer } = useLinkedInquiries();

  return (
    <>
      {children}
      <NotificationContainer />
    </>
  );
}
