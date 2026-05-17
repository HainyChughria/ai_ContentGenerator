import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI SaaS Platform",
  description: "Production-grade AI SaaS authentication foundation"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
