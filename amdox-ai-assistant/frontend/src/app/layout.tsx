import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AMDOX AI Assistant | Business Intelligence Suite",
  description: "Enterprise business intelligence and predictive analysis companion for AMDOX ERP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
