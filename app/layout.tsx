import "./globals.css";
import type { Metadata } from "next";
import { BrandSync } from "@/components/brand";
import { BRAND_INIT_SCRIPT } from "@/lib/brand";

export const metadata: Metadata = {
  title: "NGT.Academy — Dashboards Prototype",
  description: "Native LMS dashboards prototype: internal (SSM) and student views.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BRAND_INIT_SCRIPT }} />
      </head>
      <body>
        <BrandSync />
        {children}
      </body>
    </html>
  );
}
