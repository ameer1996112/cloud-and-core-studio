import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cloud & Core Studio",
  description: "Mobile-first studio management app for Cloud & Core Studio.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
