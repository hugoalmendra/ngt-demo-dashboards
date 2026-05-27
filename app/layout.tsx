import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NGT.Academy — Dashboards Prototype",
  description: "Native LMS dashboards prototype: internal (SSM) and student views.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
