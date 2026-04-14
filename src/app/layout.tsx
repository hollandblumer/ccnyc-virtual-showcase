// src/app/layout.tsx
import { Bungee, Manrope } from "next/font/google";

import "./globals.css";
import PasswordGate from "@/components/PasswordGate"; // Path should work now

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const bungee = Bungee({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bungee",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${bungee.variable}`}>
        <PasswordGate>{children}</PasswordGate>
      </body>
    </html>
  );
}
