"use client";

import { usePathname } from "next/navigation";
import React from "react";

export default function ConditionalLayout({
  children,
  navbar,
  footer,
}: {
  children: React.ReactNode;
  navbar?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const pathname = usePathname();

  // You can add other paths here where you want to hide the navbar/footer
  // For example: pathname?.startsWith("/admin") || pathname?.startsWith("/auth")
  const hideLayout = pathname?.startsWith("/dashboard");

  return (
    <>
      {!hideLayout && navbar}
      {children}
      {!hideLayout && footer}
    </>
  );
}
